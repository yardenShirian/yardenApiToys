const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("auth-token");

    if (!token) {
        return res.json("need token");
    }

    try {
        // Check the token
        let verToken = jwt.verify(token, secret.secretWord);
        req.dataToken = verToken;
        next();
    }
    catch (err) {
        return res.json("token in valid or expaired");
    }
}