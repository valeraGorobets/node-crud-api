"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const http = __importStar(require("node:http"));
const process = __importStar(require("node:process"));
const users_api_server_1 = require("./api/users-api-server");
const os = __importStar(require("os"));
const users_db_service_1 = require("./db/users/users-db.service");
const utils_1 = require("./utils");
class LoadBalancer {
    constructor(clustersToCreate) {
        this.clustersToCreate = clustersToCreate;
        this.baseServerPort = (process.env.BASEPORT && parseInt(process.env.BASEPORT)) || 4000;
        this.workers = new Map();
        this.initChildClusters();
        this.launchBalancerServer();
    }
    initChildClusters() {
        for (let i = 0; i < this.clustersToCreate; i++) {
            const workerId = i + 1;
            const port = this.getServerPort(workerId);
            const env = {
                port,
            };
            const worker = cluster_1.default.fork(env);
            this.workers.set(port, worker);
        }
        cluster_1.default.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
    getNextWorkerPort() {
        const workerPorts = Array.from(this.workers.keys());
        const currentIndex = workerPorts.indexOf(this.currentWorkerPort);
        const nextIndex = currentIndex + 1;
        this.currentWorkerPort = workerPorts[nextIndex] || workerPorts[0];
        return this.currentWorkerPort;
    }
    launchBalancerServer() {
        const serverPort = this.getServerPort();
        console.log(`Load balancer port: ${serverPort}`);
        http.createServer((req, res) => {
            const port = this.getNextWorkerPort();
            const host = req.headers['host'].split(':')[0];
            const redirectURL = `http://${host}:${port}${req.url}`;
            res.writeHead(307, { Location: redirectURL });
            res.end();
        }).listen(serverPort);
    }
    getServerPort(workerId = 0) {
        return this.baseServerPort + workerId;
    }
}
(function () {
    const clustersToCreate = utils_1.Utils.isMultiThreadArgvFlag()
        ? os.availableParallelism() - 1
        : 1;
    if (cluster_1.default.isPrimary) {
        new LoadBalancer(clustersToCreate);
    }
    else {
        const port = (process.env.port && parseInt(process.env.port)) || 0;
        new users_api_server_1.UsersAPIServer(port, new users_db_service_1.UsersDbService());
    }
})();
