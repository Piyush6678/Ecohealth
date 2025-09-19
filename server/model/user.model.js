import{Schema ,model} from 'mongoose';
import  bcrypt from "bcryptjs"
import  jwt  from "jsonwebtoken";
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  weeklyCalories: {
    // Stores calories per day for current week (0=Sunday, 1=Monday, ..., 6=Saturday)
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0] // 7 elements, one per weekday
  },
  weeklyProtein: {
    // Stores protein (g) per day for current week (0=Sunday, ..., 6=Saturday)
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0]
  },
   weeklyCarbonFootprint: {
        // Stores total kg CO2e per day for the current week (0=Sunday, ..., 6=Saturday)
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0] // 7 elements, one for each day
    },
   goals: {
    calorieTarget: { type: Number, default: 2000 },
    proteinTarget: { type: Number, default: 150 },
    carbonLimit: { type: Number, default: 5 },
  },
  // Optionally, store day names for clarity
  lastUpdated: {
    type: Date,
    default: Date.now
  }
},{
  timestamps:true
});
userSchema.pre("save",async function (next){
if(!this.isModified("password")){
return next()
}
 this.password=await bcrypt.hash(this.password,10)
})
userSchema.methods={
    generateJWTToken:async function(){
        return  jwt.sign({
            id:this._id
        },process.env.JWT_SECRET|| "aiufhvhbauvauv")
    },
    comparePassword:async function(password){
       return await  bcrypt.compare(password,this.password)
    },

  

}
const userModel=model('User', userSchema)
export default userModel
