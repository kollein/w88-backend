console.log('room');

// on connect
socket.on('connect', () => {
  console.log("🚀 ~ file: room.js:7 ~ socket.on ~ connect")
});

// on message
socket.on('message', (data) => {
  console.log('Incoming message:', data);
});