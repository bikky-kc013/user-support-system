const bcrypt = require("bcrypt");

const hashPassword = async (userPassword)=>{
    try{
        const salt = 10;
        const hashPass =await bcrypt.hash(userPassword, salt);
        return hashPass;
    }catch(error){
       console.log("unable to hash the password");
    }
}


const passcheck = async (enteredPassword, userPassword)=>{
    try{
      const isValid  = await bcrypt.compare(enteredPassword,userPassword);
      return isValid;
  
    }catch(error){
      console.log(error);
    }
  }

module.exports =  { hashPassword, passcheck };