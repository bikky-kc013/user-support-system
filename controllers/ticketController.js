const customError = require("../middlewares/customError");
const { getUser_id, getUser_role } = require("../helpers/jwtTokens");
const { 
  createTicketModel,
  insertImageModel,
  insertMessageModel,
  getTicketId, 
  getMessageId,
  getImageId,
  getTicketModel,
  messageInsert,
  userTicketDeletion,
  showTicketsToUser,
  adminTicketDeletion, 
  ticketResolvedModel,
  get_user_id_byTicket
  } = require("../models/ticketModels");


const createTicket  = async (req,res,next)=>{
    try{
      const { subject, content } = req.body;
      const headersData  = await req.headers;
      const token = (headersData.authorization).slice(7);
      const user_id  = await getUser_id(token); 
      if(typeof(subject) != 'string') throw new customError("The subject should be string");
      if(subject.length > 1000) throw new customError("The subject cannot exceed 1000 characters.");
      if(subject.length < 10 ) throw new customError("Subject should be minimum of 10 10 characters long");
      if(typeof(content) != 'string') throw new customError("Message must be in the readable format");
      if(content.length > 10000) throw new customError("Message is too long");
      if(content.length < 10) throw new customError("Message is too short");
      const images = req.files;
      const ticketImages = images.map((image) => image.filename).join(',')
      const ticketCreation  = await createTicketModel(user_id, subject);
      const ticketId = await getTicketId(user_id);
      const messageInsert  = await  insertMessageModel(ticketId, content);
      const messageId = await getMessageId(ticketId);
      const imageInsert  = await insertImageModel(messageId,ticketId, ticketImages);
      const imageId = await getImageId(messageId);
      res.json({
        message:"Successfully created the ticket",
        ticket_id:ticketId
      });
    }catch(error){
      next(error);
    }
  };


const getTickets  = async (req,res,next)=>{
  try{
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_id  = await getUser_id(token); 
    const tickets = await getTicketModel(user_id);
    res.json({
      tickets
    })

  }catch(error){
    next(error);
  }
}


const createMessage = async (req,res,next)=>{
  try{
    const  { content }   =  req.body;
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_id  = await getUser_id(token); 
    const ticketId = await getTicketId(user_id);
    if(!content) throw new customError("Message cannot be blank");
    const images = req.files;
    const messageImages   = images.map((images) =>images.filename).join(',');
    const insertMessage  = await messageInsert(content, ticketId);
    const insertImage = await insertImageModel(insertMessage,ticketId,messageImages);
    if(insertImage!='true') throw new customError("cannot add the message");
    res.json({
      message:"Successfully added the new message",
      status:"Success"
    });
  }catch(error){
    next(error)
  }
}

const deleteTicketByUser  = async (req,res,next)=>{
  try{
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_id  = await getUser_id(token); 
    const ticketId = await req.body;
    const userDeletion  = await userTicketDeletion(user_id, ticketId);
    res.json({
      message:userDeletion,
      status:"True"
    });
  }catch(error){
    next(error);
  }
}

const showTicketsToUserController  = async (req,res,next)=>{
  try{
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_id  = await getUser_id(token);
    const showTickets = await showTicketsToUser(user_id);
    if(!showTickets) throw new customError("There is no  any active tickets");
    res.json({
      activeTickets:showTickets
    });

  }catch(error){
    next(error);
  }
}


const deleteTicketByadmin  = async (req,res,next)=>{
  try
  {
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_role = await getUser_role(token);
    if(user_role != 'admin') throw new customError("Sorry only the admins can access this route");
    const { ticket_id }  = req.body;
    const user_id = await get_user_id_byTicket(ticket_id);
    const deleteTicket = await adminTicketDeletion(ticket_id, user_id);
    console.log(deleteTicket);
    res.json(deleteTicket);

  }catch(error){
    next(error);
  }
}


const ticketResolved  = async (req,res,next)=>{
  try{
    const headersData  = await req.headers;
    const token = (headersData.authorization).slice(7);
    const user_role = await getUser_role(token);
    if(user_role != 'admin') throw new customError("Sorry only the admins can access this route");
    const { ticket_id } = req.body;
    if(!ticket_id) throw new customError("Please provide the ticked_id which was resolved)");
    const resolved = await ticketResolvedModel(ticket_id);
    res.json({
      message:"Successfully resolved the ticket",
      ticket_id:ticket_id,
      status:"success"
    })

    
  }catch(error){
    next(error);
  }
}

  module.exports = {
    createTicket, getTickets, createMessage, deleteTicketByUser, showTicketsToUserController, deleteTicketByadmin, ticketResolved
  };
  