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
exports.User = exports.areRequiredUserFieldsValid = exports.PATH_TO_DB = void 0;
const utils_1 = require("../../utils");
const path = __importStar(require("node:path"));
exports.PATH_TO_DB = path.join(__dirname, '../users-db.json');
function areRequiredUserFieldsValid(object) {
    const requiredFieldsMapToType = new Map([
        ['username', 'string'],
        ['age', 'number'],
        ['hobbies', 'array'],
    ]);
    if (Object.keys(object).length !== requiredFieldsMapToType.size) {
        return false;
    }
    return Array.from(requiredFieldsMapToType.keys()).every((key) => {
        const isPresent = !!object[key];
        const type = requiredFieldsMapToType.get(key);
        const isTypeMatching = type === 'array'
            ? Array.isArray(object[key])
            : typeof object[key] === type;
        return isPresent && isTypeMatching;
    });
}
exports.areRequiredUserFieldsValid = areRequiredUserFieldsValid;
class User {
    constructor(user) {
        this.id = utils_1.Utils.generateUUID();
        this.hobbies = [];
        Object.assign(this, user);
    }
}
exports.User = User;
