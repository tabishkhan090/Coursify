const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const { adminRouter } = require("./routes/admin");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");

const app=express();
app.use(express.json());

app.use("/admin",adminRouter);
app.use("/course",courseRouter);
app.use("/user",userRouter);

async function main(){
    await mongoose.connect(process.env.mongodbURL);
    app.listen(3000);
    console.log("listeing at port 3000");
}
main();