import Clarifai from 'clarifai';

//API
const app = new Clarifai.App({
  apiKey: 'e9b797b58db340adab6903e70e81259c',
});

const handleAPI = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json('Unable to work with API'));
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json('error getting entries'));
};

export { handleImage, handleAPI };
