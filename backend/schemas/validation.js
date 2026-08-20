const z = require("zod");

const validation = z.object({
    email : z.email(),
    password : z.string().min(8).regex(/[A-Z]/, "Must contain Uppercase").regex(/[0-9]/, "Must contain a number"),
    firstName : z.string(),
    lastName : z.string(),
});

const passwordValidation = z.string().min(8).regex(/[A-Z]/, "Must contain Uppercase").regex(/[0-9]/, "Must contain a number");

const courseValid = z.object({
    title : z.string(),
    description : z.string().min(30),
    price : z.coerce.number(),
    imageURL : z.url(),
    contentURL : z.url(),
})

module.exports = {
    validation,
    courseValid,
    passwordValidation,
}
