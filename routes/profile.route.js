const { UserModel } = require("../models/user.model")
const { Router } = require("express");
const { BMIModel } = require("../models/BMI.model");

const userRouter = Router()

//get PROFILE
userRouter.get("/getProfile", async (req, res) => {
    const { user_id } = req.body
    const user = await UserModel.findOne({ _id: user_id })
    // console.log(user)
    const { name, email } = user
    res.send({ name, email })
})


//CALCULATION BMI
userRouter.post("/calculateBMI", async (req, res) => {
    const { height, weight, user_id } = req.body;
    const height_in_metre = Number(height * 0.3048)
    const BMI = Number(weight) / (height_in_metre ** 2)
    const new_BMI = new BMIModel({
        BMI,
        height:height_in_metre,
        weight,
        user_id 
    })
    await new_BMI.save()
    res.send({BMI})
})

userRouter.get("/getCalculation", async (req, res) => {
    const { user_id } = req.body;
    const all_bmi  = await BMIModel.find({user_id:user_id});
    res.send({history:all_bmi})
})



module.exports = { userRouter }