#!/usr/bin/env node
const util = require('util')
const assert = require('assert')

const got = require('got')
const { FileCookieStore } = require('tough-cookie-file-store')
const { CookieJar } = require('tough-cookie')


const cookieJar = new CookieJar(new FileCookieStore('./cookie.txt'))
// const cookieJar = new CookieJar()
const request = (method, url, json) => got(url, { json, method, cookieJar }).json()

const main = async () => {
  const host = 'http://api.local.prtsr.local'
  const tenantId = 'f2726ba6-7591-403f-b81e-c67691e1d73b'
  const apiUrl = `${host}/public-api/${tenantId}`
  const createQuoteUrl = `${apiUrl}/quotes/get_or_create/`

  let quote = await request('POST', createQuoteUrl).json()
  let raterData

  const updateUrl = `${apiUrl}/quotes/${quote.id}/update_input_data/`
  const policyUrl = `${apiUrl}/policies/${quote.policy}/`
  const clearUrl = `${apiUrl}/quotes/${quote.id}/clear_input_data/`
  const quoteErrorsUrl = `${apiUrl}/quotes/${quote.id}/quote_errors/`
  const quoteUrl = `${apiUrl}/quotes/${quote.id}/`
  const quoteUWErrorsUrl = `${apiUrl}/quotes/${quote.id}/quote_uw_errors/`
  const calculateUrl = `${apiUrl}/quotes/${quote.id}/calculate_rater/`
  const submitUrl = `${apiUrl}/quotes/${quote.id}/submit/`

  // reset input data for a quote
  quote = await request('POST', clearUrl, { modifiedAt: quote.metaData.modifiedAt }).json()
  // log(await request('GET', quoteErrorsUrl).json()) // only empy form errors allows calculation

  // Got stuck? check inputs!
  // return log(await getFormTemplateInputs(quote.metaData.formTemplateId));

  quote = await request('PATCH', updateUrl, {
    inputData: {
      principalInsuredType: 'Person',
      firstName: 'John',
      lastName: 'Smith',
      prefix: 'Mr.',
      mailingAddress: {
        street1: '30 Memorial Drive',
        city: 'Avon',
        state: 'MA',
        countyFips: '25021',
        countyName: 'Netfolk',
        // zip: '02322-1919',
        zip: '10001',
      },
    },
  }).json()

  quote = await request('GET', quoteUrl)
  assert(quote.formData.firstName === 'John')


  quote = await request('PATCH', updateUrl, {
    inputData: {
      // please not that tables/compounds must send full data
      personalArticles: [{
        id: 1,
        class: 'Jewelery',
        description: 'Diamond Ring',
        coverage: 10000,
      }],
      additionalLocations: [{
        id: 1,
        ilAddress: {
          street1: '777 Brockton Avenue',
          city: 'Abington',
          state: 'MA',
          countyFips: '25023',
          countyName: 'Plymouth',
          zip: '02351-2111',
        },
        ilCoverage: 200000,
      }],
    },
  }).json()

  // log(await request('GET', quoteErrorsUrl).json())
  // log(await request('GET', quoteUWErrorsUrl).json())
  raterData = await request('POST', calculateUrl, { force: true }).json()
  // log(raterData)

  quote = await request('POST', createQuoteUrl).json()
  // log(quote.raterData)
  assert(Object.values(quote.raterData) > 0)

  // fixing errors
  quote = await request('PATCH', updateUrl, {
    inputData: {
      mailingAddress: {
        ...quote.inputData.mailingAddress,
        state: 'NY',
        zip: '02322-1919',
      },
      entityName: 'Apple',
    },
  }).json()
  // log(quote)

  // calculating and fetching quote
  // todo fix fetch url
  // log('recalc')
  raterData = await request('POST', calculateUrl, { force: true }).json()
  quote = await request('POST', createQuoteUrl).json()
  log(quote.raterData)
  assert(Object.values(quote.raterData) > 0)

  const submitResp = await request('POST', submitUrl).json()
  assert(submitResp.success)

  const policy = await request('GET', policyUrl)
  assert(policy.status, 'SUBMITTED')
  console.log(policy)
}

main()

/////////////////////////////////// HELPERS ///////////////////////////////////

async function getFormTemplateInputs(formTemplateId) {
  // Helper to get available fields
  const registeredWidgets = await request('GET', `${HOST}/public-api/get_registered_widgets/`).json()
  const inputs = registeredWidgets.filter((w) => w.isInput)
  const inputTypes = inputs.map((w) => w.Type)

  const url = `${API_URL}/form-templates/${formTemplateId}/`
  const ft = await request('GET', url).json()
  const inputWidgets = Object.values(ft.config).filter((w) => inputTypes.includes(w.type))
  const ftInputs = inputWidgets.reduce((acc, w) => {
    const wiwdgetDefinition = inputs.filter((rw) => rw.Type === w.type)[0]
    const type = wiwdgetDefinition.returnType
    const fieldData = { type }
    if (w.settings.options) fieldData.options = w.settings.options
    if (w.settings.columns) fieldData.columns = w.settings.columns
    return {
      ...acc,
      [w.name]: fieldData,
    }
  }, {})

  const calculatedFields = ft.calculatedFields.reduce((acc, cf) => {
    return {
      ...acc,
      [cf.name]: {
        label: cf.label,
        excelFormula: cf.excelFormula,
      },
    }
  }, {})
  return {
    inputs: ftInputs,
    calculatedFields,
  }
}

function log(o) {
  console.log(util.inspect(o, { showHidden: false, depth: null }))
}

process.on('uncaughtException', function(err) {
  if (err instanceof got.HTTPError) {
    console.error(
      `Request failed with code ${err.response.statusCode} \n  ${err.request.options.method}: ${err.request.requestUrl}`,
    )
    let json
    try {
      json = JSON.parse(err.response.body)
    } catch (e) {
      console.log(err.response.body.split('Django Version:')[0])
      process.exit(1)
    }

    if (Array.isArray(json)) {
      console.log('  Errors:')
      json.forEach((err) => {
        console.log('    %o', err)
      })
    } else {
      console.log('  Error:')
      log(json.error || json)
    }
  } else {
    throw err
  }
  process.exit(1)
})
