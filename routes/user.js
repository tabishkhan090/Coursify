const {Router} = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const  { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup",async function(req,res){
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
        await userModel.create({
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

userRouter.post("/signin",async function(req,res){
    const { email, password, first_name, last_name } = req.body;

    const response = await userModel.findOne({
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
        },JWT_USER_PASSWORD);
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
userRouter.post("/purchases",userMiddleware,async function(req,res){
    const userid = req.userid;

    const purchases = await purchaseModel.find({
        userid,
    });

    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
};
