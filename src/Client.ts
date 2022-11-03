// Redis Client
import { Socket } from "node:net";

interface RedisClientConfig {
    host: string;
    port: number;
}

class RedisSocket extends Socket {
    constructor(config: RedisClientConfig) {
        super();
        this.connect(config.port, config.host);
    }

    public set(key: string, value: string | number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.write(`SET ${key} ${value}\n`);
            const fetchAns = (chunk: Buffer) => {
                if (chunk.toString().includes("OK")) {
                    resolve(chunk);
                    this.off("data", fetchAns);
                } else {
                    reject("error! can't set data");
                }
            }
            this.on("data", fetchAns);
        })
    }

    public get(key: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                this.write(`GET ${key}\n`);
                const fetchAns = (chunk: Buffer) => {
                    resolve(chunk);
                    this.off("data", fetchAns);
                }
                this.on("data", fetchAns);
            } catch(err) {
                reject(err);
            }
        })
    }

    public close(): void {
        this.end();
    }
}

class RedisClient {

    private config: RedisClientConfig;

    constructor(config: RedisClientConfig) {
        this.config = config; // 配置项
    }


    getConnection(): Promise<RedisSocket> {
        return new Promise((resolve, reject) => {
            const socket = new RedisSocket(this.config);

            socket.on("connect", () => {
                resolve(socket);
            });

            socket.on("error", (err) => {
                reject(err);
            });
        });
    }
}


export {
    RedisClient,
    RedisSocket
};