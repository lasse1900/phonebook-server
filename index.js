const express = require("express");
const nodemon = require("nodemon");
const app = express();
app.use(express.json());

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Martti Tienari",
    "number": "040-123456"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-2324563",
    "id": 3
  },
  {
    "id": 4,
    "name": "Mary Poppendick",
    "number": "39-4-11213391"
  }
]

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
