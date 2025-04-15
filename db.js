const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    first_name: String,
    last_name: String
})

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    first_name: String,
    last_name: String
})
const courseSchema = new Schema({
    title: String,
    description: String,
    price: { type: Number },
    imageurl: String,
    creatorid: ObjectId
})
const purchaseSchema = new Schema({
    userid: ObjectId,
    courseid: ObjectId
})

const adminModel = mongoose.model("admin",adminSchema);
const userModel = mongoose.model("user",userSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports = {
    adminModel: adminModel,
    userModel: userModel,
    courseModel: courseModel,
    purchaseModel: purchaseModel
};