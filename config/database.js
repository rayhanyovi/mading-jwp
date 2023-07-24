import { Sequelize } from "sequelize";

const db = new Sequelize("jwp_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
