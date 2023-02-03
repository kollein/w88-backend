console.log('room');

// on connect
socket.on('connect', () => {
  socket.emit('room', 'keno');
  socket.emit('client', 'ready to fire');
});

// on message
socket.on('message', (data) => {
  console.log('Incoming message:', data);
});