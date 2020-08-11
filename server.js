require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');
const db = require('sequelize');
const { response } = require('express');

let API_KEY = process.env.API_KEY;

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

app.use('/faves',require('./routes/faves'));

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/results', (req, res) =>{
  let search = req.query.movie
  let qs = {
    params: {
      s: search,
      apikey: API_KEY
    }
  }

  axios.get('http://www.omdbapi.com', qs)
  .then((response) =>{
    console.log(response.data)
    let movie = response.data.Search
    //setting a variable to data
    res.render('results', {data: movie})
  })
  .catch(err =>{
    console.log(err)
  })
})

app.get('/movie/:movie_id', (req,res) =>{
  let imdbID = req.params.movie_id

  let qs = {
    params: {
      i: imdbID,
      apikey: API_KEY
    }
  }

  axios.get('http://www.omdbapi.com', qs)
  .then((response) =>{
    console.log(response.data)
    let movieDetail = response.data;
    //setting a variable to data
    res.render('detail', {data: movieDetail})
  })
  .catch(err =>{
    console.log(err)
  })


})

// app.get('/faves', (req,res)=>{
//   db.fave.findAll().then(response =>{
//     console.log(response)
//     res.render('/faves')
//   })
// })

// app.post('/faves', (req,res)=>{
  
//   db.fave.create({
//     where:{
//       title: req.body.title,
//       imdbid: req.body.imdbID
  
//     }
//   })
//   .then(function(response){
//     res.redirect('/faves')
//   })

// })
// The app.listen function returns a server handle
const port = process.env.PORT || 3000;
function listenForPort(){
  console.log(`Server is running on port ${port}`);
}

const server = app.listen(port, listenForPort);


// We can export this server to other servers like this
module.exports = server;
