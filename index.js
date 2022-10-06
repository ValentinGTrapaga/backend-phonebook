const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const errorHandler = require('./errorHandler')

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

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
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

  Person.findOne({ name: body.name })
    .then((result) => {
      const { _id } = result
      newPerson._id = _id
      if (result) {
        Person.findByIdAndUpdate(_id, newPerson, {
          new: true,
          runValidators: true,
          context: 'query'
        }).then((updatedPerson) => {
          res.json(updatedPerson)
        })
      } else {
        newPerson.save().then((savedPerson) => {
          res.json(savedPerson)
        })
      }
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const personToAdd = { ...body, id }
  Person.findByIdAndUpdate(id, personToAdd, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
