const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatMessages = document.querySelector('.chat-messages');

const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
console.log(username);
console.log(room);
 

const socket = io();

socket.emit('joinRoom',{username,room});

// socket.on('roomUsers')

socket.on('message',(message)=>{
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomUsers',({room,users})=>{
    outputRoom(room);
    outputUsers(users);
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if(!msg){
        return false;
        
    }
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value = '';


    
})



function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


function outputRoom(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
        
    });

}


