const myForm = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://schooltimer-production.up.railway.app";

myForm.addEventListener("submit", (event) => {
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
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "console.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

// button.addEventListener("click", () => {
//   console.log(google.accounts.id);
//   google.accounts.id.disableAutoSelect();
//   google.accounts.id.revoke(localStorage.getItem("correo"), (done) => {
//     localStorage.clear();
//     location.reload();
//   });
// });
