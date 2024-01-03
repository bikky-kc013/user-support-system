const express = require("express");
const app = express();
app.use(express.json());
const morgan  = require("morgan");
app.use(morgan('dev'));
const dotenv = require("dotenv");
dotenv.config();
const { CreateConnection } = require("./config/connection");
CreateConnection();
const { notFound,errorHandler } = require("./middlewares/errorhandler");
const { Router } = require("./routes/userRoutes");
const { ticketRouter } = require("./routes/ticketRoute");





app.use(Router);
app.use(ticketRouter);
app.use(notFound);
app.use(errorHandler);
const PORT  = process.env.PORT || 3000


app.listen(PORT, "127.0.0.1",
()=>{
    console.log(`Connected to the server on PORT ${PORT}`);
})
