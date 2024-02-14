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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveControllerForRequest = exports.resolveParameters = void 0;
const users_api_models_1 = require("./users-api.models");
const users_api_controllers_1 = require("./users-api.controllers");
const url = __importStar(require("node:url"));
class Route {
    constructor(object) {
        this.method = users_api_models_1.Method.Get;
        this.path = '/api/users';
        this.isParameterRequired = false;
        Object.assign(this, object);
    }
}
const ROUTE_CONFIGS = [
    new Route({
        method: users_api_models_1.Method.Get,
        isParameterRequired: false,
        controller: users_api_controllers_1.allUsersController,
    }),
    new Route({
        method: users_api_models_1.Method.Get,
        isParameterRequired: true,
        controller: users_api_controllers_1.userByIdController,
    }),
    new Route({
        method: users_api_models_1.Method.Post,
        isParameterRequired: false,
        controller: users_api_controllers_1.createUserController,
    }),
    new Route({
        method: users_api_models_1.Method.Put,
        isParameterRequired: true,
        controller: users_api_controllers_1.updateUserController,
    }),
    new Route({
        method: users_api_models_1.Method.Delete,
        isParameterRequired: true,
        controller: users_api_controllers_1.deleteUserController,
    }),
];
function resolveParameters(request) {
    var _a;
    const fullPath = (_a = url.parse(request.url).pathname) === null || _a === void 0 ? void 0 : _a.split('/');
    const [_, api, users, parameter] = fullPath;
    return parameter;
}
exports.resolveParameters = resolveParameters;
function resolveControllerForRequest(request) {
    var _a, _b;
    const fullPath = (_a = url.parse(request.url).pathname) === null || _a === void 0 ? void 0 : _a.split('/');
    const [_, api, users, parameter] = fullPath;
    const pathname = fullPath.slice(0, 3).join('/');
    const controller = (_b = ROUTE_CONFIGS.find((route) => {
        return route.method === request.method
            && route.path === pathname
            && (route.isParameterRequired ? !!parameter : !parameter);
    })) === null || _b === void 0 ? void 0 : _b.controller;
    return controller || users_api_controllers_1.pageNotFoundController;
}
exports.resolveControllerForRequest = resolveControllerForRequest;
