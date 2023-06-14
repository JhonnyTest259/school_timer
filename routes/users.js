const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-roles");
const {
  createUser,
  deleteUser,
  getUserByID,
  getUser,
  updateUser,
  updateTimerOfSchool,
} = require("../controllers/user.controller");
const {
  thereIsAEmail,
  isValidRole,
  thereIsASchool,
  thereIsUserById,
} = require("../helpers/db-validators");
const router = new Router();

router.get("/", getUser);
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo").isMongoId(),
    check("id").custom(thereIsUserById),
    validateFields,
  ],
  getUserByID
);
router.post(
  "/",
  [
    validateJWT,
    isAdminRole,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe contener mas de 6 letras").isLength({
      min: 6,
    }),
    check("school", "El colegio no es valido").isMongoId(),
    check("school").custom(thereIsASchool),
    check("email", "El email no es válido").isEmail(),
    check("email").custom(thereIsAEmail),
    check("rol").custom(isValidRole),
    validateFields,
  ],
  createUser
);
router.put(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsUserById),
    check("rol").custom(isValidRole),
    validateFields,
  ],
  updateUser
);
// Ruta para actualizar el temporizador de la escuela de un usuario
router.put(
  "/school/timer/:id",
  [
    validateJWT,
    check("id", "Debe ser un id válido").isMongoId(),
    check("timer", "El valor no puede ser vacio").not().isEmpty(),
    validateFields,
  ],
  updateTimerOfSchool
);
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsUserById),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
