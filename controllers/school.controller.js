const { response } = require("express");
const { School } = require("../models");

const getSchool = async (req, res = response) => {
  const query = { state: true };
  const school = await School.find(query);
  res.json(school);
};
const getSchoolById = async (req, res = response) => {
  const { id } = req.params;
  const school = await School.findById(id);
  res.json(school);
};
const createSchool = async (req, res = response) => {
  const { timer, state, ...body } = req.body;
  const name = body.name.toUpperCase();
  const schoolDB = await School.findOne({ name });
  if (schoolDB) {
    return res.status(400).json({ msg: `El Colegio ${name} ya existe` });
  }

  const schoolSave = new School({ name });

  //Guardar DB
  await schoolSave.save();

  res.status(201).json(schoolSave);
};
const updateSchool = async (req, res = response) => {
  const { id } = req.params;
  const { state, ...body } = req.body;

  body.name = body.name.toUpperCase();

  const school = await School.findByIdAndUpdate(id, body, {
    new: true,
  });

  res.json(school);
};
const deleteSchool = async (req, res = response) => {
  const { id } = req.params;
  const school = await School.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  );
  res.json(school);
};

module.exports = {
  createSchool,
  deleteSchool,
  getSchool,
  getSchoolById,
  updateSchool,
};
