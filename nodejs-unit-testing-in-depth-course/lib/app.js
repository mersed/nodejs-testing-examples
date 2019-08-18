const express = require('express');
const bodyParser = require('body-parser');

const users = require('./users');
const auth = require('./auth');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Foo Fooing Bar'
  })
});

app.post('/user', function (req, res) {
  users.create(req.body).then((result) => {
    res.json(result);
  }).catch((err) => {
    handleError(res, err);
  });
});

app.delete('/user/:id', auth.isAuthorized, function (req, res) {
  users.delete({id: req.params.id, name: 'foo'}).then((result) => {
    res.json(result);
  }).catch((err) => {
    handleError(res, err);
  });
});

function handleError(res, err) {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    });
  }

  return res.status(400).json(err);
}

module.exports = app;