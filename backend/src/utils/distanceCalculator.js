/**
 * Haversine Distance Calculator
 * Description: Pure utility to compute great-circle distance between two
 *              geographic coordinates using the Haversine formula.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

/**
 * Calculates great-circle distance between two coordinates
 * using the Haversine formula.
 * @param {number} lat1 - Origin latitude (degrees)
 * @param {number} lon1 - Origin longitude (degrees)
 * @param {number} lat2 - Destination latitude (degrees)
 * @param {number} lon2 - Destination longitude (degrees)
 * @returns {number} Distance in kilometers, rounded to 2 decimal places
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

module.exports = { haversineDistance };
