const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      school: "/api/school",
      users: "/api/users",
    };

    //db connection
    this.connectDB();
    //middlewares
    this.middlewares();
    //routes
    this.routers();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //cors
    this.app.use(cors());

    //Parseo y lectura del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }
  routers() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.school, require("../routes/school"));
    this.app.use(this.paths.users, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor iniciado en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
