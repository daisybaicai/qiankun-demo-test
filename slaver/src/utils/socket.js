import io, { Socket } from 'socket.io-client'

let socket = null;

const socketClient = {
  open(url, callback) {
    if (socket) {
      return socket;
    }
    socket = io(url, {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
    });
    socket.on('connect', () => {
      callback && callback();
    })

    // socket 断连
    socket.on('disconnect', (reason) => {
      console.warn('WebSocket Disconnect', reason);
    })

    socket.on('connect_error', (error) => {
      console.warn('WebSocket Connect Error', error);
    })

    socket.on('connect_timeout', (timeout) => {
      console.warn('WebSocket Timeout', timeout);
    })

    socket.on('reconnect', () => {
      console.info('WebSocket Reconnect');
    })

    return socket;
  },
  close() {
    if (socket) {
      socket.close();
      socket = null;
    }
  },
}

export default socketClient;
