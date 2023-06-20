const { response } = require("express");
const { Rol } = require("../models");

const getRoles = async (req, res = response) => {
  const roles = await Rol.find();
  res.json(roles);
};

module.exports = {
  getRoles,
};
