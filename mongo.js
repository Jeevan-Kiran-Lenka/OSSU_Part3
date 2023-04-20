// mongodb+srv://phonebook:<password>@cluster0.8eukysz.mongodb.net/?retryWrites=true&w=majority

const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url = `mongodb+srv://phonebook:${password}@cluster0.8eukysz.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})

const People = mongoose.model("People", phonebookSchema)

if (process.argv.length == 3) {
  console.log("phonebook:")
  People.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, " ", person.phoneNumber)
    })
    mongoose.connection.close()
  })
} else {
  const people = new People({
    name: name,
    phoneNumber: phoneNumber,
  })

  people.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`)
    mongoose.connection.close()
  })
}
