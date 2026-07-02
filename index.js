const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const { limiter, authLimiter } = require('./middleware/rateLimiter');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['
    http://localhost:5173',
    'https://pms-client-beige.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // large payload attacks se protection
app.use(limiter); // sab routes pe rate limit

// Routes
app.use('/api/auth',        authLimiter, require('./routes/authRoutes'));
app.use('/api/properties',  require('./routes/propertyRoutes'));
app.use('/api/tenants',     require('./routes/tenantRoutes'));
app.use('/api/payments',    require('./routes/paymentRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/dashboard',   require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));