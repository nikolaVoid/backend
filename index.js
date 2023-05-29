// const http = require('http');

// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]

//   const  app = http.createServer((req,res)=>{
//     res.writeHead(200,{'Content-Type':'application/json'});
//     res.end(JSON.stringify(notes));
// })

// const PORT =3333;
// app.listen(PORT);
// console.log(`Server started on ${PORT}`);

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(cors())


const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("Welcome TARS");
});

app.get("/api/notes", (req, res) => {
  console.log(notes);
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const note = notes.find((note) => note.id === parseInt(id));
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post("/api/notes", (req, res) => {
  const { body } = req;

  if (!body.content) {
    return res.status(400).json({
      error: "Body is missing",
    });
  }
  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  };
  notes = notes.concat(note);

  res.json(body);
});

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  notes = notes.filter((note) => note.id !== parseInt(id));
  res.status(204).end();
});

const unknowEndPoint = (req, res) => {
  // console.log(req, res);
  return res.status(404).send({
    error: "unknown endpint",
  });
};

app.use(unknowEndPoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Started on PORT:${PORT}`);
});
