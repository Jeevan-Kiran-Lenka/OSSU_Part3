// const { response } = require('express')
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()
// for 3.7
app.use(morgan("tiny"))
// app.use(morgan("dev"))
// app.use(
//   morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       tokens["content"](req, res),
//     ].join(" ")
//   })
// )
app.use(express.json())
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]
// for 3.1
app.get("/", (request, response) => {
  response.send("<h1>Hello world and bye</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})
// for 3.2
app.get("/info", (request, response) => {
  const responseText = `
    <p>Phonebook has info for ${persons.length} people</p>

    <p>${new Date()}</p>
  `
  response.send(responseText)
})

// for 3.3

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  // response.json(person)

  person ? response.json(person) : response.status(404).end
})
// for 3.4

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// for 3.5

const generateId = () => {
  return Math.floor(Math.random() * 1000000 + 1)
}

app.post("/api/persons", (request, response) => {
  const id = generateId()
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    })
  }
  const foundPerson = persons.find(
    (person) => person.name === request.body.name
  )
  if (foundPerson) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }
  const person = { id, name: request.body.name, number: request.body.number }
  persons = persons.concat(person)

  response.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
