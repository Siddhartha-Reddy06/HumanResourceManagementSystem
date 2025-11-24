const { Team, Employee, EmployeeTeam, Log } = require('../db');

const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{ model: Employee, attributes: ['id', 'first_name', 'last_name', 'email'], through: { attributes: [] } }]
    });
    res.json(teams);
  } catch (err) { next(err); }
};

const getTeam = async (req, res, next) => {
  try {
    const t = await Team.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
      include: [{ model: Employee, attributes: ['id', 'first_name', 'last_name', 'email'], through: { attributes: [] } }]
    });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) { next(err); }
};

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing name' });
    const team = await Team.create({ name, description, organisation_id: req.user.orgId });
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'team_created', meta: { teamId: team.id } });
    res.status(201).json(team);
  } catch (err) { next(err); }
};

const updateTeam = async (req, res, next) => {
  try {
    const t = await Team.findOne({ where: { id: req.params.id, organisation_id: req.user.orgId } });
    if (!t) return res.status(404).json({ message: 'Not found' });
    const { name, description } = req.body;
    await t.update({ name, description });
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'team_updated', meta: { teamId: t.id } });
    res.json(t);
  } catch (err) { next(err); }
};

const deleteTeam = async (req, res, next) => {
  try {
    const t = await Team.findOne({ where: { id: req.params.id, organisation_id: req.user.orgId } });
    if (!t) return res.status(404).json({ message: 'Not found' });
    await t.destroy();
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'team_deleted', meta: { teamId: t.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

const assignToTeam = async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    const { employeeId, employeeIds } = req.body;
    const ids = employeeIds || (employeeId ? [employeeId] : []);
    if (!ids.length) return res.status(400).json({ message: 'No employee ids' });
    const team = await Team.findOne({ where: { id: teamId, organisation_id: req.user.orgId } });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const validEmployees = await Employee.findAll({ where: { id: ids, organisation_id: req.user.orgId } });
    const validIds = validEmployees.map(e => e.id);
    const creates = await Promise.all(validIds.map(id => EmployeeTeam.findOrCreate({ where: { employee_id: id, team_id: teamId }, defaults: { employee_id: id, team_id: teamId } })));
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'assigned_employee_to_team', meta: { teamId, employeeIds: validIds } });
    res.json({ assigned: validIds });
  } catch (err) { next(err); }
};

const unassignFromTeam = async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'Missing employeeId' });
    const team = await Team.findOne({ where: { id: teamId, organisation_id: req.user.orgId } });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const e = await Employee.findOne({ where: { id: employeeId, organisation_id: req.user.orgId } });
    if (!e) return res.status(404).json({ message: 'Employee not found' });
    await EmployeeTeam.destroy({ where: { employee_id: employeeId, team_id: teamId } });
    await Log.create({ organisation_id: req.user.orgId, user_id: req.user.userId, action: 'unassigned_employee_from_team', meta: { teamId, employeeId } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { listTeams, getTeam, createTeam, updateTeam, deleteTeam, assignToTeam, unassignFromTeam };
