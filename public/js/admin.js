const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "http://192.168.0.9:8080";

let usuario = null;
let usuarios = null;
let token = "";
let inputsForm = [
  {
    value: "name",
    type: "text",
    label: "Nombre",
  },
  {
    value: "email",
    type: "email",
    label: "Correo",
  },
  {
    value: "password",
    type: "password",
    label: "Constraseña",
  },
  {
    value: "rol",
    type: "select",
    label: "Rol",
    options: [],
  },
  {
    value: "state",
    type: "select",
    label: "Estado",
    options: [
      { id: true, value: true },
      { id: false, value: false },
    ],
  },
  {
    value: "school",
    type: "select",
    label: "Colegio",
    options: [],
  },
];
let formHtml = "";
//Referencias HTML
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const modalFooter = document.querySelector(".modal-footer");
const info = document.querySelector(".info");
const userInfo = document.querySelector("#userInfo");
const btnSalir = document.querySelector("#btnSalir");
const updateUser = document.querySelector("#updateUser");
const deleteUser = document.querySelector("#deleteUser");
const createUser = document.querySelector("#createUser");
const createSchool = document.querySelector("#createSchool");

const generateForm = () => {
  let formulario = document.createElement("form");
  inputsForm.forEach((input) => {
    let lblText = document.createElement("label");
    lblText.innerText = input.label;
    if (input.type === "select") {
      formHtml = document.createElement("select");
      formHtml.setAttribute("class", "form-select mb-2");
      formHtml.setAttribute("name", input.value);
      input.options.forEach((option) => {
        let options = document.createElement("option");
        options.setAttribute("value", option.id);
        options.innerText = option.value;
        formHtml.appendChild(options);
      });
    } else {
      formHtml = document.createElement("input");
      formHtml.setAttribute("class", "form-control mb-2");
      formHtml.setAttribute("type", input.type);
      formHtml.setAttribute("name", input.value);
      formHtml.setAttribute("placeholder", input.label);
    }
    formulario.appendChild(lblText);
    formulario.appendChild(formHtml);
  });

  return formulario;
};
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

  document.title = `Admin - ${usuario.name}`;
  // console.log(usuario);
  loadUserData();
};
const getDataFromDB = async () => {
  Promise.all([getUsers(), getSchools(), getRoles()]);
};

const getRoles = async () => {
  const resp = await fetch(`${url}/api/roles`, { method: "GET" });
  let roles = await resp.json();
  inputsForm.forEach((input) => {
    if (input.type === "select" && input.value === "rol") {
      roles.forEach((rol) => {
        input.options.push({
          id: rol.rol,
          value: rol.rol,
        });
      });
    }
  });
};
const getSchools = async () => {
  const resp = await fetch(`${url}/api/school`, { method: "GET" });
  let schools = await resp.json();
  inputsForm.forEach((input) => {
    if (input.type === "select" && input.value === "school") {
      schools.forEach((school) => {
        input.options.push({
          id: school._id,
          value: school.name,
        });
      });
    }
  });
};

const createUserTable = (usuarios) => {
  let htmlInfo = "";
  usuarios.forEach((element, index) => {
    htmlInfo += `
        <tr>
          <td>${index + 1}</td>
          <td>${element.name}</td>
          <td>${element.email}</td>
          <td>${element.school?.name}</td>
          <td>${element.state ? "Activo" : "Inactivo"}</td>
          <td>
              <div class="d-flex justify-content-evenly">
                  <i 
                      id="updateUser" 
                      onclick="updateById(event)" 
                      class="fa-solid fa-pen-to-square" 
                      data-bs-toggle="modal"  
                      data-bs-target="#exampleModal"
                      data-user="${element.uid}"
                  ></i>
                  <i 
                      id="deleteUser"
                      onclick="deleteById(event)"  
                      class="${
                        element.state
                          ? "fa-solid fa-trash"
                          : "fa-solid fa-trash d-none"
                      }"
                      data-bs-toggle="modal"  
                      data-bs-target="#exampleModal"
                      data-user="${element.uid}"
                  ></i>
              </div>
          </td>
        </tr>
      `;
  });
  userInfo.innerHTML = htmlInfo;
};
const getUsers = async () => {
  const resp = await fetch(`${url}/api/users?rol=USER_ROLE`, { method: "GET" });
  usuarios = await resp.json();
  if (usuarios.length == 0) {
    userInfo.innerHTML = "No hay usuarios";
    return;
  }

  createUserTable(usuarios);
};

