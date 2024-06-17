const express = require('express');
const os = require('os');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const { ConnectToDataBase } = require('./config/database_config');
const { handleConnection } = require('./services/Chat.service');

const AuthRoutes = require('./routes/Auth.routes');
const UserRoutes = require('./routes/User.routes');
const UtilityRoutes = require('./routes/Utility.routes');
const TransactionRoutes = require('./routes/Transaction.routes');
const AdminRoutes = require('./routes/admin/Admin.routes');

require('dotenv').config();

// Database connection
ConnectToDataBase();

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "views");

const server = http.createServer(app);
const io = socketIo(server);

// Health Check Route
app.get('/health', (req, res) => {
    try {
        const networkInterfaces = os.networkInterfaces();
        const IPv4Addresses = Object.values(networkInterfaces)
            .flat()
            .filter(interfaceInfo => interfaceInfo.family === 'IPv4')
            .map(interfaceInfo => interfaceInfo.address);

        const message = {
            host: IPv4Addresses,
            message: mongoose.connection.readyState === 1 ? 'Healthy' : 'Unhealthy',
            status: mongoose.connection.readyState === 1,
            time: new Date(),
        };
        console.log(message);
        return res.status(200).json({ response: message });
    } catch (error) {
        return res.status(500).json({ response: error.message });
    }
});

/* API Routes */
app.use('/api/admin', AdminRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api', UserRoutes);
app.use('/api', UtilityRoutes);
app.use('/api', TransactionRoutes);

app.get('/api/server/check', (req, res) => {
    res.send("Hi!...I am server, Happy to see you boss...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        status: 500,
        message: err.message,
        error: err
    });
});

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Page Not Found"
    });
});

const PORT = process.env.PORT || 4400;
const HOST = '0.0.0.0';

io.on('connection', handleConnection);

// Listen on specified port and host
server.listen(PORT, HOST, () => {
    console.log(`Server Connected On Port ${PORT}`);
});
