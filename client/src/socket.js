import {io} from 'socket.io-client';

const URI = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const socket= io(URI);