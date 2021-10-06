import express from 'express';
import bcrypt, { hash } from 'bcrypt';
import cors from 'cors';

const saltRounds = 10;
const myPlaintextPassword = 's0//P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const app = express();
const port = 3000;

// 'entries' means photo submission count
const database = {
  users: [
    {
      id: '1',
      name: 'VK',
      email: 't29512@msn.com',
      password: 't7929512',
      entries: 0,
      joinTime: new Date(),
    },
    {
      id: '2',
      name: 'Syvi',
      email: 't7929512@gmail.com',
      password: 'loveavril',
      entries: 0,
      joinTime: new Date(),
    },
  ],
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: `${database.users.length + 1}`,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joinTime: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.post('/signin', (req, res) => {
  bcrypt.compare(
    req.body.password,
    '$2b$10$60jiXfRK7x91XTpmKij.P.Nazm04CaPVNP18Xg68H6EnT/dkYpywi',
    function (err, result) {
      console.log('t7929', result);
    }
  );
  bcrypt.compare(
    someOtherPlaintextPassword,
    '$2b$10$60jiXfRK7x91XTpmKij.P.Nazm04CaPVNP18Xg68H6EnT/dkYpywi',
    function (err, result) {
      console.log(someOtherPlaintextPassword, result);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Fail to login');
  }
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('Not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('Not found');
  }
});

app.listen(port, () => {
  console.log('app is running on on port ' + port);
});
