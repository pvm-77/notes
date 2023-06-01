// const express = require('express')
// const cors = require('cors')
// const mongoose = require('mongoose')

// require('dotenv').config()

// const app = express()
// const Note=require('./models/note')
// app.use(express.json())
// app.use(cors())
// app.use(express.static('build'))
// // middleware
// const requestLogger = (request, res, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }
// app.use(requestLogger)

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         date: "2022-05-30T17:30:31.098Z",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only Javascript",
//         date: "2022-05-30T18:39:34.091Z",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         date: "2022-05-30T19:20:14.298Z",
//         important: true
//     }
// ]


// // get app notes from db
// app.get('/api/getAllNotes', async (req, res) => {
//     try {
//         const allNOtes = await Note.find({})
//         res.status(200).json(allNOtes);
//     } catch (error) {
//         res.status(404).json(error)
//     }
// })
// // insert single note to db[addNote]
// app.post('/api/addNote', async (req, res) => {
//     try {
//         const note = new Note({
//             content: req.body.content,
//             date: req.body.date,
//             important: req.body.important
//         })
//         const result = await note.save()
//         res.status(201).json(result)
//     } catch (error) {
//         res.status(400).json(error)

//     }

// })




// // update 
// app.patch('/api/notes/:id', async (req, res) => {
//     const id = req.params.id
//     console.log(id)
//     try {
//         const note = await Note.findById(id)
//         console.log(note)
//         // change its important field
//         if (note.important === true) {
//             note.important = false
//         } else {
//             note.important = true
//         }

//         await note.save()

//         // const note = notes.find(note => note.id === id)
//         // change important 
//         // const changedNote = { ...note, important: !note.important }

//         res.status(202).json(note)

//     } catch (error) {
//         res.status(400).json(error)
//     }
// })
// // get all note from local array of objects named notes
// app.get('/api/notes', (req, res) => {
//     try {
//         console.log(notes);
//         res.status(200).json(notes);

//     } catch (error) {
//         res.status(400).json(error);
//     }
// })


// // // create a new note
// // app.post('/api/notes', (request, response) => {
// //     const note = request.body
// //     console.log(note)
// //     response.json(note)
// //   })

// // fetch single note by id
// app.get('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     console.log(id)
//     const note = notes.find(note => note.id === id)
//     console.log(note)
//     if (note) {
//         response.json(note)
//     } else {
//         response.status(404).json(
//             { error: `Note with id ${id} not found` }
//         )
//     }
// }
// )

// // deleting a resource 
// app.delete('/api/notes/:id', (req, res) => {
//     const id = Number(req.params.id)
//     notes = notes.filter(note => note.id !== id)
//     res.status(204), json();
// })




//   greater refactoring of code

const app = require('./app') // the actual Express application
const http = require('http')
const {PORT} = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})