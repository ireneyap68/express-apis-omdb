const express = require('express')
const router = express.Router();
const axios = require('axios');

const db = require('../models');
const { response } = require('express');

let API_KEY = process.env.API_KEY;

//when someone hit this route, get the database of each fave
router.get('/', (req,res)=>{
  db.fave.findAll()
  .then(response =>{
    console.log(response)
    res.render('faves', {faves: response})
  })
  .catch(err =>{
      console.log('error',err)
  })
})

router.post('/', (req,res)=>{
    let formData = req.body;
    db.fave.findOrCreate({
        where: {title: formData.title},
        defaults: {imdbid: formData.imdbid}
        
    })
    .then(([newFave, created]) =>{
        console.log(`Was this created? ${created}`);
        res.redirect('faves');
    })

    .catch(err => {
        console.log('error',err);
        res.send('Sorry, no data')
    })
});

module.exports = router;