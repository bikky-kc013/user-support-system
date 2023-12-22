const jwt = require("jsonwebtoken");
const customError = require("../middlewares/customError");



const logininAccessToken = async (userid,role)=>{
    try{
        const expiry = 30*24
        const payload = {
            userid,
            role
        };
        const secret = process.env.SECRET_KEY
        const otpions = { expiresIn:`${expiry}h`}
        const token = await jwt.sign(payload,secret,otpions);
        return token;

    }catch(error){
        next(error);
    }
}

const tokenValidate = async (req,res,next) =>{
    try{
      if(!req.headers['authorization']) throw new customError("No any authorization headers provided");
     const bearerToken = req.headers['authorization'].slice(7);
     if(!bearerToken) throw new customError("No authorization headers found");
     return jwt.verify(bearerToken, process.env.SECRET_KEY, (err,payload)=>{
        if(err){
        throw new customError("Sorry you are not authorized to access this route");
        }
        next();
     })
     }catch(error){
        next(error);
    }
};

const getUser_id = async (token)=>{
  try{
    const user_id  = await (jwt.verify(token,process.env.SECRET_KEY)).userid;
    return user_id;   
  }catch(error){
    console.log(error);
  }
}


const getUser_role = async (token)=>{
  try{
    const user_role  = await (jwt.verify(token,process.env.SECRET_KEY)).role;
    return user_role;   
  }catch(error){
    console.log(error);
  }
}




module.exports = {
     logininAccessToken, tokenValidate, getUser_id, getUser_role
};
