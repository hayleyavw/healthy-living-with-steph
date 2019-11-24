require('dotenv').config()
const express = require('express');
const body_parser = require('body-parser');
const validator = require("email-validator");

const app = express();
app.use(express.static('templates'));
app.use(express.static('static'));
app.use(body_parser.json());


app.get('/', function (req, res) {
	res.send("Hello World!");
})

app.listen(3000, function() {
	console.log("Server running on 3000");
});

const apiKey = process.env.API_KEY
const DOMAIN = process.env.API_DOMAIN
let mailgun = require('mailgun-js')({apiKey: apiKey, domain: DOMAIN});

app.post('/', function(req, res) {
	var email = req.body.email;
	if (validator.validate(email) == false) {
		return res.status(400).send();
	}
	var data = {
	  from: email,
	  to: `${process.env.EMAIL}`,
	  subject: 'Message from ' + req.body.name,
	  text: req.body.message
	};

	mailgun.messages().send(data, function (error, body) {
	  console.log(body);
	});

	res.status(200).send();
})
