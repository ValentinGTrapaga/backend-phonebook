const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./modules/person')
const { response } = require('express')

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

app.get('/api/persons', (req, res) => {
  Person.find({}).then((result) => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   phones = phones.filter((person) => person.id !== id)
//   res.json(phones)
// })

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)

  if (!body) {
    res.status(400).json({ error: 'Content missing' })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  newPerson.save().then((savedPerson) => {
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const id = Number(req.params.id)
  const personToAdd = { ...body, id }
  phones = phones.filter((person) => person.id !== id)
  phones = [...phones, personToAdd]
  return res.status(200)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
