const mongoose = require("mongoose");
const joi = require("joi");
const Joi = require("joi");

let toySchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String, 
    img_url:String, 
    price:String,
    date_created:{
        type:Date, default:Date.now()
    },
    user_id:String
})

exports.toyModel = mongoose.model("toys", toySchema);

exports.validateToy = (_reqBody)=>{
    let joiSchema = joi.object({
        name:Joi.string().min(2).max(50).required(),
        info:Joi.string().min(2).max(500).required(),
        category:Joi.string().min(2).max(200).required(),
        img_url:Joi.string().min(3).max(500).allow(null,""),
        price:Joi.string().min(1).max(9999).required()
    })
    return joiSchema.validate(_reqBody);
}