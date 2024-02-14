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
exports.controllerAdapter = exports.responseServerError = exports.Method = void 0;
var Method;
(function (Method) {
    Method["Get"] = "GET";
    Method["Post"] = "POST";
    Method["Put"] = "PUT";
    Method["Delete"] = "DELETE";
})(Method = exports.Method || (exports.Method = {}));
function responseServerError(response, error) {
    response.writeHead(500);
    response.write(JSON.stringify(error));
    response.end();
}
exports.responseServerError = responseServerError;
function controllerAdapter(controller, controllerOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { port, response } = controllerOptions;
        response.setHeader('Port', port);
        try {
            const { statusCode, data } = yield controller(controllerOptions);
            response.writeHead(statusCode, { 'Content-Type': 'application/json' });
            if (data) {
                response.write(JSON.stringify(data));
            }
            response.end();
        }
        catch (error) {
            responseServerError(response, error);
        }
    });
}
exports.controllerAdapter = controllerAdapter;
