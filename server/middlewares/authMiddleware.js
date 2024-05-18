const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token =req?.headers?.authorization?.split(" ")[1];
        try{
            if(token){
                const decoded =jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next()
            }
        }catch(error){
            throw new Error(error)
        }
    }else{
        throw new Error("There is no token attached to the header");
    }
    
})


const isAdmain = asyncHandler(async (req,res,next)=>{
    const {email} = req.user;
    const isAdmain = await User.findOne({email:email});
    if(isAdmain.roles != "admin"){
        throw new Error("You are not Admin")

    }else{
        next()
    }
})
const isInstructor = asyncHandler(async (req,res,next)=>{
    const {email} = req.user;
    const isInstructor = await User.findOne({email:email});
    if(isInstructor.roles != "instructor"){
        throw new Error("You are not Instructor")

    }else{
        next()
    }
})

module.exports = {authMiddleware,isAdmain,isInstructor};