// Require the framework and instantiate it
const fastify = require('fastify')({logger: true})

console.log('')

fastify.all('/', async (request, reply) => {
  const raterData = rater({
    data: request.body,
    calculate: request.method === 'POST',
  })
  return raterData
})

const start = async () => {
  try {
    await fastify.listen(4000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()


const rater = (request) => {
  const response = {
    'fields': [
      {'name': 'input_cm', 'label': 'CM', 'input': true, 'output': false, 'dataType': 'DECIMAL'},
      {'name': 'input_kg', 'label': 'KG', 'input': true, 'output': false, 'dataType': 'DECIMAL'},
      {'name': 'output_BMI', 'label': 'BMI', 'input': false, 'output': true, 'dataType': 'DECIMAL'},
      {'name': 'output_undefined', 'label': 'UND', 'input': false, 'output': true},
    ],
  }
  if (request.calculate) {
    let premium = 100;

    const formData = request.data.formData || {}
    const personalArticles = formData.personalArticles || [];
    personalArticles.forEach(art => {
      const coverage = parseFloat(art.coverage) || 0
      premium += coverage * 0.05
    })

    const additionalLocations = formData.additionalLocations || [];
    additionalLocations.forEach(art => {
      const coverage = parseFloat(art.coverage) || 0
      premium += coverage * 0.02
    })


    response['calculation'] = {
      premium: Math.round(premium * 100) / 100, // Should be decimal, but ok for POC
    }
  }
  return response
}
