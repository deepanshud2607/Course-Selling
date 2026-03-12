const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email : { type : String, unique : true },
    password : String,
    firstName : String, 
    lastName : String,
});

const adminSchema = new mongoose.Schema({
    email : { type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
});

const courseSchema = new mongoose.Schema({
    title : String,
    description : String,
    price : Number,
    imageURL : String,
    creatorID : { type : mongoose.Schema.Types.ObjectId, ref: "Admins"},
});

const purchasesSchema = new mongoose.Schema({
    userID : { type : mongoose.Types.ObjectId, ref : 'Users'},
    courseID : { type : mongoose.Types.ObjectId, ref : 'Courses'}
}); 

const User = mongoose.model('Users', userSchema);
const Admin = mongoose.model('Admins', adminSchema);
const Course = mongoose.model('Courses', courseSchema);
const Purchases = mongoose.model('Purchased Courses', purchasesSchema);
module.exports = {
    User,
    Admin,
    Course,
    Purchases,
}