const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { User, School } = require("../models");

const getUser = async (req, res = response) => {
  const query = { state: true };
  const user = await User.find(query).populate("school", ["name", "timer"]);
  res.json(user);
};
const getUserByID = async (req, res = response) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("school", ["name", "timer"]);
  res.json(user);
};
const createUser = async (req, res = response) => {
  const { state, password, ...body } = req.body;

  const userSave = new User({ password, ...body });
  const salt = bcryptjs.genSaltSync();
  userSave.password = bcryptjs.hashSync(password, salt);

  //Guardar DB
  await userSave.save();

  res.status(201).json(userSave);
};
const updateUser = async (req, res = response) => {
  const { id } = req.params;
  const { _id, email, password, ...body } = req.body;

  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    body.password = bcryptjs.hashSync(password, salt);
  }
  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
  });

  res.json(user);
};
const updateTimerOfSchool = async (req, res) => {
  const id = req.params.id;
  const timer = req.body.timer;

  try {
    // Buscar y actualizar el usuario por ID
    const user = await User.findById(id);
    const school = await School.findByIdAndUpdate(
      user.school,
      { timer },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user, school });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};
const deleteUser = async (req, res = response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  );
  res.json(user);
};

module.exports = {
  createUser,
  deleteUser,
  getUserByID,
  getUser,
  updateUser,
  updateTimerOfSchool,
};
