import ioClient from 'socket.io-client';

//@papi
const socket = ioClient('http://localhost:3000', { path: '/api/chat' });

export default socket;
