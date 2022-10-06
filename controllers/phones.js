const Person = require('../models/person.js')
const phoneRouter = require('express').Router()

phoneRouter.get('/', (req, res) => {
  Person.find({}).then((result) => {
    res.json(result)
  })
})

phoneRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch((err) => {
      next(err)
    })
})

phoneRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

phoneRouter.post('/', (req, res, next) => {
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

phoneRouter.put('/:id', (req, res, next) => {
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

module.exports = phoneRouter
