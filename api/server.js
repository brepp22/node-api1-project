// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.get('/' , (req , res) => {
    res.json({hello : 'world'})
})

server.get('/api/users' , (req , res) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({message: "The users information could not be retrieved"})
    })
})

server.get('/api/users/:id' , (req , res) => {
    const { id } = req.params
    User.findById(id)
    .then(user => {
        user ? res.status(200).json(user)
        : res.status(404).json({message: "The user with the specified ID does not exist" })
    })
    .catch(error => {
        res.status(500).json({message: "The user information could not be retrieved" })
    }) 
})

server.post('/api/users' , async (req , res) => {
    const user = req.body
    if(!user.name || !user.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"})
    } else {
        try { 
            const insertNewUser = await User.insert(user)
            res.status(201).json(insertNewUser)
        } catch (error) {
          res.status(500).json({message: "There was an error while saving the user to the database"})  
        }
    }
})

server.put('/api/users/:id' , async (req , res) => {
    const changes = req.body
    const { id } = req.params

    if(!changes.name || !changes.bio){
        res.status(400).json({message:  "Please provide name and bio for the user"})
    } else {
        try {
            const updatedUser = await User.update( id , changes)
            if(updatedUser){
                res.status(200).json(updatedUser)
            } else {
                res.status(404).json({message: "The user with the specified ID does not exist" })
            }
    } catch (error) {
        res.status(500).json({message: "The user information could not be modified"})
    }
}

})

server.delete('/api/users/:id' ,  (req , res) => {
    const { id } = req.params
    User.remove(id)
    .then(deleted => {
        if(deleted) {
            res.status(200).json(deleted)
        } else {
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }
    })
    .catch(error => {
        res.status(500).json({message: "The user could not be removed" })
    })
})

module.exports = server 

//module.exports = {}; // EXPORT YOUR SERVER instead of {}