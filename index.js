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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var voicemeeter_connector_1 = require("voicemeeter-connector");
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var Server = require("socket.io").Server;
var io = new Server(server);
var CR = new Array(3);
voicemeeter_connector_1.Voicemeeter.init().then(function (vm) { return __awaiter(void 0, void 0, void 0, function () {
    var outputs, i, mono, i, cr;
    return __generator(this, function (_a) {
        vm.connect();
        console.log("Init data");
        outputs = 0;
        for (i = 0; i < 9; i++) {
            try {
                console.log("Try audio device " + (i + 1).toString());
                mono = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Mono);
                if (mono == undefined) {
                    break;
                }
            }
            catch (_b) {
                break;
            }
            outputs++;
        }
        console.log("Found " + outputs + " Outputs");
        //Insert all current values
        for (i = 0; i < outputs; i++) {
            cr = new Control();
            cr.Gain = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Gain);
            cr.Mute = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Mute);
            cr.Mono = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Mono);
            cr.Label = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Label);
            CR[i] = cr;
        }
        vm.attachChangeEvent(function () {
            for (var i = 0; i < outputs; i++) {
                CR[i].Gain = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Gain);
                CR[i].Mute = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Mute);
                CR[i].Mono = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Mono);
                CR[i].Label = vm.getBusParameter(i, voicemeeter_connector_1.BusProperties.Label);
            }
            io.emit("CR", CR);
        });
        io.on('connection', function (socket) {
            socket.emit("CR", CR);
            socket.on("gain", function (data) {
                try {
                    var fader = data.split('F')[0];
                    var gain = data.split('F')[1];
                    if (gain == undefined || gain > 12 || gain < -60) {
                        return;
                    }
                    CR[fader].Gain = gain;
                    vm.setBusParameter(Number(fader) - 1, voicemeeter_connector_1.BusProperties.Gain, Number(gain));
                }
                catch (_a) {
                }
            });
            socket.on("mute", function (data) {
                var fader = data.split('F')[0];
                var mute = data.split('F')[1];
                CR[Number(fader) - 1].Mute = mute;
                console.log(mute + " Fade " + (Number(fader) - 1).toString());
                vm.setBusParameter(Number(fader) - 1, voicemeeter_connector_1.BusProperties.Mute, Number(mute));
            });
        });
        console.log("Ready");
        return [2 /*return*/];
    });
}); });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
server.listen(3002, function () {
    console.log('listening on *:3002');
});
var Control = /** @class */ (function () {
    function Control() {
    }
    return Control;
}());
