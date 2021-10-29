const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("build"));
const cors = require("cors");
const morgan = require("morgan");
const { json } = require("express");
const Person = require("./models/person");

app.use(cors());
app.use(morgan("tiny"));

let persons = [];

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : "",
  ].join(" ");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
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

app.post("/api/persons", (req, res, next) => {
  const person = req.body;

  if (persons.find((a) => a.name === req.body.name)) {
    return res.status(409).json({
      error: "Name not unique",
    });
  } else if (!person.name || !person.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((error) => next.error);
});

const error = (request, response) => {
  response.status(404).send({ error: "404 unknown endpoint" });
};
app.use(error);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
