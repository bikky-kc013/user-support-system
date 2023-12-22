const customError = require("../middlewares/customError");
const { getUserIdByEmail,  userExists, insertUserData, getUserPassword, getUser_id, check_user_role } = require("../models/userModels");
const { userRegisterValidator, userloginValidator } = require("../validators/userValidator");
const { passcheck } = require("../helpers/passHasher");
const { logininAccessToken } = require("../helpers/jwtTokens");
const { string } = require("joi");


const userRegister  = async (req,res,next)=>{
    try {
    
        const registerData = await userRegisterValidator.validateAsync(req.body);
        const checkUserExists = await userExists(registerData.email);
        if (checkUserExists) {
        throw new customError("This email already exists please try again with the another email");
        }  
        const saveUser  = await insertUserData(registerData);
        const userId = await getUserIdByEmail(registerData.email);
        res.json({
          message:"User registred successfully",
          status:"success"
        });
        } catch (error) {
        next(error);
        }
}


const userLoginController = async (req,res,next)=>{
  try{
      const loginData = await userloginValidator.validateAsync(req.body);
      const userRole = await check_user_role(loginData.email);
      const exists = await userExists(loginData.email);
      if(exists === null) throw new customError("The email provided is not registred");
      const password  = await getUserPassword(loginData.email);
      console.log(password);
      const isvalid = await passcheck(loginData.password,password);
      if(!isvalid) throw new customError("Please enter the valid password and try again");
      const userid  = await getUser_id(loginData);
      const loginToken  = await logininAccessToken(userid,userRole);
      res.json({
          message:"Logged in Successfully",
          status:"success",
          user_id:userid,
          accessToken:loginToken
      })
  }catch(error){
      next(error);
  }
}



module.exports = {
    userRegister, userLoginController
};
