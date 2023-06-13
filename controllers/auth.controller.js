const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");
const { generarJWT } = require("../helpers/generar-JWT");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar si el email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }
    //Si el usuario esta activo
    if (!user.state) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
