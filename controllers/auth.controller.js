const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //check if exist email
    const user = await User.findOne({ email }).populate("school", [
      "name",
      "timer",
    ]);
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

    //password verify
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //JWT
    const token = await generateJWT(user.id);

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
const renovarToken = async (req, res) => {
  const { user } = req;
  //JWT
  const token = await generateJWT(user.id);
  const us = await User.findOne({ email: user.email }).populate("school");
  res.json({ user: us, token });
};

module.exports = {
  login,
  renovarToken,
};
