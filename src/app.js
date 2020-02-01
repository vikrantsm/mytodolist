const express = require('express')
const path = require('path')
const mongoose = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const hbs = require('hbs')
const app = express()
const publicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Login'
    })    
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Help text.',
        title: 'Help'
    })
})

app.get('/myTask', (req, res) => {
    res.render('myTask', {
        title: 'My Tasks'
    })
})

module.exports = app