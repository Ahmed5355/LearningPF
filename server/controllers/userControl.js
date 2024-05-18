const { json } = require("body-parser");
const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../config/validateMongodbId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Register User
const registerUser = asyncHandler(async(req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});

    if(!findUser){
        const createUser = await User.create(req.body);
        res.status(200).json({
            status:true,
            message:"User Created successfully",
            createUser:createUser

        });
    }else{
        throw new Error("User Already Exists");
    }
})

// Login User
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const findUser = await User.findOne({email:email});

    if(findUser &&(await findUser.isPasswodMatched(password)) ){
        res.status(200).json({
            status:true,
            message:"User login successfully",
            Token:generateToken(findUser?._id),
            role:findUser?.roles,
            username:findUser?.fristname+" "+findUser?.lastname,
            user_image: findUser?.user_image

        });

    }else{
        throw new Error("Invalid Email/Passwoerd");
    }
})
// All User
const getAllUsers = asyncHandler(async (req,res) =>{
    try {
        const allUser = await User.find();
        res.status(200).json({
            status:true,
            message:"All Users Fatched Successfully",
            allUser
            
        });   
    } catch (error) {
        throw new Error(error);
    }

})

// Get User
const getAUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findById(id);
        res.status(200).json({
            status:true,
            message:"User Fatched Successfully.",
            getUser

    })
    } catch (error) {
        throw new Error(error);
    }
})

// Update User
const updateUser = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password , salt);
        const user = await User.findByIdAndUpdate(_id,req.body,{new:true});
        res.status(200).json({
            status:true,
            message:"Profile updated successfully!",
            user
        })
    } catch (error) {
        throw new Error(error);
    }

})

// Delete User 

const deleteUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            status:true,
            message:"User Deleted Successfully."
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Block User

const blockUser= asyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        await User.findByIdAndUpdate(id,{isblocked:true},{new:true});
        res.status(200).json({
            status:true,
            message:"User Blocked Successfully."
        })
    } catch (error) {
        throw new Error(error);
    }
})
// Unblock User

const unBlockUser= asyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        await User.findByIdAndUpdate(id,{isblocked:false},{new:true});
        res.status(200).json({
            status:true,
            message:"User Unblocked Successfully."
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Update Password
const updatePassword = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongodbId(_id);
    try {
        const user = await User.findById(_id);
        if(user&& (await user.isPasswodMatched(password))){
            throw new Error("Please provide a new password instead of old one.");
        }else{
            user.password = password;
            await user.save();
            res.status(200).json({
                status:true,
                message:"Password Updated Successfully"
            })
        }
    } catch (error) {
        throw new Error(error);
    }
})

// forget Password

const forgetPassword = asyncHandler(async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if((!user)) throw new Error("User Not Found!");

    try {
        const secretKey = process.env.JWT_SECRET + user.password;
        const token = jwt.sign({email:user.email,id:user?._id},secretKey,{expiresIn:"10m"});
        const link = `http://localhost:4000/user/forget-password/:${user?._id}/:${token}`;
        res.status("200").json({
            status:true,
            link:link
        })
    } catch (error) {
        throw new Error(error);
    }
})


// Reset Password 
const resetPassword = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.userId);
    if((!user)) throw new Error("User Not Found!");
    try {
        const secretKey = process.env.JWT_SECRET + user.password;
        jwt.verify(req.params.token,secretKey);
        const salt = await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password;
        await user.save();
        res.status("200").json({
            status:true,
            message:"Password Chanaged"
        })
    } catch (error) {
        throw new Error(error);
    }

})


module.exports={
    registerUser,
    loginUser,
    getAllUsers,
    getAUser,
    updateUser,
    deleteUser,
    blockUser,
    unBlockUser,
    updatePassword,
    forgetPassword,
    resetPassword
};