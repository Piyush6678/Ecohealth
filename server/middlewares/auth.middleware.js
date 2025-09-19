
import  jwt  from "jsonwebtoken";
export const authMiddleware=(req,res,next)=>{
       const userid= req.headers["authorization"];

    const decode=  jwt.verify(userid ,process.env.JWT_SECRET)
    if(decode){
        //@ts-ignore
        req.user= decode.id;
        next()
    }
} 