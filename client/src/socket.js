import {io} from 'socket.io-client';

const URI ='http://localhost:3000';
export const socket= io(URI);