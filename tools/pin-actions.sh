#!/usr/bin/env bash
# pin-actions.sh — resolve and rewrite every third-party `uses:` ref to a
# full-length commit SHA.  Safe to re-run: skips refs already SHA-pinned.
# Commits nothing — review the diff before pushing.
#
# Usage:  bash tools/pin-actions.sh
#
# Requires: gh CLI authenticated with a token that has read access to the
# action repositories (public repos need no special scope).
set -euo pipefail

resolve() {
  local repo="$1" tag="$2"
  local sha kind

  # Try tag first (covers most action refs like @v4, @v3)
  sha=$(gh api "repos/$repo/git/ref/tags/$tag" --jq '.object.sha' 2>/dev/null) || true
  if [[ -n "$sha" ]]; then
    # Annotated tag objects need one more dereference
    kind=$(gh api "repos/$repo/git/tags/$sha" --jq '.object.type' 2>/dev/null || echo "commit")
    if [[ "$kind" == "commit" ]]; then
      echo "$sha"
    else
      gh api "repos/$repo/git/tags/$sha" --jq '.object.sha'
    fi
  else
    # Fall back to branch ref (covers @main, @master)
    gh api "repos/$repo/git/ref/heads/$tag" --jq '.object.sha'
  fi
}

pinned=0
skipped=0
failed=0

for file in .github/workflows/*.yml .github/workflows/*.yaml; do
  [[ -e "$file" ]] || continue
  while IFS= read -r ref; do
    [[ "$ref" == ./* ]] && continue
    name="${ref%@*}"; tag="${ref#*@}"

    # Already SHA-pinned?
    if [[ "$tag" =~ ^[0-9a-f]{40}$ ]]; then
      echo "  skip (already pinned): $name@$tag"
      skipped=$((skipped + 1))
      continue
    fi

    sha="$(resolve "$name" "$tag")" || {
      echo "::error::Could not resolve $name@$tag"
      failed=$((failed + 1))
      continue
    }

    # F13 recurrence guard: validate SHA length before writing
    if ! [[ "$sha" =~ ^[0-9a-f]{40}$ ]]; then
      echo "::error::Resolved '$sha' for $name@$tag is not a 40-char SHA — aborting."
      exit 1
    fi

    echo "  pin: $file: $name@$tag -> $name@$sha # $tag"
    sed -i.bak "s|$name@$tag|$name@$sha # $tag|g" "$file" && rm -f "$file.bak"
    pinned=$((pinned + 1))
  done < <(grep -hoE '^\s*uses:\s*[^ ]+' "$file" | sed -E 's/^\s*uses:\s*//' | sort -u)
done

echo ""
echo "Summary: pinned=$pinned, skipped=$skipped, failed=$failed"
if [[ "$failed" -gt 0 ]]; then
  echo "::error::$failed action(s) could not be resolved."
  exit 1
fi
