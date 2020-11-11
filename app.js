const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 7000
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Mongoose CONNECTED!!")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connection",err)
})


app.listen(PORT,()=>{
    console.log("Server is Running",PORT); 
})