const loadUserData = () => {
  let usersHtml = `
    <p>
    <h5> Bienvenido <span class="text-success">${usuario.email}</span></h5>
    <span class="fs-6 text-muted">${usuario.uid}</span>
    </p>
    `;
  info.innerHTML = usersHtml;
};
const getUserById = async (id) => {
  console.log(id);
  const resp = await fetch(`${url}/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await resp.json();
};
const updateById = async (event) => {
  let element = event.target;
  let userId = element.getAttribute("data-user");
  let userInfo = await getUserById(userId);
  const myForm = generateForm();

  myForm.elements.name.value = userInfo.name;
  myForm.elements.email.value = userInfo.email;
  myForm.elements.password.value = "";
  myForm.elements.rol.value = userInfo.rol;
  myForm.elements.state.value = userInfo.state.toString();
  myForm.elements.school.value = userInfo.school._id;

  const updateButton = generateButton({ buttonClass: "btn-primary" });
  createModalInfo("Actualizar Usuario", myForm, updateButton);
  updateButton.addEventListener("click", () => {
    myForm.dispatchEvent(new Event("submit"));
  });
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {};
    for (let el of myForm.elements) {
      if (el.name.length > 0) {
        formData[el.name] = el.value;
      }
    }
    console.log(formData);
    fetch(`${url}/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data?.errors && data?.errors.length > 0) {
          return console.error(data.errors);
        }
        await getUsers();
      });
  });
};
const deleteById = (event) => {
  let element = event.target;
  let userId = element.getAttribute("data-user");
  let label = document.createElement("p");
  label.innerText = "Esta seguro de eliminar a este usuario?";

  deleteButton = generateButton({ text: "Aceptar" });

  createModalInfo("Inactivar Usuario", label, deleteButton);

  //   modalFooter.insertAdjacentHTML("afterbegin", deleteButton);
  deleteButton.addEventListener("click", async () => {
    const resp = await fetch(`${url}/api/users/${userId}`, {
      headers: {
        "x-token": token,
      },
      method: "DELETE",
    });
    const { msg } = await resp.json();
    if (!msg) {
      await getUsers();
    }
  });
};

createSchool.addEventListener("click", () => {
  const myForm = document.createElement("form");
  let inputSchool = document.createElement("input");
  inputSchool.setAttribute("type", "text");
  inputSchool.setAttribute("placeholder", "Colegio");
  inputSchool.setAttribute("name", "name");
  inputSchool.className = "form-control mb-2 delete-form";
  myForm.appendChild(inputSchool);

  const createButton = generateButton({ buttonClass: "btn-primary" });
  createModalInfo("Agregar Colegio", myForm, createButton);

  createButton.addEventListener("click", () => {
    myForm.dispatchEvent(new Event("submit"));
  });
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {};
    for (let el of myForm.elements) {
      if (el.name.length > 0) {
        formData[el.name] = el.value;
      }
    }
    console.log(formData);
    fetch(`${url}/api/school`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data?.errors && data?.errors.length > 0) {
          return console.error(data.errors);
        }
        console.log("creado");
      });
  });
});
createUser.addEventListener("click", () => {
  const myForm = generateForm();

  const createButton = generateButton({
    buttonClass: "btn-primary",
    type: "submit",
  });
  createModalInfo("Agregar Usuario", myForm, createButton);

  createButton.addEventListener("click", () => {
    myForm.dispatchEvent(new Event("submit"));
  });
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {};
    for (let el of myForm.elements) {
      if (el.name.length > 0) {
        formData[el.name] = el.value;
      }
    }

    fetch(`${url}/api/users`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data?.errors && data?.errors.length > 0) {
          return console.error(data.errors);
        }
        await getUsers();
      });
  });
});

const createModalInfo = (modalTitleInfo, modalBodyInfo, buttonToAdd) => {
  modalBody.innerHTML = "";
  modalTitle.innerText = modalTitleInfo;

  deleteAndAddHtmlElements(modalBody, "delete-form", modalBodyInfo);
  deleteAndAddHtmlElements(modalFooter, "delete-button", buttonToAdd);
};

const deleteAndAddHtmlElements = (modal, className, element) => {
  let deleteHtlmElement = modal.getElementsByClassName(className);
  while (deleteHtlmElement.length > 0) {
    deleteHtlmElement[0].parentNode.removeChild(deleteHtlmElement[0]);
  }
  modal.insertBefore(element, modal.firstChild);
};

btnSalir.addEventListener("click", () => {
  localStorage.clear();
  window.location = "index.html";
});

const generateButton = ({
  text = "Guardar",
  buttonClass = "btn-danger",
  type = "button",
}) => {
  let button = document.createElement("button");
  button.setAttribute("type", type);
  button.setAttribute("class", `btn ${buttonClass} delete-button`);
  button.setAttribute("data-bs-dismiss", "modal");
  button.textContent = text;
  return button;
};

const main = async () => {
  await Promise.all([validarJWT(), getDataFromDB()]);
};

main();
