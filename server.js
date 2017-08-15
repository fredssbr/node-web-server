const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

//Express app
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//Middleware helps configure how express works
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log.');
        }
    });
    //NEXT tells where your middleware is done
    next();
});

app.use((req, res, next) => {
    //res.render('maintenance.hbs');
    next();
});

/*
Middlewares are executed in the order you use them.
If this line was placed before the maintenance, it would still provide the help.html page
*/
app.use(express.static(__dirname + '/public'));

//Helper
hbs.registerHelper('getCurrentYear', () =>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Welcome to my website',
        likes: [
            'Biking',
            'Basketball',
            'Photography'
        ]
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'About page',
        projects: [
            'Java EE developer for a leading Brazilian cosmetic company',
            'PL/SQL developer for a multinational bank',
            'Front-end developer for a small local business',
            'Full-stack architect with DevOps'
        ]
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Page not found."
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}...`);
});