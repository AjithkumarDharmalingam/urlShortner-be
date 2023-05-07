var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const {dbUrl} = require('../config/dbConfig')
const {UserModel} = require('../schema/usersSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin} = require('../config/auth')
const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken')
const secretKey = 'Qw3$er5ty6&iuh*9'
mongoose.connect(dbUrl)



router.post('/signup',async(req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
     if(!user){
      req.body.password = await hashPassword(req.body.password)
      let doc = new UserModel(req.body)
      await doc.save()
      res.status(201).json({
       message:"Signup Successfully"
     })
     }
     else{
      res.status(400).send({message:"Email Id already exists"})
     }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.post('/login',async(req,res)=>{
  try {
     let user = await UserModel.findOne({email:req.body.email})
     if(user)
     {
      if(await hashCompare(req.body.password,user.password))
      {
        let token = await createToken({email:user.email,firstName:user.firstName,lastName:user.lastName,role:user.role})
        res.status(200).send({message:"Login Successfull",token})
      }
      else
      {
        res.status(400).send({message:"Invalid Credential"})
      }
     }
     else{
      res.status(500).send({message:"Email does not exists"})
     }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:'ajithkumarfsd97@gmail.com',
      pass:'buluntijalegnbns'
  }
}) 

router.post('/sendpasswordlink',async(req,res)=>{
  let {email} = req.body;
  if(!email){
    res.status(401).send({message:"Enter Your Email"})
  }
  try {
    let user=await UserModel.findOne({email:req.body.email})
    
    let token=createToken({_id:user._id})
       let setuserToken=await UserModel.findByIdAndUpdate({_id:user._id},{token:token},{new:true}) 
       console.log(setuserToken.token)
        if(setuserToken){     
  const mailOptions = {
    from:'ajithkumarfsd97@gmail.com',
    to:`${email}`,
    subject:"Sending Email For password Reset",
    text:`This Link Valid For 30 MINUTES https://sensational-dragon-928dcf.netlify.app/forgotpassword/${user.id}/${setuserToken.token}`
}

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log("error",error);
        res.status(401).json({status:401,message:"email not send"})
    }else{
        console.log("Email sent",info.response);
        res.status(201).send({status:201,message:"Password Reset Link sent Succssfully In Your Email"})
    }
})

 }
  } catch (error) {
    console.log(error)
  }
})

router.get('/forgotpassword/:id/:token',async(req,res)=>{
  let{id,token}=req.params;
  
   try {
    let verifyUserId=await UserModel.findOne({_id:id,token:token})
    
    let verifyUserToken=jwt.verify(token,secretKey)
    console.log(verifyUserToken)

   if(verifyUserId && verifyUserToken){
    console.log(verifyUserId)
     res.status(201).send(verifyUserId)

   }else{
     res.status(401).send({message:"not a valid user"})
   }
   } catch (error) {
      res.status(401).send({message:"Invalid User"})
    console.log("error",error)
   }
})

router.post('/:id/:token',async(req,res)=>{
  let{id,token}=req.params;
  let{password}=req.body;
  console.log(id,token)
  console.log(password)
  try {
     let UserId=await UserModel.findOne({_id:id,token:token})
    
     let UserToken=jwt.verify(token,secretKey)
     console.log(UserToken)

    if(UserId && UserToken){
      let newPassword=await hashPassword(password)
      console.log(newPassword)
      let setPasswordInDB=await UserModel.findByIdAndUpdate({_id:id},{password:newPassword})
      setPasswordInDB.save();

     res.status(201).send(setPasswordInDB)
   }else{
     res.status(401).send({message:"not a valid user"})
 }
    } catch (error) {
      res.status(401).send({message:"Invalid User"})
    console.log("error",error)
    }
 })

module.exports = router;
