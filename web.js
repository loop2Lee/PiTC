/*
API for PiTC
Language: Node.js
(c) 2018 All rights reserved except for copyrighted resources belonging to others.
This file may contain privileged information.
The distribution of this file is not permitted without explicit written permission of the original author.

dependencies:
pm2 -g
apt htop
promise
express
apt ufw
url

optional: node-2fa
*/
"use strict";
Number.prototype.pad = function(size) {
	let s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
const fs = require("fs");

let path = require('path');
let crypto = require("crypto");

const express = require("express");
const website = express();
let http = require("http");

output("modules loaded");
ready();
let user_progress = {};
function ready() {
	website.listen(80);
	website.use(function (req, res, next) {
		req.setTimeout(5000);
		//res.setHeader("Strict-Transport-Security", "max-age=0; includeSubDomains")
		return next();
	});
	http.createServer({}, website).listen(80);
	output("ready");

	serveWebRequest('/', function (req, res) {
		res.sendFile(__dirname + "/static/index.html");
	});
	serveWebRequest(["/f/:filename"], function (req, res, next) {//retrieve file
		fs.exists("./fs/" + req.params.filename, function (valid) {
			if (valid) {//b and d
				res.sendFile(__dirname + "/fs/" + req.params.filename);
			}
			else res.status(404).end();
		});
	});
	/*serveWebRequest("/favicon.ico", function(req, res, next){
		res.sendFile(__dirname + "/static/favicon.ico");
	});*/
	serveWebRequest("*", function (req, res, next) {
		res.status(404).end();
	});
	function serveWebRequest(branch, callback, print = true) {
		if (typeof(branch) == "string") {
			website.get(branch, function (req, res, next) {
				if (print) output(req.connection.remoteAddress + " served: " + req.originalUrl);
				callback(req, res, next);
			});
		}
		else {
			for (let b in branch) {
				website.get(branch[b], function(req, res, next) {
					if (print) output(req.connection.remoteAddress + " served: " + req.originalUrl);
					callback(req, res, next);
				});
			}
		}
	}
}
function round(num, decimal = 0) {
	return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
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
function changeBaseTo62(number) {
	number = parseInt(number);//convert to string
	const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let answer = "";
	while (number > 0) {
		answer = dictionary.substring(number % 62, (number % 62) + 1) + answer;
		number = (number - (number % 62)) / 62;
	}
	return answer;
}
function changeBaseTo55(number) {
	number = parseInt(number);//convert to string
	const dictionary = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	let answer = "";
	while (number > 0) {
		answer = dictionary.substring(number % 55, (number % 55) + 1) + answer;
		number = (number - (number % 55)) / 55;
	}
	return answer;
}
function digitBase55(number) {
	const dictionary = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	return dictionary[number];
}
function assert(value) {
	if (value !== true) {
		throw new Error("Assertion failed");
	}
}
function randomBase55(entropy) {// in bits
	entropy = entropy ? 45 : 23;
	let temp = "";
	while (temp.length < entropy) {
		const candidate = crypto.randomBytes(1)[0] % 55;
		temp += digitBase55(candidate);
	}
	return temp;
}
