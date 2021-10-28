const { json } = require("express");
const express = require("express");
// const nodemon = require("nodemon");
const app = express();
app.use(express.json());
app.use(express.static('build'))
const cors = require('cors')
const morgan = require("morgan");

app.use(cors());
app.use(morgan("tiny"));

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res),
    (tokens.method(req, res) === "POST") ? JSON.stringify(req.body) : ''
  ].join(' ')
})

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Martti Tienari",
    number: "040-123456",
  },
  {
    name: "Dan Abramov",
    number: "12-43-2324563",
    id: 3,
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-4-11213391",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
  <hp>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (persons.find((a) => a.name === body.name)) {
    return response.status(409).json({
      error: "Name not unique",
    });
  } else if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const error = (request, response) => {
  response.status(404).send({ error: "404 unknown endpoint" });
};
app.use(error);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
