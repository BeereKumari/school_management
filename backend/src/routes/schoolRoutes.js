/**
 * School Routes
 * Description: Express router wiring POST /addSchool and GET /listSchools
 *              to their respective controllers with validation.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');
const {
  addSchoolRules,
  listSchoolsRules,
  validate,
} = require('../validators/schoolValidator');

router.post('/addSchool', addSchoolRules, validate, addSchool);
router.get('/listSchools', listSchoolsRules, validate, listSchools);

module.exports = router;
