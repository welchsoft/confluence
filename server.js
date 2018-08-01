const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')

const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posts')

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI

//connect to mongoDB
mongoose.connect(db,{ useNewUrlParser: true })
.then(()=> console.log('mongoDB connected'))
.catch(err => console.log(err))

app.get('/', (req, res)=> res.send('hello world'))

// Use Routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, ()=> console.log(`server running on port ${port}`))
