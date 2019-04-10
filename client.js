var net = require('net');
var client = new net.Socket();
let request = require('request');

client.connet({
	port:80
});
//http://address:port/report?t=&id=

//http://address:port/report?t=80&id=2

setInterval(() => {
	let url = "http://address:port/report?t=" + temperature + "&id=" + id;
	request(url, (error, response, body) => {
		let answer = JSON.parse(body);
		if (answer.fan == true) {}
		else{}
	});
}, 5000);
client.on('connect', function(){
	//how to import temperature data from RPi?
	client.write(temp);
});

client.on('data', function(data)){
	  if (ans.fan){
		//need turn on the fan
	  }
	  else{
		  //need turn off the fan
	  }
});

/*
{
	fan: true
}
*/