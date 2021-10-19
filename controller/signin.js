const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where({ email: email })
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        //db('users') = db.from('users') = db.table('users')
        db('users')
          .select()
          .where({ email: email })
          .then((user) => {
            res.json(user[0]);
          });
      } else {
        res.json('Wrong combination');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json('Something went wrong');
    });
};

export default handleSignin;
