const params = new URLSearchParams(window.location.search);

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

var data = {
	mag: 1,
	phi: Math.PI / 6,
	re: null,
	im: null,
	calculateFromTrigonometricForm: function() {
		this.re = this.mag * Math.cos(this.phi);
		this.im = this.mag * Math.sin(this.phi);
	},
	calculateFromRectangularForm: function() {
		this.mag = Math.sqrt(this.re * this.re + this.im * this.im);
		this.phi = Math.atan2(this.im, this.re);
	},

};
var dataView = {
	phiDegLabel: null,
	phiRadLabel: null,
	re: null,
	im: null,
	refresh: function() {
		this.phiDegLabel = Math.floor(180 * data.phi / Math.PI) + " °";
		let piRatio = (data.phi / Math.PI).toFixed(2);
		this.phiRadLabel = piRatio + " π";
		this.re = data.re.toFixed(2);
		this.im = data.im.toFixed(2);
	}
};

c.font = '14px Verdana';

function animate() {
	requestAnimationFrame(animate);
	update();
}

function update() {
	calculate();
	draw();

	if (params.has('phi')) {
		data.phi = Math.PI * parseInt(params.get('phi')) / 180;
	} else {
		data.phi = data.phi + 0.0015 * Math.PI;
		if (data.phi > Math.PI * 2)	{
			data.phi = 0;
		}
	}
}

function calculate() {
	data.calculateFromTrigonometricForm();
	dataView.refresh();
}

function draw() {
	c.save();
	c.clearRect(0, 0, canvas.width, canvas.height);
	drawSinCos();
	c.restore();
	c.save();
	drawComplex();
	c.restore();
}

function drawSinCos() {
	const el = canvas.width * .03;
	const er = canvas.width * .45;
	const ehm = el + (er - el) / 2;
	const w = er - el;
	const et = 0;
	const eb = canvas.height;
	const evm = et + (eb - et) / 2;
	const h = eb - et;

	c.lineWidth = 2;

	c.beginPath();
	c.moveTo(el, eb * .9);
	c.lineTo(el, eb * .1);
	c.stroke();
	c.beginPath();
	c.moveTo(el, evm);
	c.lineTo(er, evm);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "#AA0000";
	for (let x = el; x < er; ++x) {
		let phi = Math.PI * 2 * (x - el) / (er - el);
		let sin = Math.sin(phi);
		let y = evm + -.3 * h * sin;
		c.lineTo(x, y);
	}
	c.stroke();

	c.beginPath();
	c.strokeStyle = "#00AA00";
	for (let x = el; x < er; ++x) {
		let phi = Math.PI * 2 * (x - el) / (er - el);
		let sin = Math.cos(phi);
		let y = evm + -.3 * h * sin;
		c.lineTo(x, y);
	}
	c.stroke();

	// ------------------------------------------------------

	

	let xPhi = el + w * data.phi / (Math.PI * 2);
	let ySin = evm + -.3 * h * Math.sin(data.phi);
	let yCos = evm + -.3 * h * Math.cos(data.phi);

	c.strokeStyle = "#0000DD";
	c.lineWidth = 4;
	c.beginPath();
	c.moveTo(el, evm);
	c.lineTo(xPhi, evm);
	c.stroke();
	c.lineWidth = 2;
	c.setLineDash([3, 3]);
	c.beginPath();
	c.moveTo(xPhi, Math.min(evm, ySin, yCos));
	c.lineTo(xPhi, Math.max(evm, ySin, yCos));
	c.stroke();

	c.textAlign = 'center';
	c.fillStyle = "#0000DD";
	c.fillText(dataView.phiRadLabel, xPhi, evm + 20);
	c.fillText(dataView.phiDegLabel, xPhi, evm + 40);

	c.beginPath();
	c.strokeStyle = "#AA0000";
	c.moveTo(xPhi, ySin);
	c.lineTo(el, ySin);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "#00AA00";
	c.moveTo(xPhi, yCos);
	c.lineTo(el, yCos);
	c.stroke();

	c.textAlign = 'right';
	c.textBaseline = 'middle';
	c.fillStyle = "#AA0000";
	c.fillText(dataView.im, el - 3, ySin);
	c.fillStyle = "#00AA00";
	c.fillText(dataView.re, el - 3, yCos);
}

function drawComplex() {
	const el = canvas.width * .55;
	const er = canvas.width * .97;
	const ehm = el + (er - el) / 2;
	const w = er - el;
	const et = 0;
	const eb = canvas.height;
	const evm = et + (eb - et) / 2;
	const h = eb - et;

	c.lineWidth = 2;

	c.beginPath();
	c.strokeStyle = "#AA0000";
	c.moveTo(ehm, eb * .9);
	c.lineTo(ehm, eb * .1);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "#00AA00";
	c.moveTo(el, evm);
	c.lineTo(er, evm);
	c.stroke();

	// ------------------------------------------------------

	var xx = ehm + .3 * h * data.re; // specjalnie użyte h po to żeby zachować proporcje
	var yy = evm - .3 * h * data.im;

	c.lineWidth = 3;
	c.beginPath();
	c.strokeStyle = "#000000";
	c.moveTo(ehm, evm);
	c.lineTo(xx, yy);
	c.stroke();

	c.lineWidth = 2;

	c.beginPath();
	c.strokeStyle = "#0000DD";
	c.arc(ehm, evm, .3 * h * data.mag * 1, 0, -data.phi, true);
	c.stroke();

	c.textAlign = 'center';
	c.fillStyle = "#0000DD";
	var xxx = ehm + .3 * h * Math.cos(data.phi / 2) * data.mag * 1.1;
	var yyy = evm - .3 * h * Math.sin(data.phi / 2) * data.mag * 1.1;
	c.fillText(dataView.phiRadLabel, xxx, yyy - 10);
	c.fillText(dataView.phiDegLabel, xxx, yyy + 10);

	c.setLineDash([3, 3]);

	c.beginPath();
	c.strokeStyle = "#AA0000";
	c.moveTo(ehm, yy);
	c.lineTo(xx, yy);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "#00AA00";
	c.moveTo(xx, evm);
	c.lineTo(xx, yy);
	c.stroke();

	c.textAlign = 'center';
	c.textBaseline = 'middle';
	c.fillStyle = "#AA0000";
	c.fillText(dataView.im, ehm + 27 * (data.re < 0 ? 1 : -1), yy);
	c.fillStyle = "#00AA00";
	c.fillText(dataView.re, xx, evm + 13 * (data.im > 0 ? 1 : -1));

}

animate();