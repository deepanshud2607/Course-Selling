const express = require("express"); //Express Library
const z = require("zod"); //Zod For Validation
const jwt = require("jsonwebtoken"); //JWT for Authorization
const mongoose = require("mongoose"); //Mongoose to control MongoDB
const { userRouter } = require("./routes/user"); //userRouter to handle all /user routes
const {courseRouter} = require("./routes/courses");
const { adminRouter } = require("./routes/admin");
require("dotenv").config(); 
const app = express();


app.use(express.json()); //For Parsing the Body

const port = process.env.PORT; 

app.use("/user", userRouter); 
app.use("/admin", adminRouter);
app.use("/courses", courseRouter);



app.use((err, req, res, next)=>{
    res.status(500).send("Fatal Error Occurred"); //Global error handler middleware
});



async function main(){
    await mongoose.connect(process.env.MONGO_URI); //Conntect to the mongoDB
    app.listen(port, ()=>{
    console.log(`Listening to port ${port}`); //Listen to the port only if database is connected otherwise throw an error
    })
}
main(); //Use the Main function

