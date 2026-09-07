/**
 * Typed client for the staging viavitae-api.
 * Used by e2e specs to verify side-effects (e.g. assessment created via API).
 */
export class ViavitaeApi {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.STAGING_API_URL ?? "http://localhost:3000";
  }

  async health(): Promise<{ status: string }> {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json() as Promise<{ status: string }>;
  }

  async getAssessment(id: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/v1/assessments/${id}`);
    return res.json();
  }
}
