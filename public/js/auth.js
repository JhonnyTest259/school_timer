const myForm = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "http://192.168.0.6:8080";

localStorage.clear();
myForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {};
  for (let el of myForm.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch(`${url}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(async ({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);

      const resp = await fetch(`${url}/api/auth`, {
        headers: {
          "x-token": token,
        },
      });
      const { user: userDB, token: tokenDB } = await resp.json();
      console.log(userDB);
      if (userDB.rol === "ADMIN_ROLE") {
        window.location = "admin.html";
      } else {
        window.location = "console.html";
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
