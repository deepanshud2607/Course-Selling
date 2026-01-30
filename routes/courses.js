const {Router} = require("express");
const { Course } = require("../schemas/db");
const courseRouter = Router();



courseRouter.get('/', async (req, res)=>{
    try{
        const courses = await Course.find();
        res.status(200).json(courses);

    }catch(err){
        console.log(err);
        res.status(404).send("No courses found. Unexpected error");
    }
});

courseRouter.get('/preview', async (req,res, next) =>{
    try{
        const courseID = req.query.courseID;
        const course = await Course.findById(courseID);
        if(!course){
            return res.status(404).send("No Course with this course ID");
        }
        res.status(200).json(course);
    }
    catch(err){
        console.log(err);
        next(err);
    }
});



module.exports = {
    courseRouter : courseRouter,
}