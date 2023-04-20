require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const People = require("./models/people")

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

const app = express()
// for 3.7
app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(
	morgan((tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			JSON.stringify(req.body),
		].join(" ")
	})
)

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ]
// for 3.1
app.get("/", (request, response) => {
	response.send("<h1>Hello world and bye</h1>")
})

app.get("/api/persons", (request, response) => {
	People.find({}).then((persons) => {
		response.json(persons)
	})
})
// for 3.2
app.get("/info", (request, response) => {
	const currentDate = new Date().toLocaleString()
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	People.find({}).then((persons) => {
		response.send(
			`
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate} (${timeZone})</p>
            </div>`
		)
	})
})

// for 3.3

app.get("/api/persons/:id", (request, response, next) => {
	People.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end
			}
		})
		.catch((error) => next(error))
})
// for 3.4

app.delete("/api/persons/:id", (request, response, next) => {
	People.findByIdAndRemove(request.params.id)
		.then((result) => {
			console.log(result)
			response.status(204).end()
		})
		.catch((error) => next(error))
})

// for 3.5

// const generateId = () => {
//   return Math.floor(Math.random() * 1000000 + 1)
// }

app.post("/api/persons", (request, response, next) => {
	const body = request.body

	if (Object.keys(body).length === 0) {
		return response.status(400).json({ error: "content missing" })
	}

	const people = new People({
		name: body.name,
		phoneNumber: body.phoneNumber,
	})
	people
		.save()
		.then((savedPerson) => {
			response.json(savedPerson)
		})
		.catch((error) => {
			response.send(
				`
            <div>
                <p>Phonebook has info for ${error.data.message} people</p>
            </div>
            `
			)
			console.log(error.data.message)
			next(error)
		})
})

app.put("/api/persons/:id", (request, response, next) => {
	const { name, phoneNumber } = request.body

	// const body = request.body
	// const people = {
	//   name: body.name,
	//   phoneNumber: body.phoneNumber,
	// }

	People.findByIdAndUpdate(
		request.params.id,
		{ name, phoneNumber },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedPeople) => {
			response.json(updatedPeople)
		})
		.catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
