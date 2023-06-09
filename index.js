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

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./model/note");

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static("build"));

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
//   return maxId + 1;
// };

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// // const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// const Note = mongoose.model("Note", noteSchema);

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// get all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// get a single notes

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// creating new note
app.post("/api/notes", (req, res, next) => {
  const { body } = req;

  if (!body.content) {
    return res.status(400).json({
      error: "Body is missing",
    });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

//updateing note
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;
  Note.findByIdAndUpdate(
    request.params.id,
    {
      content,
      important,
    },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknowEndPoint = (req, res) => {
  return res.status(404).send({
    error: "unknown endpint",
  });
};

app.use(unknowEndPoint);

const errorHandler = (error, request, response, next) => {
  console.log(error?.message, "----------------------------");
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("hello");
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Started on PORT:${PORT}`);
});
