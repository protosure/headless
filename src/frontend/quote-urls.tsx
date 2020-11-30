export class QuoteUrls {
    quoteId?: string
    policyId?: string

    constructor(public host: string, public tenantId: string) {
    }

    // @formatter:off
  get apiUrl() { return `${this.host}/public-api/${this.tenantId}` }
  get getOrCreateQuoteUrl() { return `${this.apiUrl}/quotes/get_or_create/` }
  get quoteUrl() {return `${this.apiUrl}/quotes/${this.quoteId}`}
  get updateQuoteInputDataUrl() {return `${this.quoteUrl}/update_input_data/`}
  get clearUrl() {return `${this.quoteUrl}/clear_input_data/`}
  get quoteErrorsUrl() {return `${this.quoteUrl}/quote_errors/`}
  get quoteUWErrorsUrl() {return `${this.quoteUrl}/quote_uw_errors/`}
  get calculateUrl() {return `${this.quoteUrl}/calculate_rater/`}
  get submitUrl() {return `${this.quoteUrl}/submit/`}
  get policyUrl() {return `${this.apiUrl}/policies/${this.policyId}/`}
  // @formatter:on
}
