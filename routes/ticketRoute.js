const { storage } = require("../config/multerConfig");
const multer = require("multer");
const upload = multer({ storage });
const express = require("express");
const ticketRouter  = express.Router();
const { createTicket, getTickets, createMessage, deleteTicketByUser, showTicketsToUserController, deleteTicketByadmin, ticketResolved } = require("../controllers/ticketController");
const { tokenValidate } = require("../helpers/jwtTokens");


ticketRouter.post("/createticket", tokenValidate, upload.array("images"), createTicket);
ticketRouter.get("/getalltickets",tokenValidate, getTickets);
ticketRouter.post("/createmessage/:ticketId",tokenValidate, upload.array("images"), createMessage);
ticketRouter.post("/deleteticketbyuser",tokenValidate, deleteTicketByUser);
ticketRouter.get("/showticketstouser", tokenValidate, showTicketsToUserController);
ticketRouter.delete("/deletetickets",tokenValidate,  deleteTicketByadmin);
ticketRouter.put("/resolveticket", tokenValidate, ticketResolved);

module.exports = {
    ticketRouter
};
