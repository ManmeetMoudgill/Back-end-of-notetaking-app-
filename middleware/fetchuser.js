const jwt=require('jsonwebtoken');
require('dotenv').config();

//middleware takes three paramters first one is the request and the second one is the response and the third one is the next() function
const fetchuser=(req,res,next)=>{

    const token=req.header('auth-token');
  
    if(!token){
        return res.status(400).json({error:"Please authenticate using valid token"});
    }
    try {

        const data=jwt.verify(token,process.env.jwt_securekey);
        
        //sending the user through the request
        req.user=data.payload.user;
       
        next()
    } catch (error) {
        console.error(error);
        return res.status(400).json({error:"Please authenticate using valid token"});
    }

    //caliing the next function if everthing goes well
}


module.exports=fetchuser;