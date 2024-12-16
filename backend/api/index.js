import express from 'express';import jwt from "jsonwebtoken";import cors from "cors";
import {AuthMiddleware, checkIfUserPresent, isUserPresent} from '../middlewares/userMiddlewares.js';
import { connectDB, Reports, User} from '../db/db.js';import bcrypt from "bcrypt";
import { sendMailToUserOnCreatingReport } from '../mails/createReportMail.js';
const app = express();

app.use(cors({
	origin: '*',  // Allow all origins
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // Allow all methods
	allowedHeaders: '*',  // Allow all headers
	credentials: true  // Allow credentials (like cookies)
  }));
  app.use(express.json());

app.get('/',(req, res)=>{
	res.send("Hi Sreecharan desu");
});


app.post('/api/auth/register',checkIfUserPresent,async(req,res)=>{
	const {name,email,password,studentId,department} = req.body;
	try{
		const hashedPassword = await bcrypt.hash(password,10);
		const user = await User.create({
			name : name,
			password : hashedPassword,
			department : department,
			studentId : studentId,
			email : email
		})
		const token = await jwt.sign(user.id,'cde52dae09247f763133');
		res.send({
			token,
			user
		})
	}catch(e){
		res.json({
			msg : 'Error creating account please try again',success : false
		})
	}
})


app.post('/api/auth/login',isUserPresent,async(req,res)=>{
	const email = req.body.email;
	try{
		const user = await User.findOne({
			email : email
		})
		const token = await jwt.sign(user.id,'cde52dae09247f763133');
		res.send({
			token,
			user
		})
	}catch(e){
		res.json({
			msg : 'Error logging in account please try again',success : false
		})
	}
})


app.get('/api/auth/verify',AuthMiddleware,async(req,res)=>{
	const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    const userId = await jwt.verify(token,'cde52dae09247f763133');
	const user = await User.findOne({_id : userId})
	if(user){
		res.json({
			user
		})
	}else{
		res.json({
			msg : 'Invalid token auth_failed',success : false
		})
	}
})


app.get('/api/reports',AuthMiddleware,async(req,res)=>{
	const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    const userId = await jwt.verify(token,'cde52dae09247f763133');
	const reports = await Reports.find({userId : userId})
	res.json({
		reports,
		success : true
	})
})


app.post('/api/reports',AuthMiddleware,async(req,res)=>{
	const {coordinates,description,location,type} = req.body;
	const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    const userId = await jwt.verify(token,'cde52dae09247f763133');

	if(coordinates == null ){
		const report = await Reports.create({
			userId : userId,
			description : description,
			location : location,
			type : type		
		})

		const user = await User.findOne({_id : userId});

		await sendMailToUserOnCreatingReport(user,report);
	
		res.json({
			msg : `report with _id${report._id} created successfully.`,
			success : true
		})
	}else{
		const report = await Reports.create({
			userId : userId,
			coordinates : {
				latitude : coordinates.latitude,
				longitude : coordinates.longitude
			},
			description : description,
			location : location,
			type : type		
		})

		const user = await User.findOne({_id : userId});

		await sendMailToUserOnCreatingReport(user,report);
	
		res.json({
			msg : `report with _id${report._id} created successfully.`,
			success : true
		})
	}
})

connectDB();
app.listen(5000, () => {console.log('Server ready on port 5000.')});