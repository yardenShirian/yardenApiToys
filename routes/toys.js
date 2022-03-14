const express = require("express");
const router = express.Router();
const { toyModel, validateToy } = require("../model/toysModel");
const { auth } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    // get toys per 10 to page
    let page = req.query.page || 1;
    let data = await toyModel.find({}).limit(10).skip((page - 1) * 10)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})

// Adding a toy by the user
router.post("/", auth, async (req, res, next) => {
  let validToy = validateToy(req.body);

  if (validToy.error) {
    return res.json(validToy.error.details);
  }

  try {
    let data = new toyModel(req.body);
    data.user_id = req.dataToken._id;
    await data.save();
    res.json(data).status(201);
  }

  catch (err) {
    console.log(err);
  }
})

// Toy update
router.put("/:editId", auth, async (req, res, next) => {
  let validToy = validateToy(req.body);
  if (validToy.error) {
    return res.json(validToy.error.details);
  }
  try {
    let editId = req.params.editId;
    // updateOne - Updates one toy two chooses and not all toys
    // Knows how to update the toy's and the user's
    // and gets the buddy - why we want to change
    let data = await toyModel.updateOne({ _id: editId, User_id: req.dataToken._id }, req.body);
    res.json(data).status(200);
  }

  catch (err) {
    console.log(err);
  }
})

//delete toy
router.delete("/:delId", auth, async (req, res, next) => {
  try {
    let delId = req.params.delId;
    // Gets the ID of the toy and the user (pulls it from the token) and that way knows which toy to delete
    let data = await toyModel.deleteOne({ _id: delId, user_id: req.dataToken._id });
    res.json(data).status(200);
  }

  catch (err) {
    console.log(err);
  }
})

//search
router.get("/search", async (req, res) => {
  try {
    let page = req.query.page || 1;
    let search = req.query.s;
    // Allows search in uppercase and lowercase letters and knowledge to search even half words
    let sReg = new RegExp(search, "i");
    let data = await toyModel.find({ $or: [{ name: sReg }, { info: sReg }] });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})
// Search by category
router.get("/cat/:catname", async (req, res) => {
  try {

    let page = req.query.page || 1;
    let search = req.params.catname;
    let sReg = new RegExp(search, "i");
    let data = await toyModel.find({ category: sReg }).limit(10).skip((page - 1) * 10);;
    res.json(data);
  }

  catch (err) {
    res.json({ msg: "err in server" }).status(500)
  }
})

router.get("/price", async (req, res) => {
  try {
    // Default of minimum maximum if not entered
    let max = req.query.max || 9999;
    let min = req.query.min || 0;
    // lte - Corresponds to values ​​lower than or equal to the specified value
    // gte - Corresponds to values ​​greater than or equal to the specified value
    let data = await toyModel.find({ $and: [{ price: { $lte: max } }, { price: { $gte: min } }] });

    if (min < max) {
      res.json(data);
    }
    else {
      res.json({ msg: "enter price again" });
    }
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = router;