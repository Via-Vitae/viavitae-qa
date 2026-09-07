/**
 * Stripe test-mode API client for verifying payment side-effects.
 * Uses test-mode keys from GitHub Environments only.
 */
export class StripeTestApi {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.STRIPE_TEST_KEY ?? "";
  }

  async getPaymentIntent(id: string): Promise<unknown> {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${id}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    return res.json();
  }
}
