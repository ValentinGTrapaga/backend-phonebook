const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

mongoose
  .connect(url)
  .then((res) => {
    console.log('Connected to database')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number. Valid numbers: '***-****...' or '**-****...'`
    }
  },
  date: Date
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
