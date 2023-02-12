require('dotenv').config()

const express=require('express')
const bodyparser=require("body-parser")
const mongoose=require('mongoose')
const app=express()
const cors=require('cors')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlparser:true})

const db=mongoose.connection

db.on('error',(error)=>console.log(error))
db.once('open',()=>console.log('Database connected'))
app.use(express.json({limit:"50mb"}))

app.use(cors())

const bookRouter=require('./routes/books')
const userRouter=require('./routes/users')
app.use('/books',bookRouter)
app.use('/user',userRouter)
app.listen(8000,()=>console.log('server started'))