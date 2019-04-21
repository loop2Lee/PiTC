var net = require('net');
var client = new net.Socket();
let request = require('request');
let child_process = require("child_process");

//http://address:port/report?t=&id=

//http://address:port/report?t=80&id=2
const id = 1; //each RPi with a sensor has a unique ID
output("client running");
setInterval(() => {
	getTemperature(temperature => {
		temperature = stdout.substring(5, 7);
		let url = "http://" + process.argv[2] + "/report?t=" + temperature + "&id=" + id;
		request(url, (error, response, body) => {
			let answer = JSON.parse(body);
			if (answer.fan == true) {
				output("Temp: " + temperature + "    Fan: ON");
				child_process.exec("python3 LIGHT_ON.py", { timeout: 5000 });
			}
			else {
				output("Temp: " + temperature + "    Fan: OFF");
				child_process.exec("python3 LIGHT_OFF.py", { timeout: 5000 });
			}
		});
	}, true);
}, 5000);
function getTemperature(callback, random = false) {
	if (!random) {//get CPU temperature
		child_process.exec("/opt/vc/bin/vcgencmd measure_temp", (err, stdout, stderr) => {
			temperature = stdout.substring(5, 7);
			callback(temperature);
		});
	}
	else {//get random value for temperature
		callback(Math.trunc(Math.random() * 100));
	}
}
function output(t) {//general utility function
	if (exists(t)) {
		let n = new Date().toISOString().slice(0, 19).replace('T', ' ');;
		console.log(n + "." + new Date().getMilliseconds().pad(3) + " : " + t);
	}
}
function exists(anyObject) {//general utility function
	if (anyObject != null && anyObject != undefined) {
		return true;
	}
	else {
		return false;
	}
}
/*
{
	body:  fan: true
}
*/
