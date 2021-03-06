//see babel file

"use strict";

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    svgNS = svg.namespaceURI,
    vbx = document.createElementNS(svgNS, "viewBox"),
    g = document.createElementNS(svgNS, "g"),
    color = '#73d2ff',
    width = 800,
    height = 300,
    xA = new Array(),
    yA = new Array(),
    xmin = -10,
    xmax = 10,
    ymin = -20,
    ymax = 20,
    xorig = 300,
    yorig = 100,
    n = 0,
    bk = undefined,
    ball = undefined,
    ball2 = undefined,
    xscal = undefined,
    yscal = undefined;

//set the SVG and the body
document.body.style.background = '#222';
var poolC = document.getElementById("poolcontain");
append(poolC, g);
setAttributes(g, {
	"class": "elastic",
	"filter": "url('#goo')",
	"style": "transform:translate3d(600px, 344px, 0) rotate(180deg) scale(0.5)"
});

//***** Create the Bk *****//
function Background(color) {
	this.panel = document.createElementNS(svgNS, "path");
	this.color = color;
	this.y = 0;
	this.y2 = 0;
	this.inc = 150;
	this.start = 175;
}

Background.prototype.draw = function () {
	append(g, this.panel);
	setAttributes(this.panel, {
		"d": "M " + this.start + " 100 Q " + (this.start + 50) + " " + this.y2 + " " + (this.start + 75) + " 100 Q " + width / 2 + " " + this.y + " " + (width - (this.inc + 75)) + " 100 Q " + (width - this.inc) + " " + this.y2 + " " + (width - this.inc) + " 100 L " + width + " 0 L 0 0 Z",
		"fill": this.color
	});
};

//***** Create the Ball *****//
function Ball(radius, color) {
	this.circ = document.createElementNS(svgNS, "circle");
	this.radius = radius;
	this.color = color;
	this.y = 0;
}

Ball.prototype.draw = function () {
	append(g, this.circ);
	setAttributes(this.circ, {
		"r": this.radius,
		"cx": width / 2,
		"cy": this.y,
		"fill": this.color
	});
};

//***** Set up the Motion *****//
window.onload = init;

function init() {
	plotter();
	placeBall();
	placeBk();
	window.requestAnimationFrame(step);
}

function plotter() {
	xscal = (xmax - xmin) / (width / 4);
	yscal = (ymax - ymin) / (height / 4);
	for (var i = 0; i <= 1500; i++) {
		//set the boundary for how much plays here
		xA[i] = (i - 0) * 0.02;
		yA[i] = f(xA[i]);
	}
}

function f(x) {
	var y = undefined;
	y = (x + 3.6) * (x + 2.5) * (x + 1) * (x - 0.5) * (x - 2) * (x - 3.5) * Math.exp(-x * x / 4);
	return y;
}

function placeBk() {
	var orig = yA[0] / yscal + yorig;
	bk = new Background(color);
	bk.x = xA[0] / xscal + xorig;
	bk.y2 = orig;
	bk.y = orig;
	bk.draw();
}

function placeBall() {
	//ball 1
	ball = new Ball(12, '#59c1f2');
	ball.x = xA[0] / xscal + xorig;
	ball.draw();
	//ball 2	
	ball2 = new Ball(5, '#bee5f7');
	ball2.x = xA[0] / xscal + xorig;
	ball2.draw();
}

//use rAF to animate but put a boundary on it so it doesn't run forever
function step(timestamp) {
	//console.log(bk.x);
	if (bk.x < 440) {
		moveBk();
		moveBall();
		window.requestAnimationFrame(step);
	}
}

function moveBk() {
	bk.x = xA[n] / xscal + xorig;
	bk.y2 = yA[n] / (yscal * 4) + yorig;
	bk.y = -yA[n] / (yscal / 1) + yorig;
	bk.draw();
	n++;
}

function moveBall() {
	var yMove = yA[n] / (yscal / 1) + (yorig - 30);
	var yMove2 = yA[n] / yscal * 2 + (yorig - 50);
	ball.circ.style.transform = "translate3d(0, " + yMove + "px, 0";
	ball2.circ.style.transform = "translate3d(0, " + yMove2 + "px, 0";
	n++;
}

//***** helper functions *****//

//function to set multiple attributes at once
function setAttributes(el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

//function to append children because typing
function append(el, addition) {
	el.appendChild(addition);
}