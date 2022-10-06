require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const errorHandler = require('./utils/errorHandler')
const unknownEndpoint = require('./utils/unknownEndpoint')

const Person = require('./models/person.js')

const phoneRouter = require('./controllers/phones')

const app = express()

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - body: :body'
  )
)
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello from the phonebook server</h1>')
})

app.get('/info', async (req, res) => {
  const data = await Person.find({})
  const length = data.length
  const reqDate = new Date()
  res.send(
    `<h3>Phonebook has ${length} entries</h3>
    <p>${reqDate}</p>
    `
  )
})

app.use('/api/persons', phoneRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
