require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

// Setup empty JS object to act as endpoint for all routes
projectData = {};
const apiKey = process.env.API_KEY;
// Require Express to run server and routes
app.use(express.json());

app.get('/getApiKey', (req, res) => {
	projectData = {
		apiKey: process.env.API_KEY,
	}
	res.send(projectData); 
	console.log('API Key sent successfully');
});

app.post('/data', (req, res) => {
	const newData = req.body; 
	console.log('Data received: ', req);
	projectData = newData; 
	res.send({ message: 'Data received successfully' }); 
	console.log('Data received successfully, ', projectData);
});

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const PORT = 3000; // Choose a port for your server

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});