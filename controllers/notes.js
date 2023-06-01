const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     console.log('token from req',authorization)
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7)
//     }
//     return null
// }

// get all notes
notesRouter.get('/', async (request, response) => {
    // Note.find({}).then(notes => {
    //     response.json(notes)
    // })
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    response.status(200).json(notes)


})
// create note
notesRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body
    const user=request.user

    // const user=await User.findById(body.userId)
    // extract token from request object

    // old code
    // const token = getTokenFrom(request)
    // console.log('token in notes ',token)
    // // validate token here
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    // new code 
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)
    console.log(`deocoded token from token extractor in create note`, decodedToken);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    // find if user exist in db on base of id get from token
    const userFromDB = await User.findById(decodedToken.id)

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: userFromDB._id
    })

    const savedNote = await note.save()
    // save note id to user object
    userFromDB.notes = userFromDB.notes.concat(savedNote._id)

    await userFromDB.save()
    response.status(201).json(savedNote)

})

// get note by id
notesRouter.get('/:id', async (request, response, next) => {
    // Note.findById(request.params.id)
    //     .then(note => {
    //         if (note) {
    //             response.json(note)
    //         } else {
    //             response.status(404).end()
    //         }
    //     })
    //     .catch(error => next(error))

    // errot handling using try catch
    try {
        const note = await Note.findById(request.params.id)
        if (note) {
            response.status(200).json(note)
        } else {
            response.status(404).end()
        }
    } catch (error) {

        next(error)
    }




})
notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
    // user who want to delete the note
    const user = request.user
    // find the blog from db
    const note = await Note.findById(request.params.id)
    if (!note) {
        return response.status(404).json({ error: 'note not exist ' })

    }
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)
    if (!decodedToken) return response.status(401).json({ error: 'invalid user' })
    const userid = decodedToken.id
    if (note.user.toString() === userid) {
        await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }




    // Note.findByIdAndRemove(request.params.id)
    //     .then(() => {
    //         response.status(204).end()
    //     })
    //     .catch(error => next(error))
    // try {
    //     await Note.findByIdAndRemove(request.params.id)

    // } catch (exception) {
    //     next(exception)

    // }
})

// update a note by id
notesRouter.put('/:id', (request, response, next) => {

    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter