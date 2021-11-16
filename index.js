//Express webserver
const express = require('express'); 
const app = express();
const http = require('http');
const server = http.createServer(app);



//Importing sockets
const { Server } = require('socket.io');
const io = new Server(server);

//Ved en get-request så vil express sende gjennom /index.html og man kan derfor ikke direkte GET
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
app.use(express.static('public'));

//Opprettholder tilkobling og alle events skjer under tilkobling
io.on('connection', (socket) => {
        //Henter brukernavn som sendes fra index.html
        socket.on('USRNAME', (usrname) => {
            console.log(usrname, "connected");
            let newuserconnected = `User ${usrname} has connected.`
            io.emit('userconnected', newuserconnected) 

        //Sjekker meldinger og emitter tilbake til index.html
        socket.on('chat message', (msg) => {
            
            //Enabling commands and removes the command ones.
            if(msg.startsWith('!')) {
                if (msg == '!test')
                io.emit('chat message', "Testing commands")
                else {console.log('Invalid command attempted.')}
            }


            else {
            //Concatenates message to username and emits both the username and the message. 
            let totalmsg = usrname + ': ' + msg;
            console.log(usrname, ': ' + msg);
            io.emit('chat message', totalmsg)
        }});

        //Ved disconnect, sjekker brukernavn og skal emitte at vedkommende har diconnected
        socket.on('disconnect', () => {
            console.log( usrname, 'disconnected')
            let newuserdisconnected = `User ${usrname} has disconnected.`
            io.emit('userdisconnected', newuserdisconnected);
        });
    
    });
    
});



server.listen(3000, () => {
    console.log('Listening on port 3000')
});