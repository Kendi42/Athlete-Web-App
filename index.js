const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'races.json';

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (request, response) => {
    response.render('home');
});

// This is a RESTful GET web service
app.get('/races', (request, response) => {
    data.sort((a, b) => (a.date > b.date) ? 1 : -1 );
    response.send(data);
});

// This is a RESTful POST web service
app.post('/races', jsonParser, (request, response) => {
    data.push(request.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
});

app.post('/races/:id/delete', jsonParser, (request, response) => {
    rawData = fs.readFileSync(fileName);
    data = JSON.parse(rawData);
    console.log(request.params.id);
    for(let i=0; i < data.length; i++) {
        if(data[i].id === Number(request.params.id)) {
            data.splice(i, 1);
        }
    }

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    console.log(request.params.id);
    response.json(data);
})

app.listen(port);
console.log('server listening on port 3000');