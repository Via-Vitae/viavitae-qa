/**
 * Keycloak test-realm user provisioning per run.
 * Creates test users before the suite and deletes them after.
 * The test realm is completely isolated from production.
 */
export class KeycloakTestHelper {
  private realmUrl: string;
  private adminToken: string;

  constructor(realmUrl?: string) {
    this.realmUrl = realmUrl ?? process.env.KEYCLOAK_TEST_REALM ?? "";
    this.adminToken = "";
  }

  async authenticate(adminUser: string, adminPassword: string): Promise<void> {
    const res = await fetch(`${this.realmUrl}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: "admin-cli",
        username: adminUser,
        password: adminPassword,
      }),
    });
    const data = (await res.json()) as { access_token: string };
    this.adminToken = data.access_token;
  }

  async createUser(username: string, password: string): Promise<string> {
    const res = await fetch(`${this.realmUrl}/admin/realms/test/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.adminToken}`,
      },
      body: JSON.stringify({
        username,
        enabled: true,
        credentials: [{ type: "password", value: password, temporary: false }],
      }),
    });
    const location = res.headers.get("Location") ?? "";
    return location.split("/").pop() ?? "";
  }

  async deleteUser(userId: string): Promise<void> {
    await fetch(`${this.realmUrl}/admin/realms/test/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.adminToken}` },
    });
  }
}
