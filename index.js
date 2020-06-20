const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  //connectionString: 'postgres://postgres:khoakhung@localhost/cmpt276'
  connectionString: process.env.DATABASE_URL
});

var app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/', (req, res) => res.render('pages/index'));

  app.get('/database', (req,res)=> {
    var getUsersQuery = `SELECT * FROM Person`;
    pool.query(getUsersQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows}
      res.render('pages/db', results);
    })
  });



  app.post('/adduser', (req,res)=>{
    console.log("post request for /adduser");
    var uid = req.body.uid;
    var uname = req.body.uname;
    var usize = req.body.usize;
    var uheight = req.body.uheight;
    var utype = req.body.utype;
    pool.query(`insert into Person values ($1,$2,$3,$4,$5)`, [uid,uname,usize,uheight,utype], (error, result) =>{
      if (error)
        res.end(error);
    })
    // pool.query(`SELECT * FROM Person`, (error, result) => {
    //   if (error)
    //     res.end(error);
    //   var results = {'rows': result.rows}
    //   res.render('pages/db', results);
    // })
  });


  //DELETE USER
  app.post('/deleteuser', (req,res) =>{
    console.log("post request for /deleteuser");
    var uid = req.body.uid;
    pool.query(`DELETE FROM PERSON WHERE id=$1`, [uid], (error, result) =>{
      if (error)
        res.end(error);
    })
  });

  //UPDATE USER
  app.post('/updateuser', (req,res) => {
    console.log("post request for /updateuser");
    var oldid = req.body.uid;
    var newid = req.body.newID;
    var newname = req.body.newName;
    var newsize = req.body.newSize;
    var newheight = req.body.newHeight;
    var newtype = req.body.newType;
    pool.query(`UPDATE Person SET id=$1, name=$2, size=$3, height=$4, type=$5 WHERE id=$6`, [newid,newname,newsize,
    newheight,newtype,oldid], (error, result) =>{
      if (error)
      res.end(error);
    })
  });



  app.get('/cmpt276/:id', (req,res)=>{
    var uid = req.params.id;
    console.log(req.params.id);
    //search the database using uid
    pool.query(`SELECT * FROM Person WHERE id=$1`, [uid], (error, result) =>{
      if (error)
        res.end(error);
      var results = {'rowSearch': result.rows}
      res.render('pages/db', results);
    })
    // res.send("got it!");
  });

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
