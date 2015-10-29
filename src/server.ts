/// <reference path="../typings/all.d.ts" />

var static = require('node-static');
var http = require('http');
var file = new static.Server('./bin');

http.createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response);
	}).resume();
}).listen(3003, function() {
	console.log(`Handlebars renderer available at http://localhost:${this.address().port}/index.html`);
});