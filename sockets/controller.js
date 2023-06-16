const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers/generate-jwt");
const { RingControl } = require("../models");

const ringControl = new RingControl();
const socketController = async (socket = new Socket(), io) => {
  const token = socket.handshake.headers["x-token"];
  const user = await checkJWT(token);

  socket.on("autenticarse", ({ uid }) => {
    ringControl.setValueToModule(uid);
    console.log("modulo conectado", ringControl.module);
    socket.join(ringControl.module);
  });
  // if (!user) {
  //   return socket.disconnect();
  // }

  socket.on("timbre-sonando", ({ state }) => {
    ringControl.updateIsRingingState(state);
    io.to(user.id).emit("esta-sonando", ringControl.isRingingState);
  });

  socket.on("notificar-actualizacion", ({ state }) => {
    ringControl.update(state);
    io.to(user.id).emit("notificacion-actualizacion", ringControl.isUpdatedNow);
    setTimeout(() => {
      ringControl.update({ state: false });
    }, 1000);
  });
};

module.exports = { socketController };
