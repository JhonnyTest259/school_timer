const { model, Schema } = require("mongoose");

const rolSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

module.exports = model("Role", rolSchema);
