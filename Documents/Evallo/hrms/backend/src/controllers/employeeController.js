const { Employee, Team, Log } = require('../db');

const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{ model: Team, attributes: ['id', 'name'], through: { attributes: [] } }]
    });
    res.json(employees);
  } catch (err) { next(err); }
};

const getEmployee = async (req, res, next) => {
  try {
    const e = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
      include: [{ model: Team, attributes: ['id', 'name'], through: { attributes: [] } }]
    });
    if (!e) return res.status(404).json({ message: 'Not found' });
    res.json(e);
  } catch (err) { next(err); }
};

const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const employee = await Employee.create({ first_name, last_name, email, phone, organisation_id: req.user.orgId });
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'employee_created', meta: { employeeId: employee.id } });
    res.status(201).json(employee);
  } catch (err) { next(err); }
};

const updateEmployee = async (req, res, next) => {
  try {
    const e = await Employee.findOne({ where: { id: req.params.id, organisation_id: req.user.orgId } });
    if (!e) return res.status(404).json({ message: 'Not found' });
    const { first_name, last_name, email, phone } = req.body;
    await e.update({ first_name, last_name, email, phone });
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'employee_updated', meta: { employeeId: e.id } });
    res.json(e);
  } catch (err) { next(err); }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const e = await Employee.findOne({ where: { id: req.params.id, organisation_id: req.user.orgId } });
    if (!e) return res.status(404).json({ message: 'Not found' });
    await e.destroy();
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'employee_deleted', meta: { employeeId: e.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
