const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
//random comment
app.use(express.static("static"));
app.use(cors());

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

app.use(
  morgan(":method :url :status :res[header] :response-time :body", {
    skip: function (req, res) {
      return req.method !== "POST";
    },
  })
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  }
  if (person) {
    response.send(person);
  }
});

app.get("/info", (request, response) => {
  const str1 = `<p>Phonebook has info for ${persons.length} people<p>`;
  const str2 = `<p>${new Date()}<p>`;
  response.send(str1 + str2);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * Math.floor(20000));
  const body = request.body;
  const name = body.name;
  const number = body.number;
  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find((person) => person.name === name)) {
    return response.status(400).json({
      error: "duplicate name",
    });
  }
  const person = { name, number, id };
  persons = persons.concat(person);
  response.json(person);
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  updatePerson = persons.find((person) => person.id === id);
  if (!updatePerson) {
    return response.status(400).json({
      error: "no resource with that ID",
    });
  }
  newPerson = request.body;
  updatePerson = {
    ...updatePerson,
    number: newPerson.number,
    name: newPerson.name,
  };
  persons = persons.map((person) => (person.id === id ? updatePerson : person));
  response.json(updatePerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
