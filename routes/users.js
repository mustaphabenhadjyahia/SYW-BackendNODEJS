var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*google login*/
router.post('/googleLogin',(req,res)=> {
    User.findOne({googleId: req.body.googleId}).then(user => {
        if (user) {
            console.log("user already exists" + user);
            res.json(user);
        } else {
            User.findOne({email: req.body.email}).then(user => {
                if (user) {
                    user.googleId = req.body.googleId;
                    user.save();
                    res.json(user);
                } else {
                    new User({
                        username: req.body.name,
                        googleId: req.body.googleId,
                        email: req.body.email,
                        picture: req.body.imageUrl,
                    }).save().then((newUser) => {
                        console.log('new User created : ' + newUser);
                        res.json(newUser);
                    })
                }
            })

        }
    })
});

router.get('/delete/:id', function(req, res, next) {
  var db =req.db;
  var collection = db.get('Produit');
  collection.remove({"_id":req.params.id},function(e,result){
	//test mustapha sjsj
	 
  });
});
router.get('/produits', function(req, res, next) {
  var db =req.db;
  
 var collection = db.get('products');
 
  collection.find({},{},function(e,docs){
	  res.json(docs);
  });
});

router.get('/produits/:cat', function(req, res, next) {
  var db =req.db;
 
 var collection = db.get('Produit');
  
  collection.find({"categories.name": req.params.cat},{},function(e,docs){
	  res.json(docs);
  })
});

router.get('/produits/date/:d', function(req, res, next) {
  var db =req.db;

 var collection = db.get('Produit');

  let q= {$regex:`2020$`}
  collection.find({"createdAt": {$regex:`${req.params.d}`}},{},function(e,docs){
	  res.json(docs);
  })
});
//stat
router.get('/produits/state/cat', function(req, res, next) {
  var db =req.db;
  var data= []
 var collection = db.get('Produit');
  
  console.log("num1")
 collection.aggregate(
  [
      { "$group": {
          "_id": "$categories.name",
          "count": { "$sum": 1 }
      }}
  ],
  function(err,docs) {
    console.log("numm2")
     if (err) 
     {console.log("num3");
       console.log(err);}
       else { 
        for (let i = 0; i < docs.length; i++){
          data.push({type :docs[i]._id[0],value:docs[i].count })
        }
         console.log("num4")
          console.log( "coucou",data );}
          res.json(data)
   
  }
)
});

router.get('/produits/state/size', function(req, res, next) {
  var db =req.db;
  var data= []
 var collection = db.get('Produit');
  
  console.log("num1")
 collection.aggregate(
  [
      { "$group": {
          "_id": "$size",
          "count": { "$sum": 1 }
      }}
  ],
  function(err,docs) {
    console.log("numm2")
     if (err) 
     {console.log("num3");
       console.log(err);}
       else { 
        for (let i = 0; i < docs.length; i++){
          data.push({type :docs[i]._id[0],value:docs[i].count })
        }
         console.log("num4")
          console.log( "coucou",data );}
          res.json(data)
   
  }
)
});







router.get('/produits/state/color', function(req, res, next) {
  var db =req.db;
  var data =[]
  
 var collection = db.get('Produit');
  
  console.log("num1")
 collection.aggregate(
  [
      { "$group": {
          "_id": "$colors.name",
          "count": { "$sum": 1 }
      }}
  ],
  function(err,docs) {
    console.log("numm2")
     if (err) 
     {console.log("num3");
       console.log(err);}
       else { 
         console.log("num4")
          console.log( docs );}
          res.json(docs)
   
  }
)
});

router.get('/produits/state/date', function(req, res, next) {
  var db =req.db;
  
 var collection = db.get('Produit');
  var data=[]
  console.log("num1")
 collection.aggregate(
  [
      { "$group": {
          "_id": "$createdAt",
          "count": { "$sum": 1 }
      }}
  ],
  function(err,docs) {
    console.log("numm2")
     if (err) 
     {console.log("num3");
       console.log(err);}
       else { 
        for (let i = 0; i < docs.length; i++){
          data.push({datee:docs[i]._id.substring(0,10),"nbr de produit vendue":docs[i].count})
        }
         console.log("num4")
          console.log( docs );}
          res.json(data)
   
  }
)
});

