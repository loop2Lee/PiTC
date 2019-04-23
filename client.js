var net = require('net');
var client = new net.Socket();
let request = require('request');
let child_process = require("child_process");
let ctable = require("console.table");
let Profiler = require("./timeprofiler.js");
let fs = require('fs');
Number.prototype.pad = function(size) {
	let s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
let m3_temperature = 50;

//http://address:port/report?t=&id=

//http://address:port/report?t=80&id=2
const id = 1; //each RPi with a sensor has a unique ID
output("client running");
setInterval(() => {
	let report_profiler = new Profiler("report");
	report_profiler.begin("get temperature");
	getTemperature(temperature => {
		report_profiler.end("get temperature");
		let url = "http://" + process.argv[2] + "/report?t=" + temperature + "&id=" + id;
		report_profiler.begin("http request");
		request(url, (error, response, body) => {
			report_profiler.end("http request");
			report_profiler.begin("json parse");
			let answer = JSON.parse(body);
			report_profiler.end("json parse");
			if (answer.fan == true) {
				output("Temp: " + temperature + "    Fan: ON");
				report_profiler.begin("python light");
				child_process.exec("python3 LIGHT_ON.py", { timeout: 5000 }, () => {
					report_profiler.end("python light");
					//output("\n" + ctable.getTable(report_profiler.endAllCtable()));
					fs.writeFile("timing.csv", report_profiler.endAllCSV(), { flag: "a" }, e => { if (e) console.error(e); });
				});
			}
			else {
				output("Temp: " + temperature + "    Fan: OFF");
				report_profiler.begin("python light");
				child_process.exec("python3 LIGHT_OFF.py", { timeout: 5000 }, () => {
					report_profiler.end("python light");
					//output("\n" + ctable.getTable(report_profiler.endAllCtable()));
					fs.writeFile("timing.csv", report_profiler.endAllCSV(), { flag: "a" }, e => { if (e) console.error(e); });
				});
			}
		});
	}, 3);
}, 400);
function getTemperature(callback, mode = 3) {
	if (mode == 1) {//get CPU temperature
		child_process.exec("/opt/vc/bin/vcgencmd measure_temp", (err, stdout, stderr) => {
			temperature = stdout.substring(5, 7);
			callback(temperature);
		});
	}
	else if (mode == 2) {//get random value for temperature
		callback(Math.trunc(Math.random() * 100));
	}
	else {
		child_process.exec("python3 BUTTON.py", (err, stdout, stderr) => {
			stdout = parseInt(stdout);
			if (stdout == 1) {
				m3_temperature += 5;
			}
			else if (stdout == -1) {
				m3_temperature -= 5;
			}
			callback(m3_temperature);
		});
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
