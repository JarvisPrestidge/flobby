import * as IO from "socket.io-client";

const io = IO.connect("http://localhost:3000", { reconnection: true });

// Add a connect listener
io.on("connect", (socket: any) => {
    console.log("Connected!", socket);
});

io.emit("CH01", "me", "test msg");

// TODO: wrap in class and append to electron app
