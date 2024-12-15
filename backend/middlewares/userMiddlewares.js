import jwt from "jsonwebtoken";import bcrypt from "bcrypt";
import { User } from "../db/db.js";

export const checkIfUserPresent = async(req,res,next)=>{
    const {name,email,password,studentId,department} = req.body;
    const user = await User.findOne({
        email : email
    })

    if(user){
        res.json({
            msg : 'Email already registered try a new One! or Login now.',
            success : false
        })
    }else{
        next();
    }
}   


export const isUserPresent = async(req,res,next)=>{
    const {email,password} = req.body;
    console.log(req.body);
    const user = await User.findOne({
        email : email
    })
    if(user){
        try{
            const isValidated = await bcrypt.compare(password,user.password);
            if(isValidated){
                next();
            }else{
                res.json({
                    msg : 'Invalid credentias please try again or reset your password now!',
                    success : true
                })
            }
        }catch(e){
            res.json({
                msg : "Error logging in please try again!",
                success : false
            })
        }
    }else{
        res.json({
            msg :  `Account with email : ${email} not found please register an account!` ,success : false
        })
    }
    

} 

export const AuthMiddleware = async(req,res,next)=>{
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    console.log("Token : ",token);
    try{
        const userId = await jwt.verify(token,'cde52dae09247f763133');
        console.log(userId)
        const user = await User.findOne({_id : userId})
        if(user){
            console.log("User found");
            next();
        }else{
            res.json({
                msg : "Invalid request",success : false
            })
        }
    }catch(e){
        res.json({
            msg : 'Error processing your request please try again!',success : false
        })
    }
}