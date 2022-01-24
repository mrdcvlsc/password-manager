const PORT = process.env.PORT || 8080;

const path 		 = require('path');
const fs 		 = require('fs');

const express 	 = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req,res) => {
	res.sendFile(path.join(`${__dirname}/public/html/login.html`));
});

app.get('/register', (req,res) => {
	res.sendFile(path.join(`${__dirname}/public/html/register.html`));
});

app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
})