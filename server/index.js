const express=require('express')
const server=express()
const cors=require('cors')
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require('./mongodb.js')

server.use(express.json())
server.use(cors({origin:'http://localhost:5173',credentials:true}))
server.use(cookieParser())
let database=null
connectToMongoDB(database)

// pass the database to every req
server.use((req,res,next)=>{
    req.database=database
next()
})

server.use('/users',require('./routes/users.js'))
server.use('/account',require('./routes/account.js'))

server.listen(5000,()=>{
    console.log('server started succesfully');
})