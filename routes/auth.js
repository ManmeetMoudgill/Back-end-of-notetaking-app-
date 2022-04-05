const express=require('express');
//creating an router for our routes
const router=express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser=require('../middleware/fetchuser');
const  bcrypt = require('bcryptjs');
const User=require('../models/User');
var jwt = require('jsonwebtoken');
const res = require('express/lib/response');

require('dotenv').config();

// creating an new user ---> '/api/auth'
//the array is used for validation using espress validator
router.post('/createUser',[
    body('email').isEmail(),
    body('name').isLength({min:5}),
    body('password').isLength({min:8})
    
],async (req,res)=>{
    
    console.log(req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    
    //encypting the password
    const salt= await bcrypt.genSalt(10);
    const securePassword=await bcrypt.hash(req.body.password,salt);
    var success=false;
    try {
        let user=await User.findOne({email:req.body.email});
        if(user){
            
            return res.status(400).json({success,error:"Sorry a user with this email already exists"})
        }
        user=await User.create({
            name: req.body.name,
            email:req.body.email,
            password: securePassword,
        })
        

        const data={
            user:{
                id:user.id
            }
        }

        const authToken=jwt.sign({
            data},process.env.jwt_securekey);


        success=true;
        res.send({success,authToken});
        
    } catch (error) {
        
        res.status(500).send({success,error:error.message})
    }
    
    
})



//creating route for login
router.post('/login',[
    body('email').isEmail(),
    body('password').exists()
],async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const {email,password}=req.body;

    try {
        const user=await User.findOne({email});
        var success=false;
        if(!user){
            return res.status(400).json({success,error:"Please provide the right credentials"});
        }
    
        const passwordCompared=await bcrypt.compare(password,user.password);
        if(!passwordCompared){
            return res.status(400).json({success,error:"Please provide the right credentials"});
    
        }
    
        const payload={
            user:{
                id:user.id
            }
        }
    
        const authToken=jwt.sign({
            payload},process.env.jwt_securekey);
    
        res.send({success:true,authToken});
        
    } catch (error) {
        console.error(error);
        res.status(500).send({error:error.message})
    }
    
})



//another roiter for getting the user information
router.post('/getuser',fetchuser,async (req,res)=>{


    try {
        let userId=req.user.id;
        //select all the data of the user except the password
        const user=await User.findById(userId).select("-password");
        res.send({user});
        
    } catch (error) {
        console.error(error);
        res.status(500).send({error:error.message})
    }

})
module.exports=router;
