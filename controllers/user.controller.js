import userModel from "../model/user.model.js";
import AppError from "../utils/error.utils.js";
const register =async(req,res,next)=>{
    const {username,email,password}=req.body;
 if(!username ||! email || !password){
    return next( new AppError("all fields are reuired",400))
}
const userExists=await User.findOne({
    email
})
if(userExists){
      return next( new AppError("user alreday exists",400))
}
const  user =await userModel.create({
    fullname,email,password,
    
})
if(!user ){
    return next(new AppError("user registeration failed ,please try again",400))
}
await user.save();
const token =await user.generateJWTToken()
res.cookie("token",token,cookieOptions)
res.status(200).json({
    success:true,
    message:"User registered successfully",
    user
})
}

const login=async(req,res,next)=>{
 try{   const {email,password}=req.body;
if(!fullname ||! email || !password){
    return next( new AppError("all fields are reuired",400))
}
const user=await User.findOne({email}).select("+password");
if(!user || !user.comparePassword(password)){
    return next (new AppError("email or password does not match ",40))
}
const token=await user.generateJWTToken()
user.password=undefined();
res.cookie("token",token,cookieOptions)
res.status(200).json({
    success:true,
    message:"User logged in  successfully",
    user
})}catch(e){

    return next(new AppError(e.message,500));
}
}
export{register,login}