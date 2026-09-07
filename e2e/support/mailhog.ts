/**
 * Mailhog email assertion helper.
 * Queries the EU test inbox for sent emails and asserts content.
 */
export class MailhogHelper {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.MAILHOG_URL ?? "http://localhost:8025";
  }

  async getLatestEmail(to: string): Promise<{ subject: string; body: string } | null> {
    const res = await fetch(`${this.baseUrl}/api/v2/messages?limit=10`);
    const data = (await res.json()) as { items: Array<{ Content: { Headers: { Subject: string[] }; Body: string }; To: Array<{ Mailbox: string }> }> };
    const match = data.items?.find((m) => m.To?.some((t) => t.Mailbox === to));
    if (!match) return null;
    return { subject: match.Content.Headers.Subject[0], body: match.Content.Body };
  }

  async purgeAll(): Promise<void> {
    await fetch(`${this.baseUrl}/api/v1/messages`, { method: "DELETE" });
  }
}
