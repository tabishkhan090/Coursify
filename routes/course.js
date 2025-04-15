const { Router } = require("express");
const courseRouter = Router();
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");


courseRouter.post("/purchase",userMiddleware,async function(req,res){
    const userid = req.userid;
    const courseid = req.body.courseid;

    await purchaseModel.create({
        userid: userid,
        courseid: courseid
    })

    res.json({
        message: "You have successfully bought the course"
    })
})

courseRouter.get("/preview",async function(req,res){
    const courses = courseModel.find({})
    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
};