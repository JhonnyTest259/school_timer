const { model, Schema } = require("mongoose");

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  rol: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  state: {
    type: Boolean,
    default: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: [true, "El colegio es obligatoria"],
  },
});

// Me sirve para sobreescribir la funcion JSON para el retorno de la respuesta
userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("User", userSchema);
