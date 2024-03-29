const bodyParser = require('body-parser');
const express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Scott",
    favoriteMovie: ["Tenacious D and the Pick of Destiny"]
  },
  {
    id: 2,
    name: "Sam",
    favoriteMovie: []
  },
  {
    id: 3,
    name: "Mary",
    favoriteMovie: []
  }
]

// this will eventually get data from an external database. For now the "in memory" data will do.

let movies = [
  {
    "Title": "Harry Potter",
    "Genre": {
      "Name": "Fantasy",
      "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.",
    },
    "Director": {
      "Name": "J.K. Rowling",
      "Bio": "Born in Bristol"
    },
  },
  {
    "Title": "Lord of the Rings"
  },
  {
    "Title": "Surfer Dude"
  },
  {
    "Title": "Tenacious D and the Pick of Destiny"
  },
  {
    "Title": "Blades of Glory"
  },
  {
    "Title": "Coco"
  },
  {
    "Title": "Monty Python and the Holy Grail"
  },
  {
    "Title": "The Big Lebowski"
  },
  {
    "Title": "Into the Wild"
  },
  {
    "Title": "Eurotrip"
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

//READ 
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No movie was found.');
  }
});

//READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No genre was found.');
  }
});

//READ
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No director was found.');
  }
});

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser);
  } else {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  }
});

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No user found.');
  }
});

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('No user found.');
  }
});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('No user found.');
  }
});

//DELETE
app.delete('/users/:id/', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user = users.filter( user => user.id != id );
    res.status(200).send(`User ${id} has been removed`);
  } else {
    res.status(400).send('No user found.');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your Movie app is listening on port 8080.');
});