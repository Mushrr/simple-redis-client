import { RedisClient, RedisSocket } from "./src/Client";


const Redis = new RedisClient({
    host: "localhost",
    port: 6379
});


Redis.getConnection().then((socket: RedisSocket) => {
    socket.set("Mushroom", "Cookie");
    socket.set("Mici", "Icmi").then( () => {
        socket.get("Mushroom").then((data: Buffer) => {
            console.log(data.toString());
            socket.close();
        })
    });
})
