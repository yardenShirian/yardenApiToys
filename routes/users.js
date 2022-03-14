const express = require("express");
const router = express.Router();
const { userModel, userValidate, loginValidate, genToken } = require("../model/userModel");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to user" });
})
// New user registration
router.post("/", async (req, res) => {
  let valid = userValidate(req.body);
  if (valid.error) {
    return res.json(valid.error.details).status(400);
  }

  try {
    // Create a new user
    let user = new userModel(req.body);
    // Encryption in Bicript
    user.password = await bcrypt.hash(user.password, 10);
    // Save the user
    await user.save();
    // Transfer to asterisk user and not his password
    // Does not change the password in the data only when displayed back to the user
    user.password = "********";
    res.json(user).status(200);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ code: 11000, err_msg: "Email already in system try log in" })
    }
    console.log(err);
    res.status(500).json(err);
  }
})

router.post("/login", async (req, res) => {
  // If the validation of the email and password is correct enter
  let validLogin = loginValidate(req.body);
  if (validLogin.error) {
    return res.json(validLogin.error.details).status(400);
  }
  try {
    // Checker he has in the user data with this email
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      return res.json("invalide email or password");
    }
    // Checks the password that is entered against the password that is encrypted in the data and returns True
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.json("invalide email or password");
    }
    // Token production
    let token = genToken(user._id);
    res.json({ token });
  }

  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem" })
  }


})



module.exports = router;