const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  //select() = select('*')
  db.select()
    // {id: id}
    .where({ id })
    .from('users')
    .then((user) => {
      //Check if user's array is empty or not
      user.length ? res.json(user[0]) : res.status(400).json('user not found');
    })
    .catch((err) => res.status(400).json('error getting user'));
};

export default handleProfileGet;
