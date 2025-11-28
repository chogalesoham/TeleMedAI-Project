const socketIO = require('socket.io');

// Store active rooms and their participants
const rooms = new Map();

const initializeSignaling = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Join a consultation room
        socket.on('join-room', ({ consultationId, userType }) => {
            console.log(`👤 ${userType} joining room: ${consultationId}`);

            socket.join(consultationId);

            // Track room participants
            if (!rooms.has(consultationId)) {
                rooms.set(consultationId, new Set());
            }
            rooms.get(consultationId).add(socket.id);

            // Notify others in the room
            socket.to(consultationId).emit('user-joined', {
                userId: socket.id,
                userType
            });

            // Send current room info to the joining user
            const roomSize = rooms.get(consultationId).size;
            socket.emit('room-joined', {
                consultationId,
                participantCount: roomSize
            });

            console.log(`📊 Room ${consultationId} now has ${roomSize} participant(s)`);
        });

        // Handle WebRTC offer
        socket.on('offer', ({ consultationId, offer }) => {
            console.log(`📤 Forwarding offer in room: ${consultationId}`);
            socket.to(consultationId).emit('offer', {
                offer,
                senderId: socket.id
            });
        });

        // Handle WebRTC answer
        socket.on('answer', ({ consultationId, answer }) => {
            console.log(`📥 Forwarding answer in room: ${consultationId}`);
            socket.to(consultationId).emit('answer', {
                answer,
                senderId: socket.id
            });
        });

        // Handle ICE candidates
        socket.on('ice-candidate', ({ consultationId, candidate }) => {
            console.log(`🧊 Forwarding ICE candidate in room: ${consultationId}`);
            socket.to(consultationId).emit('ice-candidate', {
                candidate,
                senderId: socket.id
            });
        });

        // Handle leaving room
        socket.on('leave-room', ({ consultationId }) => {
            handleUserLeaving(socket, consultationId);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);

            // Remove from all rooms
            rooms.forEach((participants, consultationId) => {
                if (participants.has(socket.id)) {
                    handleUserLeaving(socket, consultationId);
                }
            });
        });
    });

    // Helper function to handle user leaving
    const handleUserLeaving = (socket, consultationId) => {
        console.log(`👋 User leaving room: ${consultationId}`);

        socket.leave(consultationId);

        if (rooms.has(consultationId)) {
            rooms.get(consultationId).delete(socket.id);

            // Notify others in the room
            socket.to(consultationId).emit('user-left', {
                userId: socket.id
            });

            // Clean up empty rooms
            if (rooms.get(consultationId).size === 0) {
                rooms.delete(consultationId);
                console.log(`🧹 Room ${consultationId} deleted (empty)`);
            } else {
                console.log(`📊 Room ${consultationId} now has ${rooms.get(consultationId).size} participant(s)`);
            }
        }
    };

    console.log('🔌 Socket.IO signaling server initialized');
    return io;
};

module.exports = initializeSignaling;
