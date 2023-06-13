const Role = require("../models/rol");
const { Categoria, User, School } = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`${rol} no es un rol válido - no existe`);
  }
};

const emailExiste = async (email = "") => {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw new Error(`El correo ${email} ya esta registrado`);
  }
};
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};
// const existeCategoria = async (id) => {
//   const existeCategoria = await Categoria.findById(id);
//   if (!existeCategoria) {
//     throw new Error(`La categoria no existe ${id}`);
//   }
// };
const thereIsASchool = async (id) => {
  const thereIsAschool = await School.findById(id);
  if (!thereIsAschool) {
    throw new Error(`El colegio no existe ${id}`);
  }
};
// const estaBorradaCategoria = async (id) => {
//   const existeCategoria = await Categoria.findById(id);
//   if (!existeCategoria.estado) {
//     throw new Error(`La categoria esta borrada`);
//   }
// };

// const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
//   const incluida = colecciones.includes(coleccion);
//   if (!incluida) {
//     throw new Error(
//       `El nombre de la coleccion ${coleccion} no es permitida - ${colecciones}`
//     );
//   }

//   return true;
// };

module.exports = {
  thereIsASchool,
  emailExiste,
  esRoleValido,
  //   estaBorradaCategoria,
  //   existeCategoria,
  existeUsuarioPorId,
  //   coleccionesPermitidas,
};