router.get('/produits/state/price', function(req, res, next) {
  var tab =[{
    interval :"[0,30]",
    count:0
  },
  {
    interval :"[30,60]",
    count:0
  },
  { interval :"[60,100]",
    count:0},
    { interval :"[100,200]",
      count:0},
      { interval :"[200,400]",
        count:0},
        { interval :"[400,1000]",
          count:0}
  ]
  var db =req.db;
  
  var collection = db.get('Produit');
  
   collection.find({},{},function(e,docs){
    for (let i = 0; i < docs.length; i++){
      if (parseFloat(docs[i].price)>0 && parseFloat(docs[i].price)<30){
        tab[0].count=tab[0].count+1 ;
      } else if (parseFloat(docs[i].price)>30 && parseFloat(docs[i].price)<60){
        tab[1].count=tab[1].count+1 ;
      }  else if (parseFloat(docs[i].price)>60 && parseFloat(docs[i].price) <100){
        tab[2].count=tab[2].count+1 ;
      } else if (parseFloat(docs[i].price)>100 && parseFloat(docs[i].price)<200){
        tab[3].count=tab[3].count+1 ;
      }else if (parseFloat(docs[i].price)>200 && parseFloat(docs[i].price) <400){
        tab[4].count=tab[4].count+1 ;
      }else {
        tab[5].count=tab[5].count+1 ;

      }
     

    }
    res.json(tab.sort(function (a, b) {
      return b.count - a.count;
    }));
   });

});

//algo de prediction
async function agg(coefcategories,coefcategories_tri, collection,co_cat ){
  return new Promise((resolve, reject) => {
    collection.aggregate( // remplir categories_tri 
      [
          { "$group": {
              "_id": "$categories.name",
              "count": { "$sum": 1 }
          }}
      ],
      function(err,doc) {
        console.log("numm2")
         if (err) 
         {console.log("num3");
           console.log(err);}
           else { 
            for (let i = 0; i < doc.length; i++){
              coefcategories.push({type :doc[i]._id[0],value:doc[i].count , })
            }
            coefcategories.sort(function (a, b) {
              return b.value - a.value;
            })
            var s =5 ;
            for (let i = 0; i < coefcategories.length; i++){
              if( i>0 && coefcategories[i].value!=coefcategories[i-1].value)
              { co_cat=co_cat-10}
              coefcategories_tri.push({type :coefcategories[i].type,value:coefcategories[i].value ,coef : co_cat })
              
            }
             console.log("num4")
              console.log( "coucou tab coef categorie trier",coefcategories_tri );
              resolve(coefcategories_tri);
            
            }
           //   res.json(data)
       
      }
    )

});
}

async function agg2 (coefcolors,coefcolors_tri ,collection,co_color){
  return new Promise((resolve, reject) => {
    
    collection.aggregate( // remplir tab coefcolor_tri
      [
          { "$group": {
              "_id": "$colors.name",
              "count": { "$sum": 1 }
          }}
      ],
      function(err,doccouleur) {
        console.log("numm2")
         if (err) 
         {console.log("num3");
           console.log(err);}
           else { 
            for (let i = 0; i < doccouleur.length; i++){
              coefcolors.push({couleur :doccouleur[i]._id[0],value:doccouleur[i].count , })
            }
            coefcolors.sort(function (a, b) {
              return b.value - a.value;
            })
            for (let i = 0; i < coefcolors.length; i++){
             
              if( i>0 && coefcolors[i].value!=coefcolors[i-1].value)
               {co_color=co_color-10}

               coefcolors_tri.push({type :coefcolors[i].couleur,value:coefcolors[i].value ,coef : co_color })
            }

             console.log("num4")
              console.log( "tab des coef  couleur trier", coefcolors_tri );}
              resolve(coefcolors_tri);
       
      }
    )
    

});
  
}


