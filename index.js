const express = require('express');
    morgan = require('morgan');

const app = express();

let topMovies = [
  {
    title: 'Harry Potter'
  },
  {
    title: 'Lord of the Rings'
  },
  {
    title: 'Surfer Dude'
  },
  {
    title: 'Tenacious D and the Pick of Destiny'
  },
  {
    title: 'Blades of Glory'
  },
  {
    title: 'Coco'
  },
  {
    title: 'Monty Python and the Holy Grail'
  },
  {
    title: 'The Big Lebowski'
  },
  {
    title: 'Into the Wild'
  },
  {
    title: 'Eurotrip'
  }
];

app.use(morgan('common'));

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your Movie app is listening on port 8080.');
});