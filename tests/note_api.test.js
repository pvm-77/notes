const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

// beforeEach(async () => {
//     await Note.deleteMany({})

//     let noteObject = new Note(helper.initialNotes[0])
//     await noteObject.save()

//     noteObject = new Note(helper.initialNotes[1])
//     await noteObject.save()
// })


beforeEach(async () => {
    // await Note.deleteMany({})
    // console.log('cleared');

    // helper.initialNotes.forEach(async (note)=>{
    //     let noteObject=new Note(note)
    //     await noteObject.save()
    //     console.log('saved');
    // })
    // console.log('done');
    // const noteObjects = helper.initialNotes.map(note => new Note(note))
    // const promiseArray = noteObjects.map(note => note.save())
    // await Promise.all(promiseArray)

    // for (let note of helper.initialNotes) {
    //     let noteObject = new Note(note)
    //     await noteObject.save()
    // }
    // await Note.insertMany(helper.initialNotes)

})
describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(r => r.content)

        expect(contents).toContain(
            'Browser can execute only Javascript'
        )
    })
});
describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        // fetch a note from database
        const notesAtStart = await helper.notesInDb()
        const noteToView = notesAtStart[0]
        const result = await api.get(`/api/notes/${noteToView.id}`).expect(200)
        const processedNote = JSON.parse(JSON.stringify(noteToView))
        expect(result.body).toEqual(processedNote)
    })
    test('fails with a status code 400 if id is invalid', async () => {
        const invalidId = 'fsdj5sdjkseuiqweuiwue'
        await api.get(`/api/notes/${invalidId}`).expect(400)

    })
    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
        console.log(validNonexistingId)
        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })
});

describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
        const contents = notesAtEnd.map(n => n.content)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })
    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)


    })

});


// describe('deletion of a note', () => {
//     test('succeeds with status code 204 if id is valid', async () => {

//         const notesAtStart = await helper.notesInDb()
//         const noteToDelete = notesAtStart[0]

//         await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

//         const notesAtEnd = await helper.notesInDb()
//         // length must be 1 less
//         expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)
//         // array must not contain deleted note

//         contents = notesAtEnd.map(note => note.content)
//         expect(contents).not.toContain(noteToDelete.content)

//     })

// },10000);




afterAll(() => {
    mongoose.connection.close()
})