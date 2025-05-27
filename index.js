const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('../app-sigah-analytics/src/routes/authRoutes');
const alertRoutes = require('../app-sigah-analytics/src/routes/alertRoutes');
const pendingRoutes = require('../app-sigah-analytics/src/routes/pendingRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Origen recibido:', req.headers.origin);
//   next();
// });

// Rutas
app.use('/api', authRoutes);
app.use('/api', alertRoutes);
app.use('/api', pendingRoutes);

// Servidor
app.listen(PORT,'192.168.8.172', () => {
  console.log(`Servidor corriendo en http://192.168.8.172:${PORT}`);
});
