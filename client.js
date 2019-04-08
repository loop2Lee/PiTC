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
