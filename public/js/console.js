const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://schooltimer-production.up.railway.app";

let usuario = null;
let token = "";
let socket = null;
//Referencias HTML
const numTimer = document.querySelector("#numTimer");
const info = document.querySelector(".info");
const spnTimer = document.querySelector("#timer");
const btnActualizar = document.querySelector("#btnActualizar");
const btnTimbrar = document.querySelector("#btnTimbrar");
const btnSalir = document.querySelector("#btnSalir");
const content = document.querySelector(".content");

const validarJWT = async () => {
  token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en la aplicacion");
  }

  const resp = await fetch(`${url}/api/auth`, {
    headers: {
      "x-token": token,
    },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;

  document.title = usuario.name;
  console.log(usuario);
  loadUserData();
};

const conectarSocket = async () => {
  socket = io({
    transportOptions: {
      polling: {
        extraHeaders: {
          "x-token": localStorage.getItem("token"),
        },
      },
    },
  });
  socket.on("connect", () => {
    console.log("Conectado");
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });

  socket.on("state", (payload) => {
    console.log({ state: payload });
  });
  socket.on("notificacion-actualizacion", prueba);

  btnTimbrar.addEventListener("touchstart", () => {
    socket.emit("timbre-sonando", { state: true });
  });
  btnTimbrar.addEventListener("touchend", () => {
    socket.emit("timbre-sonando", { state: false });
  });
  btnActualizar.addEventListener("click", async () => {
    if (numTimer.value <= 0) {
      console.log("no se admiten valores negativos");
      numTimer.value = null;
      return;
    }

    const body = { timer: numTimer.value };
    await fetch(`${url}/api/users/school/timer/${usuario.uid}`, {
      headers: {
        "x-token": token,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    });
    numTimer.value = null;
    socket.emit("notificar-actualizacion", { state: true });
    validarJWT();
  });
};

const prueba = (payload) => {
  console.log(payload);
  content.innerHTML = `
    <p>Se actualizo ${payload.state}</p>
  `;
};

const loadUserData = () => {
  let usersHtml = `
    <p>
    <h5> Bienvenido <span class="text-success">${usuario.email}</span></h5>
    <span class="fs-6 text-muted">${usuario.uid}</span>
    </p>
    `;
  spnTimer.innerText = usuario.school.timer;
  info.innerHTML = usersHtml;
};

btnSalir.addEventListener("click", () => {
  localStorage.clear();
  window.location = "index.html";
});

const main = async () => {
  await validarJWT();
  await conectarSocket();
};

main();
