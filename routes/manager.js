var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
      user:'pidevpfetwin@gmail.com',
      pass: '123aziz456'
  
    }
  });

router.get('/', function(req, res, next) {
    var db =req.db;
    console.log(db)
   var collection = db.get('Manager');
    console.log(collection)
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
  });
  router.get('/:id', function(req, res, next) {
    var db =req.db;
    console.log(db)
   var collection = db.get('Manager');
    console.log(collection)
    collection.find({"_id":req.params.id},{},function(e,docs){
        res.json(docs);
    });
  });
  router.get('/login/:mail/:mdp', function(req, res, next) {
    var db =req.db;
    console.log(db)
   var collection = db.get('Manager');
    console.log(collection)
    collection.find({"mail": req.params.mail,"mdp":req.params.mdp},{},function(e,docs){
        res.json(docs);
    });
  });
  router.post('/create', function(req, res, next,) {
    var db =req.db;
    var collection = db.get('Manager');
    const a={
      nom:"aziz",
      prenom:"chaouch"
      ,mail:"mohamedaziz.chaouch@esprit.tn",
      mdp:"aziz",
      Boutique:"taraji-store"
      ,logoboutique:"a80.png",
      imgmanager:"aziz.png"
    }
    collection.insert(req.body,function(e,result){
      try{
        console.log(req.body.mail)
        const url =`http://localhost:3030/managers/confirmation/${req.body._id}`
        transporter.sendMail({
          to: req.body.mail,
          subject :'Confirmez-vous votre compte',
          html:`cliquer-vous sur le lien pour confimer votre compte <a href="${url}">${url}</a>`
          
  
        }, function(err,dat){
          if (err){
            console.log("erreur",err)
          }else {
            console.log("okkk")
          }
        });
  
      }catch(e){
        console.log(e)
  
      }
       
       res.send(req.body);
   });
  
  
  
  });
  
  router.get('/confirmation/:id', function(req, res, next) {
    var db =req.db;
    var collection = db.get('Manager');
  
    var ddd ={};
    console.log()
    
    collection.find({"_id":req.params.id},{},function(e,docs){
      ddd =docs;
      console.log("tst1 ",docs.nom);
      console.log("tst2",docs[0].nom);
      var a={
        nom:  docs[0].nom,
        prenom:  docs[0].prenom
        ,mail:  docs[0].mail,
        mdp: docs[0].mdp,
        Boutique: docs[0].Boutique
        ,logoboutique: docs[0].logoboutique,
        imgmanager: docs[0].imgmanager,
        etat: "A"
      }
      docs.etat="aA"
      collection.findOneAndUpdate({"_id":req.params.id}, a, function(err) { // 5
        if(err) {
          console.log("test3",docs)
          console.log("tst4",docs[0]);
            return res.send(500, err);
        }
  
        res.json(a);
    });
      
  });
       
    });
  
    router.get('/modiflogo/:id/:logo', function(req, res, next) {
      var db =req.db;
      var collection = db.get('Manager');
    
      var ddd ={};
      console.log()
      
      collection.find({"_id":req.params.id},{},function(e,docs){
        ddd =docs;
        console.log("tst1 ",docs.nom);
        console.log("tst2",docs[0].nom);
        var a={
          nom:  docs[0].nom,
          prenom:  docs[0].prenom
          ,mail:  docs[0].mail,
          mdp: docs[0].mdp,
          Boutique: docs[0].Boutique
          ,logoboutique: req.params.logo,
          imgmanager: docs[0].imgmanager,
          etat: "A"
        }
        docs.etat="aA"
        collection.findOneAndUpdate({"_id":req.params.id}, a, function(err) { // 5
          if(err) {
            console.log("test3",docs)
            console.log("tst4",docs[0]);
              return res.send(500, err);
          }
    
          res.json(a);
      });
        
    });
       
      });
  
      router.get('/modifprofil/:id/:profil', function(req, res, next) {
        var db =req.db;
        var collection = db.get('Manager');
      
        var ddd ={};
        console.log()
        
        collection.find({"_id":req.params.id},{},function(e,docs){
          ddd =docs;
          console.log("tst1 ",docs.nom);
          console.log("tst2",docs[0].nom);
          var a={
            nom:  docs[0].nom,
            prenom:  docs[0].prenom
            ,mail:  docs[0].mail,
            mdp: docs[0].mdp,
            Boutique: docs[0].Boutique
            ,logoboutique: docs[0].logoboutique,
            imgmanager: req.params.profil,
            etat: "A"
          }
          docs.etat="aA"
          collection.findOneAndUpdate({"_id":req.params.id}, a, function(err) { // 5
            if(err) {
              console.log("test3",docs)
              console.log("tst4",docs[0]);
                return res.send(500, err);
            }
      
            res.json(a);
        });
          
      });
         
        });
  

module.exports = router;