const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  createUser,
  deleteUser,
  getUserByID,
  getUser,
  updateUser,
  updateTimerOfSchool,
} = require("../controllers/users.controller");
const {
  emailExiste,
  esRoleValido,
  thereIsASchool,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");
const router = new Router();

router.get("/", getUser);
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  getUserByID
);
router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe contener mas de 6 letras").isLength({
      min: 6,
    }),
    check("school", "El colegio no es valido").isMongoId(),
    check("school").custom(thereIsASchool),
    check("email", "El email no es válido").isEmail(),
    check("email").custom(emailExiste),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  createUser
);
router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  updateUser
);
// Ruta para actualizar el temporizador de la escuela de un usuario
router.put(
  "/school/timer/:id",
  [validarJWT, check("id", "Debe ser un id válido").isMongoId(), validarCampos],
  updateTimerOfSchool
);
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  deleteUser
);

module.exports = router;
