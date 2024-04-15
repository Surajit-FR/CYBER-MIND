const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ConnectToDataBase } = require('./config/database_config');
const http = require('http');
const socketIo = require('socket.io');
const { handleConnection } = require('./services/Chat.service');

const AuthRoutes = require('./routes/Auth.routes');
const UserRoutes = require('./routes/User.routes');

const AdminRoutes = require('./routes/admin/Admin.routes');

require('dotenv').config();

// Database connection
ConnectToDataBase()

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "views");

// Socket.IO setup
const server = http.createServer(app);
const io = socketIo(server);

// Server Health check
app.get('/health', (req, res) => {
    try {
        const networkInterfaces = os.networkInterfaces();

        // Extract IPv4 adresses
        const IPv4Adresses = Object.values(networkInterfaces)
            .flat()
            .filter(interfaceInfo => interfaceInfo.family === 'IPv4')
            .map(interfaceInfo => interfaceInfo.address);

        if (mongoose.connection.name) {
            const message = {
                host: IPv4Adresses,
                message: 'Healthy',
                status: true,
                time: new Date(),
            };
            console.log(message);
            return res.status(200).json({ response: message });
        } else {
            const message = {
                host: IPv4Adresses,
                message: 'Unhealthy',
                status: false,
                time: new Date(),
            };
            console.log(message);
            return res.status(501).json({ response: message });
        }
    } catch (error) {
        return res.status(500).json({ response: error.message })
    }
});

/* ADMIN */
// API routes
app.use('/api/admin', AdminRoutes);

/* USER */
// API routes
app.use('/api/auth', AuthRoutes);
app.use('/api', UserRoutes);

app.get('/api/server/check', (req, res) => {
    res.send("I am server, Happy to see you boss...");
});

// Internal server error handeling middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        status: 500,
        message: "Server Error",
        error: err
    });
});


// Page not found middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Page Not Found"
    });
});

const PORT = process.env.PORT || 4400;
const HOST = `${process.env.HOST}:${PORT}` || `http://localhost:${PORT}`;


// Socket server
io.on('connection', handleConnection);

server.listen(PORT, () => {
    console.log(`Server Connected On Port ${HOST}`)
});