const express = require("express");
const Router  = express.Router();
const { userRegister, userLoginController } = require("../controllers/userController");

Router.post("/register", userRegister);
Router.post("/login", userLoginController);

module.exports = {
    Router
};
