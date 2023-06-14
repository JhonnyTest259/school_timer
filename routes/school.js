const { Router } = require("express");
const { check } = require("express-validator");
const { thereIsASchool } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const { isAdminRole } = require("../middlewares/validate-roles");
const { validateJWT } = require("../middlewares/validate-jwt");

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
    validateFields,
  ],
  getSchoolById
);
router.post(
  "/",
  [
    // validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createSchool
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsASchool),
    validateFields,
  ],
  updateSchool
);
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Debe ser un id válido").isMongoId(),
    check("id").custom(thereIsASchool),
    validateFields,
  ],
  deleteSchool
);

module.exports = router;
