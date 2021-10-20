import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import handleRegister from './controller/register.js';
import handleSignin from './controller/signin.js';
import handleProfileGet from './controller/profile.js';
import { handleImage, handleAPI } from './controller/image.js';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Home');
});
//Have to pass req, res, db & bcrypt to the function (function curried so db & bcrypt only)
app.post('/register', handleRegister(db, bcrypt));
app.post('/signin', handleSignin(db, bcrypt));
app.get('/profile/:id', handleProfileGet(db));
app.put('/image', handleImage(db));
app.post('/imageurl', (req, res) => handleAPI(req, res));

app.listen(port, () => {
  console.log('App is running on on port ' + port);
});
