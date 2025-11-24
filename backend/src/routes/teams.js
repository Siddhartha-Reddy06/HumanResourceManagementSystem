const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listTeams, getTeam, createTeam, updateTeam, deleteTeam, assignToTeam, unassignFromTeam } = require('../controllers/teamController');
const router = express.Router();

router.use(authMiddleware);
router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:teamId/assign', assignToTeam);
router.delete('/:teamId/unassign', unassignFromTeam);

module.exports = router;
