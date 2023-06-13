const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { thereIsASchool } = require("../helpers/db-validators");
const {
  getSchool,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} = require("../controllers/school.controller");

const router = new Router();

router.get("/", getSchool);
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo").isMongoId(),
    check("id").custom(thereIsASchool),
    validarCampos,
  ],
  getSchoolById
);
router.post(
  "/",
  [
    // validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createSchool
);
router.put(
  "/:id",
  [
    // validarJWT,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsASchool),
    validarCampos,
  ],
  updateSchool
);
router.delete(
  "/:id",
  [
    // validarJWT,
    // esAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsASchool),
    validarCampos,
  ],
  deleteSchool
);

module.exports = router;
