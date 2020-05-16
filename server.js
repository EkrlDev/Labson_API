const express = require('express');
const dotenv = require('dotenv');

//In order to use those config files we need to load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

//Creating CRUD Methods
//GET
app.get('/api/v1/bootcamp', (req, res) => {
  res.sendStatus(200).json({ success: true, msg: 'Show all bootcamps' });
});

//GET ONE
app.get('/api/v1/bootcamp/:id', (req, res) => {
  res
    .sendStatus(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
});

//POST
app.post('/api/v1/bootcamp/:id', (req, res) => {
  res
    .sendStatus(200)
    .json({ success: true, msg: `Created bootcamp with id ${req.params.id}` });
});

//UPDATE
app.put('/api/v1/bootcamp/:id', (req, res) => {
  res
    .sendStatus(200)
    .json({ success: true, msg: `Updated bootcamp with id ${req.params.id}` });
});

//DELETE
app.delete('/api/v1/bootcamp/:id', (req, res) => {
  res
    .sendStatus(200)
    .json({ success: true, msg: `Deleted bootcamp with id ${req.params.id}` });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
