const {secret} = require("../config/secret.js");
const mongoose= require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${secret.name}:${secret.password}@cluster0.pi4br.mongodb.net/project`);
  console.log("mongo atlas conect")
}
