const express = require("express");
const router = express.Router();
const { userModel, userValidate, loginValidate, genToken} = require("../model/userModel");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to user" });
})
// רישום משתמש חדש
router.post("/", async (req, res) => {
  let valid = userValidate(req.body);
  if (valid.error) {
    return res.json(valid.error.details).status(400);
  }

  // אם הגענו לפה המידע שהמשתמש שלח תקין מבחינת הוואלידציה שעשינו ביוזרמודל

  try {
    //יצירת משתמש חדש 
    let user = new userModel(req.body);
    // הצפנה בביקריפט
    user.password = await bcrypt.hash(user.password, 10);
    // שמירת המשתמש
    await user.save();
    // העברה למשתמש כוכביות ולא את הסיסמה שלו
    // לא משנה את הסיסמה בדאטא רק בהצגה חזרה למשתמש
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
    // אם הוואלידציה של המייל והסיסמה נכונים נכנס
    let validLogin = loginValidate(req.body);
    if (validLogin.error) {
      return res.json(validLogin.error.details).status(400);
    }
    try {
      // בודק שיש לו בדאטא משתמש עם האיימל הזה 
      let user = await userModel.findOne({email:req.body.email})   
      if(!user)
      {
        // אם לא עוצר ומחזיר הודעה
        return res.json("invalide email or password");
      }
      // בודק את הסיסמה שנכנס מול הסיסמה שמוצפנת בדאטא ומחזיר טרו
      // return res.json({msg:user});
      let validPassword = await bcrypt.compare(req.body.password, user.password);
     if(!validPassword)
     {
       // אם לא מחזיר הודעה 
       return res.json("invalide email or password");
     }
     // ייצור טוקן
      let token = genToken(user._id);
      res.json({token});
    }

    catch (err) {
      console.log(err);
      res.status(500).json({ msg_err: "There problem" })
    }


  })
  


module.exports = router;