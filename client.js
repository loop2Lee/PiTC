var net = require('net');
var client = new net.Socket();
let request = require('request');

//http://address:port/report?t=&id=

//http://address:port/report?t=80&id=2
const id = 1; //each RPi with a sensor has a unique ID
setInterval(() => {
	child_process.exec("/opt/vc/bin/vcgencmd measure_temp", (err, stdout, stderr) => {
		temperature = stdout;
		let url = "http://address:port/report?t=" + temperature + "&id=" + id;
		request(url, (error, response, body) => {
			let answer = JSON.parse(body);
			if (answer.fan == true) {
				console.log("Temp: " + temp + "    Fan: ON");
				child_process.exec("sudo python3 LIGHT_ON.py", { timeout: 5000 });
			}
			else {
				console.log("Temp: " + temp + "    Fan: OFF");
				child_process.exec("sudo python3 LIGHT_OFF.py", { timeout: 5000 });
			}
		});
	});
}, 5000);

/*
{
	body:  fan: true
}
*/
