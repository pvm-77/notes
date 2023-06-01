// const mongoose = require('mongoose');

// const noteSchema = new mongoose.Schema({
//     content: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true

//     },
//     important: {
//         type: Boolean,
//         default: false

//     }
// },
//     { timestamps: true }
// )
// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString();
//         delete returnedObject._id;
//         delete returnedObject.__v;
//     }
// });

// const Note = mongoose.model('Note', noteSchema);
// module.exports = Note;



const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 5
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)