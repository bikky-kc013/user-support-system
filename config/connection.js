const mysql = require("mysql2");

const connection = mysql.createConnection({
  password: "",
  user: "root",
  database: "uss",
});

const CreateConnection = async () => {
  try {
    await connection.promise().query(`USE uss`);
    console.log("Connected to the database");
    await createTable();
  } catch (error) {
    console.log(`Error connecting to the database:`, error);
  }
};

const createTable = async () => {
  try {
    await connection.promise().query(`
        CREATE TABLE IF NOT EXISTS users (
        user_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
      `);

    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS tickets (
      ticket_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
      user_id CHAR(36),
      subject VARCHAR(255),
      status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
       `);

    await connection.promise().query(`
        CREATE TABLE IF NOT EXISTS message (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id CHAR(36),   
        Content TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
    );
       `);

    await connection.promise().query(`
        CREATE TABLE IF NOT EXISTS image (
        image_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
        message_id INT,
        ticket_id CHAR(36),  
        imageURL TEXT,
        FOREIGN KEY (message_id) REFERENCES message(message_id),
        FOREIGN key (ticket_id) REFERENCES tickets(ticket_id)
    );
       `);
  } catch (error) {
    console.log(`Error creating tables:`, error);
  }
};

module.exports = {
  connection,
  CreateConnection,
};
