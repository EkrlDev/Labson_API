const express = require('express');
const router = express.Router();

//Creating CRUD Methods
//GET
router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
});

//GET ONE
router.get('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
});

//POST
router.post('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Created bootcamp with id ${req.params.id}` });
});

//UPDATE
router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Updated bootcamp with id ${req.params.id}` });
});

//DELETE
router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Deleted bootcamp with id ${req.params.id}` });
});

module.exports = router;
