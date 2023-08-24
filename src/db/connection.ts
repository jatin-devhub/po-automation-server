import { Sequelize } from "sequelize-typescript";

const connection = new Sequelize({
  dialect: "mysql",
  host: 'localhost',
  username: 'poadmin',
  password: 'po1234',
  database: 'po_automation',
  port: 3306,
  models: []
});

// connection.truncate({ cascade: true, restartIdentity: true });

export default connection;