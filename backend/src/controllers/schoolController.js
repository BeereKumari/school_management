/**
 * School Controller
 * Description: Business logic for addSchool and listSchools endpoints.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

const pool = require('../config/db');
const { haversineDistance } = require('../utils/distanceCalculator');

/**
 * POST /addSchool — Adds a new school to the database.
 * @param {object} req.body - { name, address, latitude, longitude }
 * @returns {object} 201 JSON with created school data
 */
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    const sanitizedName = name.trim();
    const sanitizedAddress = address.trim();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [sanitizedName, sanitizedAddress, lat, lon]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name: sanitizedName,
        address: sanitizedAddress,
        latitude: lat,
        longitude: lon,
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /listSchools — Retrieves all schools sorted by proximity to user.
 * @param {object} req.query - { latitude, longitude }
 * @returns {object} 200 JSON with sorted schools including distance_km
 */
const listSchools = async (req, res, next) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    const [rows] = await pool.execute(
      'SELECT id, name, address, latitude, longitude, created_at FROM schools ORDER BY id ASC'
    );

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        total: 0,
        user_location: { latitude: userLat, longitude: userLon },
        data: [],
      });
    }

    const schoolsWithDistance = rows.map((school) => {
      const schoolLat = Number(school.latitude);
      const schoolLon = Number(school.longitude);
      return {
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: schoolLat,
        longitude: schoolLon,
        created_at: school.created_at,
        distance_km: haversineDistance(userLat, userLon, schoolLat, schoolLon),
      };
    });

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved and sorted by proximity',
      total: schoolsWithDistance.length,
      user_location: { latitude: userLat, longitude: userLon },
      data: schoolsWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addSchool, listSchools };
