const testingRouter=require('express').Router()
const Note='../models/note'
const User='../models/user'
testingRouter.post('/reset',async(request,response)=>{
    await Note.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})
module.exports=testingRouter

