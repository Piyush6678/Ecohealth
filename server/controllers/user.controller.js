import userModel from "../model/user.model.js";
import AppError from "../utils/error.utils.js";
const register =async(req,res,next)=>{
    const {username,email,password}=req.body;
 if(!username ||! email || !password){
    return next( new AppError("all fields are reuired",400))
}
const userExists=await userModel.findOne({
    email
})
if(userExists){
      return next( new AppError("user alreday exists",400))
}
const  user =await userModel.create({
    username,email,password,
    
})
if(!user ){
    return next(new AppError("user registeration failed ,please try again",400))
}
await user.save();
const token =await user.generateJWTToken()
console.log(token);
res.status(200).json({
    success:true,
    message:"User registered successfully",
    user,
    token
})
}

const login=async(req,res,next)=>{
 try{   const {email,password}=req.body;
if(! email || !password){
    return next( new AppError("all fields are reuired",400))
}
const user=await userModel.findOne({email}).select("+password");
const isMatch = await user.comparePassword(password);
if (!user || !isMatch) {
  return next(new AppError("email or password does not match", 400));
}

const token=await user.generateJWTToken()
user.password=undefined;

res.status(200).json({
    success:true,
    message:"User logged in  successfully",
    user,token
})}catch(e){

    return next(new AppError(e.message,500));
}
}




 const updateUserGoals = async (req, res) => {
  // 1. Extract goal values from the request body
  const { calorieTarget, proteinTarget, carbonLimit } = req.body;
  
  // It's good practice to validate that the inputs are numbers
  if (isNaN(calorieTarget) || isNaN(proteinTarget) || isNaN(carbonLimit)) {
    return res.status(400).json({ success: false, message: 'All goal values must be numbers.' });
  }

  try {
    // 2. The user's ID is attached to the request by the auth middleware
    const userId = req.user;

    // 3. Find the user and update their goals
    // The { new: true } option returns the document after the update has been applied.
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          'goals.calorieTarget': Number(calorieTarget), 
          'goals.proteinTarget': Number(proteinTarget),
          'goals.carbonLimit': Number(carbonLimit),
        }
      },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude the password from the returned object

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // 4. Send a success response with the updated user data
    res.status(200).json({
      success: true,
      message: 'Goals updated successfully!',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user goals:', error);
    res.status(500).json({ success: false, message: 'Server error while updating goals.' });
  }
};
export{register,login,updateUserGoals}