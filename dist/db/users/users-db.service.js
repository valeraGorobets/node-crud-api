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
exports.UsersDbService = void 0;
const db_service_1 = require("../db.service");
const users_db_models_1 = require("./users-db.models");
class UsersDbService extends db_service_1.DbService {
    constructor() {
        super(users_db_models_1.PATH_TO_DB);
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.loadDB();
        });
    }
    getAllUsersByUUID(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.getAllUsers();
            return allUsers.find(({ id }) => id === uuid);
        });
    }
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new users_db_models_1.User(body);
            const allUsers = yield this.getAllUsers();
            yield this.writeToDB([
                ...allUsers,
                newUser,
            ]);
            return newUser;
        });
    }
    updateUser(uuid, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.getAllUsers();
            let userToUpdate = allUsers.find(({ id }) => id === uuid);
            if (!userToUpdate) {
                return;
            }
            userToUpdate = new users_db_models_1.User(Object.assign(Object.assign({}, userToUpdate), body));
            const updatedUsers = allUsers.map((user) => {
                return user.id === uuid
                    ? userToUpdate
                    : user;
            });
            yield this.writeToDB(updatedUsers);
            return userToUpdate;
        });
    }
    deleteUser(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.getAllUsers();
            const updatedUsers = allUsers.filter(({ id }) => id !== uuid);
            yield this.writeToDB(updatedUsers);
            return allUsers.length !== updatedUsers.length;
        });
    }
    typeObject(object) {
        return new users_db_models_1.User(object);
    }
}
exports.UsersDbService = UsersDbService;
