const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.jhsns.mongodb.net/phonebook-app?retryWrites=true`
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = String(process.argv[4])
  const person = new Person({
    name,
    number,
  })
  person.save().then((result) => {
    console.log('added', result.name, 'number', result.number, 'to phonebook')
    mongoose.connection.close()
  })
}

/*
note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
*/

/*
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
*/
