const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
let userSchema = new mongoose.Schema({
    fristname:{type:String,required:true},
    lastname:{type:String,required:true},
    user_image:{type:String,default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Duser&psig=AOvVaw3y-91M40znCklG3cIxBL1b&ust=1715770119043000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDgjfr7jIYDFQAAAAAdAAAAABAE"},
    email:{type:String,required:true,unique:true,index:true},
    mobile:{type:String,required:true,unique:true,index:true},
    password:{type:String,required:true},
    roles:{type:String,default:"user"},
    profession:{type:String,required:true},
    isblocked:{type:Boolean,default:false}
},{
    timestamps:true,
});

userSchema.pre("save" , async function (next) { 
    if(!this.isModified("Password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password , salt);
    next();
})

userSchema.methods.isPasswodMatched  = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
module.exports = mongoose.model("User",userSchema);