const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const personName = process.argv[3]
const personNumber = process.argv[4]

const password = process.argv[2]

const url = `mongodb+srv://m001-student:${password}@sandbox.k5z0gdd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose.connect(url).then((res) => {
    Person.find({}).then((resultArr) => {
      resultArr.forEach((person) =>
        console.log(`${person.name} - #: ${person.number}`)
      )
      return mongoose.connection.close()
    })
  })
}

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected')
    const newPerson = new Person({
      name: personName,
      number: personNumber,
      date: new Date()
    })

    return newPerson.save()
  })
  .then((result) => {
    console.log(`Added ${result.name} - #: ${result.number}`)
    return mongoose.connection.close()
  })
  .catch((err) => {
    console.log(err)
  })
