export type AdditionalLocation = { address: string, coverage: string };

export type QuoteInputData = Partial<{
  entityName: string
  principalInsuredType: 'Person' | 'Trust' | 'LLC'
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  maritalStatus: string;
  emailAddress: string
  coverageA?: number
  coverageB?: number
  coverageC?: number
  coverageD?: number

  insuredLocation: {
    street1?: string
    street2?: string
    city?: string
    state?: string
    zip?: string
    countyName?: string
    countyFips?: string
  }
  personalArticles: Array<{ description: string, coverage: string }>
  additionalLocations: Array<AdditionalLocation>
}>


export type Quote = {
  id: string
  policy: string // actually a policy id. Weird naming, sorry
  inputData: QuoteInputData,
  formData: QuoteInputData,
  calculatedData: {
    totalCoverage?: number
  }
  raterData: Record<any, any>
  metaData: Record<any, any> // TO BE DONE
}
