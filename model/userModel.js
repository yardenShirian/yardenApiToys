const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");

let userScema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String, default: "user"
    },
    date_create: {
        type: Date, default: Date.now()
    }
})

exports.userModel = mongoose.model("users", userScema);

exports.userValidate = (_reqBody) => {
    let joiValid = joi.object({
        name: joi.string().min(2).max(30).required(),
        email: joi.string().min(5).max(30).email().required(),
        password: joi.string().min(2).max(30).required()

    })

    return joiValid.validate(_reqBody);
}

exports.loginValidate = (_reqBody) => {
    let joiValid = joi.object({
        email: joi.string().min(5).max(30).email().required(),
        password: joi.string().min(2).max(30).required()
    })

    return joiValid.validate(_reqBody);
}

exports.genToken = (_id) => {
    let token = jwt.sign({_id}, secret.secretWord, { expiresIn: "600mins" });
    return token;
}