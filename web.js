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

const express = require("express");
const website = express();
let http = require("http");

output("modules loaded");
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
serveWebRequest("/report", (req, res, next) => {//expects query parameter ?t=&id=
	if (!exists(req.query.t) || !exists(req.query.id) || req.query.t == "" || req.query.id == "") {
		return res.status(400).send("missing either id or t query parameter").end();
	}
	const reported_temperature = parseInt(req.query.t);
	fs.writeFile("temperature.log", req.query.id + "," + new Date().getTime() + "," + reported_temperature, { flag: "a" }, e => {
		if (e) {
			console.error(e);
		}
	});
	let ans = {};
	if (reported_temperature > 80) {
		ans.fan = true;
	}
	else {
		ans.fan = false;
	}
	res.json(ans);
});
serveWebRequest("/history", (req, res, next) => {//expects optional query parameter ?ids=
	fs.readFile("./temperature.log", (err, data) => {
		if (exists(req.query.ids) && req.query.ids != "") {
			let rows = data.split("\n");
			const ids = req.query.ids.split(",");
			let ans = [];
			if (ids.indexOf(rows.substring(0, rows.indexOf(","))) != -1) {
				ans.push(rows);
			}
			res.send("<html><head></head><body>" + ans.join("\n") + "</body></html>").end();
		}
		else {
			res.send("<html><head></head><body>" + data + "</body></html>").end();
		}
	});
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
function assert(value) {
	if (value !== true) {
		throw new Error("Assertion failed");
	}
}
