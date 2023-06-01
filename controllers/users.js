const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


// create a user
usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    // check user already exist
    const existingUser = await User.findOne({username})
    if (existingUser) {
        response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash,
    })
    // save user to database
    const savedUser = await user.save()
    // return response
    response.status(201).json(savedUser)

})

// get all users
usersRouter.get('/', async (request, response) => {
    const users =await User.find({}).populate('notes', { content: 1, date: 1 })
    response.status(200).json(users)

})
// get a single user by id
usersRouter.get('/:id', async (request, response) => {


})


// delete a user by id 
// usersRouter.delete('/:id',(request,response)=>{

// })

// update a user by id
// usersRouter.put('/:id',(request,response)=>{

// })

module.exports = usersRouter