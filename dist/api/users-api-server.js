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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersAPIServer = void 0;
const http = __importStar(require("node:http"));
const users_api_models_1 = require("./users-api.models");
const router_1 = require("./router");
class UsersAPIServer {
    constructor(port, usersDbService) {
        this.port = port;
        this.usersDbService = usersDbService;
        this.launchServer(port);
    }
    launchServer(port) {
        console.log(`UsersAPIServer port: ${port}`);
        http.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = yield this.getBody(request);
                const controllerOptions = {
                    request,
                    response,
                    port: this.port,
                    usersDbService: this.usersDbService,
                    body,
                    parameters: (0, router_1.resolveParameters)(request),
                };
                const controller = (0, router_1.resolveControllerForRequest)(request);
                yield (0, users_api_models_1.controllerAdapter)(controller, controllerOptions);
            }
            catch (error) {
                (0, users_api_models_1.responseServerError)(response, error);
            }
        })).listen(port);
    }
    getBody(request) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            request.on('data', (chunk) => {
                chunks.push(chunk);
            }).on('end', () => {
                try {
                    const body = Buffer.concat(chunks).toString();
                    resolve(body && JSON.parse(body));
                }
                catch (error) {
                    reject('Error during parsing body');
                }
            });
        });
    }
}
exports.UsersAPIServer = UsersAPIServer;
