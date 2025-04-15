const { Router } = require("express");
const adminRouter = Router();
const { adminModel,courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const  { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup",async function(req,res){
    //ZOD
    const reqbody = z.object({
        email: z.string().min(3).max(50).email(),
        password: z.string().min(5).max(50),
        first_name: z.string().min(3).max(50),
        last_name: z.string().min(3).max(50),
    })

    const parse=reqbody.safeParse(req.body);
    if(!parse.success)
    {
        res.status(403).json({
            message: "incorrect format",
            error: parse.error
        })
    }
    const { email, password, first_name, last_name } = req.body;
    //BCRYPT
    try{ // if duplicate email 
        const hashpass = await bcrypt.hash(password,5);
        await adminModel.create({
            email: email,
            password: hashpass,
            first_name: first_name,
            last_name: last_name
        })

        res.json({
            message: "you are successfully sign up"
        })
    }catch(err)
    {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        console.error("Signup error:", err);
        return res.status(500).json({
            message: "Something went wrong on the server"
        });
    }
})

adminRouter.post("/signin",async function(req,res){
    const { email, password, first_name, last_name } = req.body;

    const response = await adminModel.findOne({
        email: email,
    })
    if(response){
        const match = await bcrypt.compare(password,response.password);
        if(!match){
            res.status(403).json({
                message: "password is incorrect"
            })
        }
        const token = jwt.sign({
            id: response._id.toString()
        },JWT_ADMIN_PASSWORD);
        res.json({
            token: token
        })
    }
    else{
        res.json({
            message: "email not found"
        })
    }
})

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminid = req.userid;
    const { title, description, price, imageurl } = req.body;

    const course =await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageurl: imageurl,
        creatorid: adminid
    })
    
    res.json({
        message: "Course successfully Created",
        courseId: course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId = req.userid;
    const { title, description, imageUrl, price, courseId } = req.body;

    try
    {
        const course = await courseModel.updateOne({
        
            _id: courseId,
            creatorid: adminId
            
        },{
            title: title, 
            description: description, 
            imageUrl: imageUrl, 
            price: price
        })
        
        res.json({
            message: "course is successfully updated"
        })
    }catch(err)
    {
        res.json({
            message: "updation is failed",
            error: err
        })
    }
})
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId = req.userid;

    const courses = await courseModel.find({
        creatorid: adminId 
    });

    res.json({
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
};