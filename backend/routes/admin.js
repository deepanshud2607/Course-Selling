const {Router} = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Admin, Course  } = require("../schemas/db");
const { validation, courseValid, passwordValidation } = require("../schemas/validation");
const bcrypt = require("bcrypt");
require("dotenv").config();

const adminRouter = Router();

const jwtPass = process.env.ADMIN_JWT_SECRET;



async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization header missing" }); //Check if token is present
    }
    const payload = jwt.verify(token, jwtPass); //Verify the token if present

    const id = payload.adminID;
    
    const admin = await Admin.findById(id); //Find the admin
    if (!admin) {
      return res.status(404).send("Creator doesn't exist"); //Admin must be present
    }
    req.adminID = id; //Attach adminID to request
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token Sent"); //Error catching
  }
}

adminRouter.post('/signup', async (req,res,next)=>{
    try{
        const isValid =  validation.safeParse(req.body);
        if(!isValid.success){
            return res.status(400).send("Invalid Input Format");
        }
        const { email, password, firstName, lastName } = req.body;

        const exists = await Admin.findOne({email});
        if(exists){
            return res.status(409).send("Admin Already exists, Kindly Login");
        }
        const hashedPass = await bcrypt.hash(password, 10); //Password with number of salt rounds
        await Admin.create({
            email,
            password : hashedPass,
            firstName,
            lastName,
        });
        res.status(201).send("Admin Created");
    }catch(err){
        next(err);
    }
})

adminRouter.post('/login', async (req,res, next) => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(404).send("Admin Doesn't exists. Kindly Signup");
        }
        const match = await bcrypt.compare(password, admin.password);
        if(!match){
            return res.status(403).send("Incorrect password.");
        }
        const token =  jwt.sign({adminID : admin._id}, jwtPass);
        res.status(200).json({authorization : token});

    }catch(err){
        next(err);
    }
});

adminRouter.use(authMiddleware);
adminRouter.put('/resetPass', async (req, res, next)=>{
    try{
    const { oldPass, newPass } = req.body;
    if(!oldPass || !newPass){
        return res.status(404).send("Old Password and new Password can't be empty");

    }
    const isValid = passwordValidation.safeParse(newPass);
    if(!isValid.success){
        return res.status(403).send("New Password must contain an UpperCase and an Integer");
    }
    const admin = await Admin.findById(req.adminID);
    if(!admin){
        return res.status(404).send("Admin does not Exist");
    }
    const match = await bcrypt.compare(oldPass, admin.password);
    if(!match){
        return res.status(403).send("Incorrect Current Password");
    }
    const isNotNew = await bcrypt.compare(newPass, user.password);
    if(isNotNew){
        return res.status(400).send("New and Old Password can't be same");
    }
    const newHashedPass = await bcrypt.hash(newPass, 10);
    admin.password = newHashedPass;
    await admin.save();
    res.status(200).send("Password Changed");
    }
    catch(err){
        next(err);
    }
});
adminRouter.get('/courses', async (req,res, next) =>{
    try{
        const adminID = req.adminID;
        const courses = await Course.find({ creatorID : adminID });
        res.status(200).json(courses);
    }catch(err){
        next(err);
    }
});

adminRouter.post('/courses', async (req,res, next) => {
    try{
    const { title, description, price, imageURL } = req.body;
    const isValid = courseValid.safeParse(req.body);
    if(!(isValid.success)){
        return res.status(400).send("Invalid Format for Course Addition");
    }
    const adminID = req.adminID;
    await Course.create({
        title,
        description,
        price,
        imageURL,
        creatorID : adminID,
    });
    res.status(201).send("Course Added");
    }catch(err){
        next(err);
    }
});

adminRouter.put('/courses', async (req,res, next) =>{
    try{
        const { title, description, price, imageURL } = req.body;
        const isValid = courseValid.partial().safeParse(req.body);
        const courseID = req.query.courseID;
        const adminID = req.adminID;
        if(!(isValid.success)) return res.status(401).send("Invalid Formats shared");
        const course = await Course.findOne({_id : courseID, creatorID : adminID});
        if(!course){
            return res.status(404).send("Course not found");
        }
        if(title !== undefined){
            course.title = title;
        }
        if(description !== undefined) course.description = description;
        if(price !== undefined) course.price = price;
        if(imageURL !== undefined) course.imageURL = imageURL;
        await course.save();
        res.status(200).send("Course updated");
    }catch(err){
        next(err);
    }
});
adminRouter.delete('/courses', async (req,res, next) => {
    try{
        const courseID = req.query.courseID;
        const adminID = req.adminID;
        const course = await Course.findOneAndDelete({_id : courseID, creatorID : adminID});
        if(!course) return res.status(209).send("Course Not Found.");
        res.status(200).send("Course Deleted");
    }catch(err){
        next(err);
    }
})

module.exports = {
    adminRouter : adminRouter,
}