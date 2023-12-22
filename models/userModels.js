const { connection } = require("../config/connection");
const { hashPassword } = require("../helpers/passHasher");
const  customError  = require("../middlewares/customError");



const userExists = async (registerData) => {
    try {
        const [userRow] = await connection.promise().query(`SELECT email FROM users WHERE email = ?`, [registerData]);
        if(userRow.length === 0){
            return null;
        }
        if(userRow.length > 0 ){
            console.log(userRow[0].email);
            return  true;
        }
    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error("Error: 'user' table does not exist.");
        } else {
            console.error(error.message);
        }
    }
};



const insertUserData = async (userData) => {
    try{
        const hashPass = await hashPassword(userData.password);
        await connection.promise().query( `INSERT INTO users(username, email, password, role) VALUES (?,?,?, ?)`,[userData.username, userData.email, hashPass, userData.role]);

    }catch(error){
        console.log(error);
    }
};




const getUserIdByEmail = async (email) => {
    try{
        const [user_Id] = await connection.promise().query(`SELECT user_id FROM users WHERE email = ? `, [email]);
        return user_Id[0].userId;
    }catch(error){
        console.log(error);
    }
};



const getUserPassByEmail = async (email) => {
  const [userPass] = await connection
    .promise()
    .query(`SELECT password FROM users WHERE email = ?`, [
      email,
    ]);
  const password = userPass[0].password;
  return password;
};



const getUserPassword  = async (email)=>{
    try{
        const [passwordRow] = await connection.promise().query(`SELECT password FROM users WHERE email = ?`, [email]);
        if(passwordRow.length === 0) throw new customError("Sorry cannot find the data from the database");
        if(passwordRow.length>0){
        const password = passwordRow[0].password;
        return password;
        }



    }catch(error){
        console.log(error);
    }
}


const getUser_id = async (Data)=>{
    try{
        const [user_id] = await connection.promise().query(`SELECT user_id FROM users WHERE email = ?`, [Data.email]);
        if(user_id.length>0){
            const userId = user_id[0].user_id;
            return userId;
        }
        
    }catch(error){
        console.log(error);
    }
}
const check_user_role  = async (email)=>{
    try{
        const [userRole]  = await connection.promise().query(`SELECT role FROM users WHERE email =?`, [email]);
        if(userRole.length >0){
            return userRole[0].role;
        }

    }catch(error){
        next(error);
    }
}


module.exports = {
    userExists,
    insertUserData,
    getUserIdByEmail,
    getUserPassByEmail,
    getUserPassword,
    getUser_id,
    check_user_role
};