async function agg3 (coefPrice,coefPrice_tri,tab ,collection,co_prix){
  return new Promise((resolve, reject) => {
    collection.find({},{},function(e,docs){
      for (let i = 0; i < docs.length; i++){
        if (parseFloat(docs[i].price)>0 && parseFloat(docs[i].price)<30){
          tab[0].count=tab[0].count+1 ;
        } else if (parseFloat(docs[i].price)>30 && parseFloat(docs[i].price)<60){
          tab[1].count=tab[1].count+1 ;
        }  else if (parseFloat(docs[i].price)>60 && parseFloat(docs[i].price) <100){
          tab[2].count=tab[2].count+1 ;
        } else if (parseFloat(docs[i].price)>100 && parseFloat(docs[i].price)<200){
          tab[3].count=tab[3].count+1 ;
        }else if (parseFloat(docs[i].price)>200 && parseFloat(docs[i].price) <400){
          tab[4].count=tab[4].count+1 ;
        }else {
          tab[5].count=tab[5].count+1 ;
  
        }
       
  
      }
      for (let i = 0; i < tab.length; i++){
        coefPrice.push({intervale :tab[i].interval , value:tab[i].count  })
      }
      coefPrice.sort(function (a, b) {
        return b.value - a.value;
      })
      for (let i = 0; i < coefPrice.length; i++){
             
        if( i>0 && coefPrice[i].value!=coefPrice[i-1].value)
         {co_prix=co_prix-10}
        if(coefPrice[i].value==0){
          co_prix = 0
        }
         coefPrice_tri.push({type :coefPrice[i].intervale,value:coefPrice[i].value ,coef : co_prix })
      }
    
    
           
           
         //  console.log(produit)
        
       console.log("tableau des prix trier " ,coefPrice_tri)
       resolve(coefPrice_tri)
     })    
    

});
  
}
async function agg_fin(coefPrice_tri,coefcategories_tri, coefcolors_tri,produit ){
  return new Promise((resolve, reject) => {
    for(let i = 0 ; i< produit.length ;i++){
      for(let k=0;k<coefcolors_tri.length; k++){
        if(produit[i].color==coefcolors_tri[k].type){
          produit[i].score=produit[i].score+coefcolors_tri[k].coef
         // console.log("test score apres couleur",produit[i].score)
        }
      
      
      }  
for(let j=0;j<coefcategories_tri.length; j++){
          if(produit[i].categories==coefcategories_tri[j].type){
            produit[i].score=produit[i].score+coefcategories_tri[j].coef
           // console.log("test final ",coefcategories_tri[j].type,produit[i].score ,produit[i].score+coefcategories_tri[j].coef);
          }
        
        
      }    
    for(let l=0;l<coefPrice_tri.length; l++){
     // console.log(parseFloat(produit[i].prix))
      if(parseFloat(produit[i].prix)>parseFloat(coefPrice_tri[l].type.substring(1,4))&& parseFloat(produit[i].prix)< parseFloat(coefPrice_tri[l].type.substring(5,10) )){
        produit[i].score=produit[i].score+coefPrice_tri[l].coef
       // console.log("test score apres prix",produit[i].score)
       // maaneha hen tal9a nrml kol chay shih ? ouiii hadha el ajout llekhreniii ook trah affichi hne akhanchoufou shih
       //nafichi tableau produit maneha ?
       console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
       console.log(produit[i].score)
      }
    //  console.log("je suis laaa ")
    
    
    }  
         
         }
       
         resolve(produit)

});
}


router.get('/scoree/:p1/:p2/:p3',  async function(req, res, next) {
   var coefcategories=[];
   var coefcategories_tri=[];
   var coefcolors=[];
   var coefcolors_tri=[];
   var coefPrice=[];
   var coefPrice_tri=[];
   var produit=[];
   //intitialisation des coef par rapport au choix 
  var co_cat=0
 var  co_prix=0
 var  co_color=0
if (req.params.p1== "cat"){
  co_cat= 50;
}
if (req.params.p2== "cat"){
  co_cat= 40;
}
if (req.params.p3== "cat"){
  co_cat= 30;
}
if (req.params.p1== "prix"){
  co_prix= 50;
}
if (req.params.p2== "prix"){
  co_prix= 40;
}
if (req.params.p3== "prix"){
  co_prix= 30;
}
if (req.params.p1== "color"){
  co_color= 50;
}
if (req.params.p2== "color"){
  co_color= 40;
}
if (req.params.p3== "color"){
  co_color= 30;
}
var tab =[{
  interval :"[000,030]",
  count:0
},
{
  interval :"[030,060]",
  count:0
},
{ interval :"[060,100]",
  count:0},
  { interval :"[100,200]",
    count:0},
    { interval :"[200,400]",
      count:0},
      { interval :"[400,1000]",
        count:0}
]
  var db =req.db;
  var collection = db.get('Produit');
 
   collection.find({},{}, async function(e,docs){  // remplir tableau des produit avec initialisation des scores 
    for (let i = 0; i < docs.length; i++){
      produit.push({
        id: docs[i]._id,
        categories: docs[i].categories[0].name,
        color : docs[i].colors[0].name,
        prix : docs[i].price,
        image:docs[i].image.name,
        name:docs[i].name,
        size:docs[i].size,
        score : 0
      })
    }
   
    coefcategories_tri = await agg(coefcategories,coefcategories_tri,collection,co_cat)
      console.log("hahahahahahahaah"+coefcategories_tri)
      console.log(coefcategories_tri)
     coefcolors_tri= await agg2(coefcolors,coefcolors_tri,collection,co_color)
     console.log("*****************couleur***********************")
     console.log(coefcolors_tri)
     console.log("*****************couleur***********************")
     coefPrice_tri= await agg3(coefPrice,coefPrice_tri,tab,collection,co_prix)
     console.log("*****************prixxx***********************")
     console.log(coefPrice_tri)
     console.log("*****************prixxx***********************")

     coefPrice_tri= await agg_fin(coefPrice_tri,coefcategories_tri,coefcolors_tri,produit)
     
     produit.sort(function (a, b) {
      return b.score - a.score;
    })
    var top3=[]
    for(let i=0;i<3;i++){
      top3.push(produit[i])
    }
    console.log("*****************produit final***********************")
     console.log(produit)
     console.log("*****************produitfinal***********************")
     
  
         res.json(top3)

  
   
   })
});


module.exports = router;
