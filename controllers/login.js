const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null

}
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    // CHECK IF USER EXIST
    const user = await User.findOne({ username })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
    if (!(user && passwordCorrect)) {
        return response.status(401).json({ error: "invalid username or password" })
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    // GENERATE TOKEN   
    const token = jwt.sign(userForToken, process.env.JWT_SECRET,{ expiresIn: 60*60 })
    response.status(200).json({
        token,
        username: user.username,
        name: user.name
    })


})


module.exports = loginRouter