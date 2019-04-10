var net = require('net');
var client = new net.Socket();
let request = require('request');

client.connet({
	port:80
});

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
