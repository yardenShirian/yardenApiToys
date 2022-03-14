const express = require("express");
const router = express.Router();
const { toyModel, validateToy } = require("../model/toysModel");
const { auth } = require("../middleware/auth");

// get toys per 10 to page
router.get("/", async (req, res) => {
  try {
    let page = req.query.page || 1;
    let data = await toyModel.find({}).limit(10).skip((page - 1) * 10)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})
// הוספת צעצוע על ידי המשתמש
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

// עדכון צעצוע
router.put("/:editId", auth, async (req, res, next) => {
  let validToy = validateToy(req.body);
  if (validToy.error) {
    return res.json(validToy.error.details);
  }
  try {
    let editId = req.params.editId;
    //updateOne - מעדכן צעצוע אחד שני בוחרת ולא את כל הצעצועים
    // יודע לעדכן לםי האיידי של הצעצוע ואיידי של המשתמש
    // ומקבל את הבאדי - למה אנחנו רוצים לשנות 
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
    // מקבל את האיידי של הצעצוע ושל המשתמש וככה יודע איזה צעצוע למחוק
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
    // מאפשר חיפוש באותיות גדולות וקטנות וידע לחפש גם חצאי מילים
    let sReg = new RegExp(search, "i");
    let data = await toyModel.find({ $or: [{ name: sReg }, { info: sReg }] });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})
// חיפוש לפי קטגוריה
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
    // ברירת מחדל של מינימום מקסימום אם לא מכניסים לי 
    let max = req.query.max || 9999;
    let min = req.query.min || 0;
    // הצגת צעצועים לפי טווח מחירים min-max
    // lte - מתאים לערכים הנמוכים או שווים לערך שצוין
    // gte - מתאים לערכים שגדולים או שווים לערך שצוין
    let data = await toyModel.find({ $and: [{ price: { $lte: max } }, { price: { $gte: min } }] });

    if(min<max)
    {
      res.json(data);
    }
    else 
    {
      res.json({msg:"enter price again"});
    }
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = router;