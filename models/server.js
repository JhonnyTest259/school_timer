const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);

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

    //sockets
    this.sockets();
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

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Servidor iniciado en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
