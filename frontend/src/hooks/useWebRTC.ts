import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ICE servers for NAT traversal (using free public STUN servers)
const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected';

interface UseWebRTCProps {
    consultationId: string;
    userType: 'patient' | 'doctor';
}

export const useWebRTC = ({ consultationId, userType }: UseWebRTCProps) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('disconnected');
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isCameraEnabled, setIsCameraEnabled] = useState(true);
    const [permissionError, setPermissionError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Initialize local media stream
    const initializeLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            localStreamRef.current = stream;
            setLocalStream(stream);
            setPermissionError(null); // Clear any previous errors
            return stream;
        } catch (error: any) {
            console.error('Error accessing media devices:', error);

            // Handle specific error types
            if (error.name === 'NotAllowedError') {
                const errorMsg = 'Camera and microphone access denied. Please allow permissions in your browser settings and refresh the page.';
                setPermissionError(errorMsg);
                console.error('❌', errorMsg);
            } else if (error.name === 'NotFoundError') {
                const errorMsg = 'No camera or microphone found. Please connect a device and try again.';
                setPermissionError(errorMsg);
                console.error('❌', errorMsg);
            }

            // Try audio-only fallback
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = audioStream;
                setLocalStream(audioStream);
                setIsCameraEnabled(false);
                setPermissionError('Camera access denied. Audio-only mode enabled.');
                return audioStream;
            } catch (audioError: any) {
                console.error('Error accessing audio:', audioError);

                // Handle audio-specific errors
                if (audioError.name === 'NotAllowedError') {
                    const errorMsg = 'Microphone access denied. Please allow microphone permission in your browser settings (click the lock icon in the address bar) and refresh the page.';
                    setPermissionError(errorMsg);
                    console.error('❌', errorMsg);
                } else if (audioError.name === 'NotFoundError') {
                    const errorMsg = 'No microphone found. Please connect a microphone and try again.';
                    setPermissionError(errorMsg);
                    console.error('❌', errorMsg);
                } else {
                    setPermissionError('Unable to access camera or microphone. Please check your device settings.');
                }

                throw audioError;
            }
        }
    }, []);

    // Create peer connection
    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        // Add local stream tracks to peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        // Handle incoming remote stream
        pc.ontrack = (event) => {
            console.log('📹 Received remote track');
            setRemoteStream(event.streams[0]);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                console.log('🧊 Sending ICE candidate');
                socketRef.current.emit('ice-candidate', {
                    consultationId,
                    candidate: event.candidate,
                });
            }
        };

        // Monitor connection state
        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);

            switch (pc.connectionState) {
                case 'connected':
                    setIsConnected(true);
                    setConnectionQuality('excellent');
                    break;
                case 'connecting':
                    setConnectionQuality('good');
                    break;
                case 'disconnected':
                    setIsConnected(false);
                    setConnectionQuality('poor');
                    // Attempt reconnection
                    setTimeout(() => {
                        if (pc.connectionState === 'disconnected') {
                            console.log('🔄 Attempting to reconnect...');
                            // Trigger ICE restart
                            pc.restartIce();
                        }
                    }, 2000);
                    break;
                case 'failed':
                    setIsConnected(false);
                    setConnectionQuality('disconnected');
                    console.error('❌ Connection failed');
                    break;
                case 'closed':
                    setIsConnected(false);
                    setConnectionQuality('disconnected');
                    break;
            }
        };

        // Monitor ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', pc.iceConnectionState);
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [consultationId]);

    // Initialize WebRTC connection
    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                // Initialize local stream
                const stream = await initializeLocalStream();
                if (!mounted) return;

                // Initialize Socket.IO
                const socket = io(SOCKET_URL, {
                    transports: ['websocket', 'polling'],
                });
                socketRef.current = socket;

                socket.on('connect', () => {
                    console.log('✅ Connected to signaling server');
                    socket.emit('join-room', { consultationId, userType });
                });

                socket.on('room-joined', ({ participantCount }) => {
                    console.log(`📊 Joined room with ${participantCount} participant(s)`);
                });

                socket.on('user-joined', async ({ userId, userType: joinedUserType }) => {
                    console.log(`👤 ${joinedUserType} joined the room`);

                    // Create peer connection and send offer
                    const pc = createPeerConnection();

                    try {
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);

                        socket.emit('offer', {
                            consultationId,
                            offer,
                        });
                        console.log('📤 Sent offer');
                    } catch (error) {
                        console.error('Error creating offer:', error);
                    }
                });

                socket.on('offer', async ({ offer, senderId }) => {
                    console.log('📥 Received offer from', senderId);

                    const pc = createPeerConnection();

                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(offer));
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);

                        socket.emit('answer', {
                            consultationId,
                            answer,
                        });
                        console.log('📤 Sent answer');
                    } catch (error) {
                        console.error('Error handling offer:', error);
                    }
                });

                socket.on('answer', async ({ answer, senderId }) => {
                    console.log('📥 Received answer from', senderId);

                    if (peerConnectionRef.current) {
                        try {
                            await peerConnectionRef.current.setRemoteDescription(
                                new RTCSessionDescription(answer)
                            );
                        } catch (error) {
                            console.error('Error handling answer:', error);
                        }
                    }
                });

                socket.on('ice-candidate', async ({ candidate, senderId }) => {
                    console.log('🧊 Received ICE candidate from', senderId);

                    if (peerConnectionRef.current) {
                        try {
                            await peerConnectionRef.current.addIceCandidate(
                                new RTCIceCandidate(candidate)
                            );
                        } catch (error) {
                            console.error('Error adding ICE candidate:', error);
                        }
                    }
                });

                socket.on('user-left', ({ userId }) => {
                    console.log('👋 User left:', userId);
                    setRemoteStream(null);
                    setIsConnected(false);
                    setConnectionQuality('disconnected');
                });

                socket.on('disconnect', () => {
                    console.log('❌ Disconnected from signaling server');
                    setConnectionQuality('disconnected');
                });

            } catch (error) {
                console.error('Error initializing WebRTC:', error);
            }
        };

        initialize();

        // Cleanup
        return () => {
            mounted = false;

            // Leave room
            if (socketRef.current) {
                socketRef.current.emit('leave-room', { consultationId });
                socketRef.current.disconnect();
            }

            // Close peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }

            // Stop local stream
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [consultationId, userType, initializeLocalStream, createPeerConnection]);

    // Toggle microphone
    const toggleMic = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicEnabled(audioTrack.enabled);
            }
        }
    }, []);

    // Toggle camera
    const toggleCamera = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraEnabled(videoTrack.enabled);
            }
        }
    }, []);

    // End call
    const endCall = useCallback(() => {
        // Leave room
        if (socketRef.current) {
            socketRef.current.emit('leave-room', { consultationId });
            socketRef.current.disconnect();
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Stop local stream
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        setLocalStream(null);
        setRemoteStream(null);
        setIsConnected(false);
    }, [consultationId]);

    return {
        localStream,
        remoteStream,
        isConnected,
        connectionQuality,
        isMicEnabled,
        isCameraEnabled,
        permissionError,
        toggleMic,
        toggleCamera,
        endCall,
    };
};
