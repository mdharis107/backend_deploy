const express = require("express");
const { connection } = require("./config/db");
const { UserModel } = require("./models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors")

const { authentication } = require("./middleware/authentication");
const { userRouter } = require("./routes/profile.route");
require("dotenv").config()
const app = express();

app.use(cors())

app.use(express.json());

const PORT = process.env.PORT || 8000


//Home Page
app.get("/", (req, res) => {
    res.send("The HomePage of the Application")
})


//SIGN UP
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const isUser = await UserModel.findOne({ email })
    if (isUser) {
        res.send({"msg":"User already exists try logging in"})
    }
    else{
        bcrypt.hash(password, 4, async function (err, hash) {
            if (err) {
                res.send({"msg":"Something went wrong sign later"})
            }
            try {
                const new_user = new UserModel({
                    name,
                    email,
                    password: hash
                })
                await new_user.save()
                res.send({"msg":"Sign up Successful"})
            } catch (err) {
                res.send({"msg":"Sign Up not Successful"})
                console.log(err)
            }
        });
    }

})


//LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    const hashed_password = user.password;
    const user_id = user._id
    console.log(user_id)

    bcrypt.compare(password, hashed_password, function (err, result) {
        if (err) {
            res.send({"msg":"Something went wrong try again later"})
        }
        if (result) {
            const token = jwt.sign({ user_id }, process.env.PRIVATE_KEY);
            res.send({ token: token, message: "Login Successful" })
        }
        else {
            res.send({"msg":"Login failed"})
        }
    });

})


//Routes
app.use("/user", authentication,userRouter)


//Listening port
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connection to DB is successful")
    } catch (err) {
        console.log("Connection to DB is failed")
        console.log(err)
    }
    console.log(`The port is listening on ${PORT}`)
})