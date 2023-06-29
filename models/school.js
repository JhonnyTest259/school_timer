const { model, Schema } = require("mongoose");

const schoolSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  timer: {
    type: Number,
    default: 60,
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  // hour: {
  //   type: String,
  //   validate: {
  //     validator: function (value) {
  //       return /^([1-9]|1[0-2]):([0-5][0-9])\s(am|pm)$/i.test(value);
  //     },
  //     message: "El formato de hora debe ser 'hh:mm am/pm'",
  //   },
  //   required: true,
  // },
});

//Me sirve para sobreescribir la funcion JSON para el retorno de la respuesta
schoolSchema.methods.toJSON = function () {
  const { __v, state, ...school } = this.toObject();
  return school;
};

module.exports = model("School", schoolSchema);
