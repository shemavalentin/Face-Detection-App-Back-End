const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const port = 3001;
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
	host : '127.0.0.1',
	//port : 5432,
	user : 'postgres',
	password : 'Devops@2023',
	database : 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Success!') })

//signin  --> POST = Success/ fail (Sign in route)

app.post('/signin',(req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// register  --> POST = user (Register route)

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// Load hash from your password DB.

app.listen(3001, () => {
	console.log(`App is running on port ${port}`)
})

/*
/ --> res = this is working
/ signin  --> POST = Success/ fail
/ register  --> POST = user
/ profile/:userId  --> GET = user
/ image --> PUT  --> user

*/