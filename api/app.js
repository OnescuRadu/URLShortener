const express = require('express');
const app = express();
const randomstring = require('randomstring');
const database = require('./db/database');
const mongoose = require('mongoose');
const Url = require('./models/url');
const { addHttp } = require('./helpers/url-validation');
const isUrl = require('is-valid-http-url');

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
    return res.json({});
  }
  next();
});

app.get('/:shortURL', async (req, res) => {
  Url.findOne({ shortURL: req.params.shortURL })
    .exec()
    .then(url => {
      url.clicked = url.clicked + 1;
      url.save();
      return res.send({ response: url.fullURL });
    })
    .catch(error => {
      return res.status(400).send({ message: 'Oops. URL not found!.' });
    });
});

app.post('/', (req, res) => {
  let fullURL = addHttp(req.body.url);

  if (!isUrl(fullURL)) {
    return res.status(400).send({ message: 'Invalid URL.' });
  }

  const shortURL = randomstring.generate({
    length: 5,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  });

  const url = new Url({
    _id: new mongoose.Types.ObjectId(),
    fullURL: fullURL,
    shortURL: shortURL
  });

  url
    .save()
    .then(result => {
      return res.send({ response: url.shortURL });
    })
    .catch(error => {
      return res.status(400).send({
        message: 'Error shortening the URL. Please try again!',
        error: error
      });
    });
});

app.get('/', (req, res) => {
  const limit = Number(req.query.limit);
  let sort = req.query.sort;
  const sortby = req.query.sortBy;

  //Convert sort value to "-1" if descending or "1" for any other value
  //Mongoose accepts -1 for descending and 1 for ascending
  if (sort === 'descending' || sort === 'desc') {
    sort = -1;
  } else sort = 1;

  //Create an object so I can set a string as a property name and then pass this object to mongoose
  sortObject = {};
  sortObject[sortby] = sort;
  Url.find()
    .select('-_id -__v')
    .sort(sortObject)
    .limit(limit)
    .exec()
    .then(urls => {
      return res.send({ urls: urls });
    });
});

app.listen(process.env.PORT ? process.env.PORT : 3000, error => {
  if (error) {
    console.error(error);
  } else console.log(`Server running on port ${process.env.PORT}...`);
});
