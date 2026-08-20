const { Router } = require("express");
const { User, Course, Purchases } = require("../schemas/db");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const { validation, passwordValidation } = require("../schemas/validation");
require("dotenv").config();


const jwtPass = process.env.USER_JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const payload = jwt.verify(token, jwtPass);
    const id = payload.id;
    const res = await User.findById(id);
    if (!res) {
      return res.status(404).send("User doesn't exist");
    }
    req.userID = id;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token Sent");
  }
}

userRouter.post("/signup", async (req, res, next) => {
  try {
    const isValid =  validation.safeParse(req.body);
    if (!isValid.success)
      return res.status(403).send("Invalid Mail or password");
    const { email, password, firstName, lastName } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send("Account with this mail already exists");
    }
    const hashedPass = await bcrypt.hash(password, 10 );
    await User.create({
      email,
      password: hashedPass,
      firstName,
      lastName,
    });

    res.status(201).send("User Created");
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User doesn't exist. Signup");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Incorrect Password entered");
    }

    const token = jwt.sign({ id: user._id }, jwtPass, { expiresIn: "5d" });
    res.status(200).json({ authorization: token });
  } catch (err) {
    next(err);
  }
});

// The browser sends Google's short-lived ID token here. It is verified with
// Google before we create or sign in a local CourseHub user.
userRouter.post("/google", async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).send("Google credential is required");
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(500).send("Google sign-in is not configured");

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) return res.status(401).send("Google email could not be verified");

    let user = await User.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      const names = (payload.name || "Google User").trim().split(/\s+/);
      user = await User.create({
        email: payload.email.toLowerCase(),
        // A random hash keeps the existing password schema compatible. This
        // account is authenticated through Google unless a password is later set.
        password: await bcrypt.hash(require("crypto").randomBytes(32).toString("hex"), 10),
        firstName: payload.given_name || names[0],
        lastName: payload.family_name || names.slice(1).join(" "),
      });
    }

    const token = jwt.sign({ id: user._id }, jwtPass, { expiresIn: "5d" });
    res.status(200).json({ authorization: token });
  } catch (err) {
    if (err.message?.toLowerCase().includes("token")) return res.status(401).send("Invalid Google credential");
    next(err);
  }
});

userRouter.use(authMiddleware);

userRouter.put('/resetPass', async (req, res, next)=>{
    try{
    const { oldPass, newPass } = req.body;
    if(!oldPass || !newPass){
        return res.status(400).send("Old Password and new Password can't be empty");

    }
    const isValid = passwordValidation.safeParse(newPass);
    if(!isValid.success){
        return res.status(400).send("New Password must contain an UpperCase and an Integer");
    }
    const user = await User.findById(req.userID);
    if(!user){
        return res.status(404).send("User does not Exist");
    }
    const match = await bcrypt.compare(oldPass, user.password);
    if(!match){
        return res.status(400).send("Incorrect Current Password");
    }
    const isNotNew = await bcrypt.compare(newPass, user.password);
    if(isNotNew){
        return res.status(400).send("New and Old Password can't be same");
    }
    const newHashedPass = await bcrypt.hash(newPass, 10);
    user.password = newHashedPass;
    await user.save();
    res.status(200).send("Password Changed");
    }
    catch(err){
        next(err);
    }
});

userRouter.get("/purchases", async (req, res, next) => {
  //All the courses User has purchased.
  try {
    const userID = req.userID;
    const result = await Purchases.find({userID}).populate('courseID');
    res.status(200).json(result.map(purchases => purchases.courseID));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/purchase", async (req, res, next) => {
  try {
    const id = req.query.courseID;
    const userID = req.userID;
    const isAlreadyPurchased = await Purchases.findOne({ userID, courseID: id });
    if (isAlreadyPurchased) {
      return res.status(400).send("Course Already Purchased");
    }
    const data = await Course.findById(id);
    if (!data) {
      return res.status(404).send("Course Not Found");
    }

    await Purchases.create({
      userID: userID,
      courseID: id,
    });
    res.status(201).send("Successfully Purchased");
  } catch (err) {
    next(err);
  }
});

module.exports = {
  userRouter: userRouter,
};
