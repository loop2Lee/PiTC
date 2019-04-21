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
				child_process.exec("sudo python3 LIGHT_ON.py")
			}
			else {
				child_process.exec("sudo python3 LIGHT_OFF.py")
			}
		});
	});
}, 5000);

/*
{
	body:  fan: true
}
*/
