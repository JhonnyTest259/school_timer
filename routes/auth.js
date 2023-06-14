const { Router } = require("express");
const { check } = require("express-validator");

const { login, renovarToken } = require("../controllers/auth.controller");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = new Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

router.get("/", validateJWT, renovarToken);

module.exports = router;
