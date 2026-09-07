/**
 * Bitrix24 REST API client for verifying CRM side-effects.
 */
export class Bitrix24Api {
  private webhookUrl: string;

  constructor(webhookUrl?: string) {
    this.webhookUrl = webhookUrl ?? process.env.BITRIX24_WEBHOOK ?? "";
  }

  async getLead(id: string): Promise<unknown> {
    const res = await fetch(`${this.webhookUrl}/crm.lead.get?ID=${id}`);
    return res.json();
  }
}
