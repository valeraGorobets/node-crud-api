"use strict";
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
exports.pageNotFoundController = exports.deleteUserController = exports.updateUserController = exports.createUserController = exports.userByIdController = exports.allUsersController = void 0;
const users_db_models_1 = require("../db/users/users-db.models");
const utils_1 = require("../utils");
function allUsersController({ usersDbService }) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield usersDbService.getAllUsers();
        return { statusCode: 200, data: users };
    });
}
exports.allUsersController = allUsersController;
function userByIdController({ parameters: uuid, usersDbService }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!utils_1.Utils.isValidUUID(uuid)) {
            return { statusCode: 400, data: `UUID ${uuid} is not valid` };
        }
        const user = yield usersDbService.getAllUsersByUUID(uuid);
        return !!user
            ? { statusCode: 200, data: user }
            : { statusCode: 404, data: `User with id ${uuid} not found` };
    });
}
exports.userByIdController = userByIdController;
function createUserController({ body, usersDbService }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, users_db_models_1.areRequiredUserFieldsValid)(body)) {
            return { statusCode: 400, data: 'Missing proper Users properties or their values are not valid' };
        }
        const newUser = yield usersDbService.createUser(body);
        return { statusCode: 201, data: newUser };
    });
}
exports.createUserController = createUserController;
function updateUserController({ body, parameters: uuid, usersDbService }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!utils_1.Utils.isValidUUID(uuid)) {
            return { statusCode: 400, data: `UUID ${uuid} is not valid` };
        }
        const user = yield usersDbService.updateUser(uuid, body);
        return !!user
            ? { statusCode: 200 }
            : { statusCode: 404, data: `User with id ${uuid} not found` };
    });
}
exports.updateUserController = updateUserController;
function deleteUserController({ parameters: uuid, usersDbService }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!utils_1.Utils.isValidUUID(uuid)) {
            return { statusCode: 400, data: `UUID ${uuid} is not valid` };
        }
        const isDeleted = yield usersDbService.deleteUser(uuid);
        return isDeleted
            ? { statusCode: 204 }
            : { statusCode: 404, data: `User with id ${uuid} not found` };
    });
}
exports.deleteUserController = deleteUserController;
function pageNotFoundController() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            statusCode: 404,
            data: 'Route not found',
        };
    });
}
exports.pageNotFoundController = pageNotFoundController;
