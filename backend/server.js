/**
 * Server Entry Point
 * Description: Binds the Express app to a port and starts listening.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

require('dotenv').config();
const app = require('./app');
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});
const port = parseInt(process.env.PORT, 10) || 3000;
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.listen(port, () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log(`║  SchoolMap API started                    ║`);
  console.log(`║  http://localhost:${port}                    ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}              ║`);
  console.log('╚═══════════════════════════════════════════╝');
});
