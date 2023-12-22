const { connection } = require("../config/connection");
const fs = require("fs");

const createTicketModel = async (user_id, subject) => {
  try {
    const [insertedRow] = await connection
      .promise()
      .query(`INSERT INTO tickets (user_id, subject) VALUES (?,?)`, [
        user_id,
        subject,
      ]);
    if (insertedRow.affectedRows == 1) {
      return "true";
    }
  } catch (error) {
    console.log(error);
  }
};

const insertImageModel = async (message_id, ticket_id, images) => {
  try {
    const [imageRow] = await connection
      .promise()
      .query(
        `INSERT INTO image(message_id, ticket_id, imageURL) VALUES(?,?,?)`,
        [message_id, ticket_id, images]
      );
    if (imageRow.affectedRows == 1) {
      return "true";
    }
  } catch (error) {
    console.log(error);
  }
};

const insertMessageModel = async (ticket_id, content) => {
  try {
    const [messageRow] = await connection
      .promise()
      .query(`INSERT INTO message(ticket_id, Content) VALUES(?,?)`, [
        ticket_id,
        content,
      ]);
    if (messageRow.affectedRows == 1) {
      return "true";
    }
  } catch (error) {
    console.log(error);
  }
};

const getTicketId = async (user_id) => {
  try {
    const [ticketRow] = await connection
      .promise()
      .query(`SELECT ticket_id FROM tickets WHERE user_id = ?`, [user_id]);
    if (ticketRow.length > 0) {
      return ticketRow[0].ticket_id;
    }
  } catch (error) {
    console.log(error);
  }
};

const getImageId = async (message_id) => {
  try {
    const [imageRow] = await connection
      .promise()
      .query(`SELECT image_id FROM image WHERE message_id = ?`, [message_id]);
    if (imageRow.length > 0) {
      return imageRow[0].image_id;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMessageId = async (ticket_id) => {
  try {
    const [messageRow] = await connection
      .promise()
      .query(`SELECT message_id FROM message WHERE ticket_id = ?`, [ticket_id]);
    if (messageRow.length > 0) {
      return messageRow[0].message_id;
    }
  } catch (error) {
    console.log(error);
  }
};

const getTicketModel = async (user_id) => {
  try {
    const [ticketsRow] = await connection.promise().query(
      `
    SELECT 
    tickets.ticket_id,
    tickets.subject,
    tickets.status,
    tickets.is_deleted,
    tickets.created_at,
    message.content,
    image.imageURL
    FROM tickets
    JOIN message ON tickets.ticket_id = message.ticket_id
    JOIN image ON message.message_id = image.message_id
    WHERE user_id = ?

    `,
      [user_id]
    );
    return ticketsRow;
  } catch (error) {
    console.log(error);
  }
};

const messageInsert = async (content, ticket_id) => {
  try {
    const [messageRow] = await connection
      .promise()
      .query(`INSERT INTO message(content, ticket_id) VALUES (?, ?)`, [
        content,
        ticket_id,
      ]);

    if (messageRow.affectedRows === 1) {
      const [lastInsertIdRow] = await connection
        .promise()
        .query("SELECT LAST_INSERT_ID() as message_id");
      const messageId = lastInsertIdRow[0].message_id;
      return messageId;
    }
  } catch (error) {
    console.log(error);
  }
};

const userTicketDeletion = async (user_id, ticket_id) => {
  try {
    const [updatedRow] = await connection.promise().query(
      `
      UPDATE tickets 
      SET is_deleted = true 
      WHERE ticket_id = ? AND user_id = ?;
    `,
      [ticket_id, user_id]
    );

    if (updatedRow.affectedRows > 0) {
      return `Ticket with ticket_id ${ticket_id} deleted `;
    } else {
      console.log(
        `No ticket found with ticket_id ${ticket_id} for user ${user_id}.`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const adminTicketDeletion = async (ticket_id, user_id) => {
  try {
    await connection.promise().beginTransaction();

    const [imageStringResult] = await connection
      .promise()
      .query(`SELECT imageURL FROM image WHERE ticket_id = ?`, [ticket_id]);
    if (imageStringResult.length === 0) {
      return {
        success: false,
        message: `No ticket found with ticket_id ${ticket_id} for user ${user_id}.`,
      };
    }

    const dbImage = imageStringResult;
    console.log(dbImage);
    dbImage.forEach((images) => {
      const imagePaths = images.imageURL.split(",");
      imagePaths.forEach(async (imagePath) => {
        try {
          const trimmedPath = imagePath.trim();
          console.log(trimmedPath);
          await fs.promises.unlink(`./public/uploads/images/${trimmedPath}`);
        } catch (deleteError) {
          console.error(`Error deleting image: ${deleteError}`);
        }
      });
    });

    await connection
      .promise()
      .query(`DELETE FROM image WHERE ticket_id = ?`, [ticket_id]);
    await connection
      .promise()
      .query(`DELETE FROM message WHERE ticket_id = ?`, [ticket_id]);

    const [deletedRow] = await connection.promise().query(
      `
      DELETE FROM tickets
      WHERE ticket_id = ? AND user_id = ?;
    `,
      [ticket_id, user_id]
    );

    await connection.promise().commit();

    if (deletedRow.affectedRows > 0) {
      return {
        success: true,
        message: `Ticket with ticket_id ${ticket_id} deleted successfully`,
      };
    } else {
      return {
        success: false,
        message: `No ticket found with ticket_id ${ticket_id} for user ${user_id}.`,
      };
    }
  } catch (error) {
    await connection.promise().rollback();
    console.error(`Error deleting ticket: ${error}`);
    return {
      success: false,
      message: "An error occurred while deleting the ticket.",
    };
  }
};

const showTicketsToUser = async (user_id) => {
  try {
    const [ticketRow] = await connection
      .promise()
      .query(
        `SELECT tickets.ticket_id, tickets.subject FROM tickets WHERE user_id = ? AND is_deleted = 1`,
        [user_id]
      );
    return ticketRow;
  } catch (error) {
    console.log(error);
  }
};

const ticketResolvedModel = async (ticket_id) => {
  try {
    const [ticketRow] = await connection
      .promise()
      .query(`UPDATE tickets SET status = 'closed' WHERE ticket_id = ?`, [
        ticket_id,
      ]);
    if (ticketRow.affectedRows === 1) {
      return "ture";
    }
  } catch (error) {
    console.log(error);
  }
};
const get_user_id_byTicket  = async (ticket_id)=>{
  try{
    const [ userIdRow ] = await connection.promise().query(`SELECT user_id FROM tickets WHERE ticket_id = ?`, [ticket_id]);
    if(userIdRow.length >0){
      return userIdRow[0].user_id;
    }

  }catch(error){
    console.log(error);
  }
}

module.exports = {
  createTicketModel,
  insertImageModel,
  insertMessageModel,
  getTicketId,
  getMessageId,
  getImageId,
  getTicketModel,
  messageInsert,
  userTicketDeletion,
  adminTicketDeletion,
  showTicketsToUser,
  ticketResolvedModel,
  get_user_id_byTicket
};
