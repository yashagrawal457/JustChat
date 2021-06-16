const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path')
const formatMessage = require('./helpers/messages')

const {joinUser,getCurrentUser, userLeave,getRoomUsers} = require('./helpers/helper')
app.use(express.static(path.join(__dirname, 'public')))

server.listen(9000);

app.use(express.urlencoded({extended: true}))

app.get('/',(req,res) => {
    res.render('index');    
});



io.on('connection', (socket) =>{

    socket.on('joinRoom',({username,room})=>{
        const user = joinUser(username,room,socket.id);
        console.log(user.room);

        socket.join(user.room);

        socket.emit('message',formatMessage("JustChat","Welcome!"));

        socket.broadcast
         .to(user.room)
         .emit('message',formatMessage("JustChat",`${user.username} has joined`))
    
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
    });


    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage("JustChat",`${user.username} has left`));
            io.to(user.room).emit('roomUsers',{
                room : user.room,
                users : getRoomUsers(user.room)
            });
        }
    })
})




