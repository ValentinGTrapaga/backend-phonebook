const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - :body'
  )
)
app.use(cors())

let phones = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello from the phonebook server</h1>')
})

app.get('/info', (req, res) => {
  const length = phones.length
  const reqDate = new Date()
  res.send(
    `<h3>Phonebook has ${length} entries</h3>
    <p>${reqDate}</p>
    `
  )
})

app.get('/api/persons', (req, res) => {
  res.status(200).json(phones)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phones.find((person) => person.id === id)
  person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  phones = phones.filter((person) => person.id !== id)
  res.json(phones)
})

const generateId = () => {
  const maxId = phones.length > 0 ? Math.max(...phones.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  const id = generateId()
  const personToAdd = { ...body, id }
  const existsName = phones.find(
    (person) => JSON.stringify(person.name) === JSON.stringify(personToAdd.name)
  )
  if (body.name === '' || body.number === '') {
    return res.status(400).json({ error: 'Content missing' })
  } else if (existsName !== undefined) {
    return res.status(400).json({ error: 'Name already exists' })
  }
  phones = [...phones, personToAdd]
  return res.status(202).json(phones)
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
