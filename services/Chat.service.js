const users = {};

exports.handleConnection = (socket) => {
    console.log('A user connected');

    socket.on('user connected', (userId) => {
        users[userId] = socket.id;
    });

    socket.on('private message', ({ recipientId, message }) => {
        const recipientSocketId = users[recipientId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', { senderId: socket.id, message });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        Object.keys(users).forEach((userId) => {
            if (users[userId] === socket.id) {
                delete users[userId];
            }
        });
    });
};