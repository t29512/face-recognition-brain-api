//Use nested function to pass parameters db & bcrypt then req & res (currying)
const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  //Sync way to hash password
  const hash = bcrypt.hashSync(password, saltRounds);
  //Making sure databases rollback if the transaction fail
  //Use trx instead of db inside a transaction
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  db.transaction((trx) => {
    //Add value to table: login and return email
    trx('login')
      .insert(
        {
          hash: hash,
          email: email,
        },
        'email'
      )
      .then((loginEmail) => {
        return (
          //Add value to table: users
          trx('users')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date(),
            })
            //Return all columns of this registered user
            .returning('*')
            .then((user) => {
              res.json(user[0]);
            })
        );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
};

export default handleRegister;
