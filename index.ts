import { Voicemeeter, StripProperties, BusProperties } from "voicemeeter-connector";
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


var CR: Array<Control> = new Array<Control>(3);

Voicemeeter.init().then(async (vm) => {
    vm.connect();



    console.log("Init data")
    var outputs = 0;
    for (let i = 0; i < 8; i++) {
        try {
            console.log("Try audio device " + (i + 1).toString());
            //Just try to get some value
            var mono = vm.getBusParameter(i, BusProperties.Mono);
            if (mono == undefined) {

                break;
            }

        } catch {
            break;
        }
        outputs++;
    }


    console.log("Found " + outputs + " Outputs");
    //Insert all current values
    for (let i = 0; i < outputs; i++) {
        const cr = new Control();
        cr.Gain = vm.getBusParameter(i, BusProperties.Gain);
        cr.Mute = vm.getBusParameter(i, BusProperties.Mute);
        cr.Mono = vm.getBusParameter(i, BusProperties.Mono);
        cr.Label = vm.getBusParameter(i, BusProperties.Label);
        CR[i] = cr;
    }



    vm.attachChangeEvent(() => {
        for (let i = 0; i < outputs; i++) {
            CR[i].Gain = vm.getBusParameter(i, BusProperties.Gain);
            CR[i].Mute = vm.getBusParameter(i, BusProperties.Mute);
            CR[i].Mono = vm.getBusParameter(i, BusProperties.Mono);
            CR[i].Label = vm.getBusParameter(i, BusProperties.Label);
        }

        io.emit("CR", CR);
    });

    io.on('connection', (socket) => {
        socket.emit("CR", CR);

        socket.on("gain", (data) => {

            try {
                const fader = data.split('F')[0];
                const gain = data.split('F')[1];
                if (gain == undefined || gain > 12 || gain < -60) {
                    return;
                }

                CR[fader].Gain = gain;

                vm.setBusParameter(Number(fader) - 1, BusProperties.Gain, Number(gain));
            } catch {

            }
        })

        socket.on("mute", (data) => {

            const fader = data.split('F')[0];
            const mute = data.split('F')[1];


            CR[Number(fader) - 1].Mute = mute;




            vm.setBusParameter(Number(fader) - 1, BusProperties.Mute, Number(mute));
        })


    });

    console.log("Ready");

});




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3002, () => {
    console.log('listening on *:3002');
});


class Control {
    Gain: Number;
    Mute: Number;
    Mono: Number;
    Label: String;

}