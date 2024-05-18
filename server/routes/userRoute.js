const express = require("express");
const { registerUser,loginUser, getAllUsers, updateUser, deleteUser, getAUser, blockUser, unBlockUser, updatePassword, forgetPassword, resetPassword } = require("../controllers/userControl");
const { isAdmain, authMiddleware } = require("../middlewares/authMiddleware");

const userRotuer = express.Router();
// Post
userRotuer.post("/register",registerUser);
userRotuer.post("/login",loginUser);
userRotuer.post("/forget-password" , forgetPassword)
userRotuer.post("/reset-password/:userId/:token" , resetPassword)
// Get
userRotuer.get("/all-users",authMiddleware,isAdmain,getAllUsers);
userRotuer.get("/:id",authMiddleware,getAUser);
// Put
userRotuer.put("/update-profile",authMiddleware,updateUser);
userRotuer.put("/block/:id",authMiddleware,isAdmain,blockUser);
userRotuer.put("/unblock/:id",authMiddleware,isAdmain,unBlockUser);
userRotuer.put("/update-password",authMiddleware,updatePassword);

//Delete
userRotuer.delete("/:id",authMiddleware,isAdmain,deleteUser);

module.exports = userRotuer;