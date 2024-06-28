const socket = io('https://chatroomserver-wkp3.onrender.com');
const messageContainer = document.getElementById('message-container');
const counter1Element = document.getElementById('counter1');
const counter2Element = document.getElementById('counter2');
const usersContainer = document.getElementById('users-container');
const messageForm = document.getElementById('send-container');

const name = prompt('Enter your name:');
appendMessage('You joined');
socket.emit('new-user', name);

let assignedVariable;

socket.on('assigned-variable', variable => {
  assignedVariable = variable;
  appendMessage(`You are assigned as ${variable}`);
});

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

socket.on('update-counters', counters => {
  counter1Element.textContent = counters.user1;
  counter2Element.textContent = counters.user2;
});

socket.on('update-users', users => {
  usersContainer.innerHTML = '';
  users.forEach(user => {
    appendUser(user.name, user.role);
  });
});

socket.on('max-users', message => {
  appendMessage(message);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  if (assignedVariable) {
    socket.emit('increment-variable', assignedVariable);
  }
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function appendUser(name, role) {
  const userElement = document.createElement('div');
  userElement.innerText = `${name} (${role})`;
  usersContainer.append(userElement);
}
