require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('static'))
app.use(cors())
app.use(express.json())
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan('tiny', {
    skip: function (req) {
      return req.method === 'POST'
    },
  })
)

app.use(
  morgan(':method :url :status :res[header] :response-time :body', {
    skip: function (req) {
      return req.method !== 'POST'
    },
  })
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/info', (request, response) => {
  Person.find({})
    .then((persons) => persons.length)
    .then((personNumber) => {
      const str1 = `<p>Phonebook has info for ${personNumber} people<p>`
      const str2 = `<p>${new Date()}<p>`
      response.send(str1 + str2)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({ name: body.name, number: body.number })
  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const person = { name: body.name, number: body.number }
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
