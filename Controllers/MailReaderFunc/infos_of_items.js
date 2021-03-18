var Imap = require('imap'),
inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const cheerio = require('cheerio');
var emlformat = require('eml-format');
const imageExists = require('image-exists');
const path = require("path");
var http = require('http');
const axios = require('axios');
const tf = require('@tensorflow/tfjs');
var mobilenet = require('@tensorflow-models/mobilenet') ;
//const tfnode = require('@tensorflow/tfjs-node');
const imageGet = require('get-image-data');
const ImageData = require('@canvas/image-data')





 function readLinks(data, numRetailEmail) {
    const $ = cheerio.load(data);
   
   
    /*
    let response = await axios.get('https://www.america-today.com/dw/image/v2/BBPV_PRD/on/demandware.static/-/Sites-at-master-catalog/default/dw15aae594/images/product/tshirt-champion-girls-pink-3252543003-850-f.jpg?sw=1200&sh=1200&sm=fit&sfrm=png');
let img = new Buffer(response.data, "utf-8")
    
        // Load the model.
        const model = await mobilenet.load();
        
        // Classify the image.
        const predictions = await model.classify(img);
        
        console.log('Predictions: ');
        console.log(predictions);
*/

/*

const readImage = path => {
    const imageBuffer = fs.readFileSync(path);
    const tfimage = tfnode.node.decodeImage(imageBuffer);
    return tfimage;
  }

  const imageClassification = async path => {
    const image = readImage(path);
    const mobilenetModel = await mobilenet.load();
    const predictions = await mobilenetModel.classify(image);
    console.log('Classification Results:', predictions);
  }

  imageClassification(path.resolve(__dirname,"../../public/images/m.jpg"));
*/



//const img = await loadLocalImage(path.resolve(__dirname,"../../public/images/m.jpg"));



    
    
 /*
imageExists("http://www.net-a-porter.com/alfresco/nap/webAssets/email/order-confirmation/bottom-promo.jpg?v=1.0", function(exists) {
    if (exists) {
      console.log("it's alive!");
    }
    else {
      console.log("oh well");
    }
  });

*/


        var imgs = []
    $('*').each(function(){ 
        var backImg;
    
      

        if ($(this).is('img')) {
            
            
            imgs.push($(this).attr('src'));

            
      
    
        }else if($(this).is('input[type=image]')){
            imgs.push($(this).attr('src'));
        } 
        else {

            backImg = $(this).css('background-image');
            
            if (backImg)  imgs.push(backImg);;
        }
    })
    imgs = imgs.filter((str)=>{
            return !str.includes('png');
    });



    imgs = imgs.filter(function(elm) {
        return elm != null;
    }).filter((str)=>{
            return str.includes('jpg') ;
    });


    
       return imgs
        
       /*
        
    var imgsfromtd = []


    $('tr').each(function(){ 
        var image = "" ;
        var capt = 0;
        $(this).children().each(function (i) {

        
           
           
      
           
            if ($(this).children('img')) {
                
                $(this).children('img').each(function () {
                    image = $(this).attr('src')
                    imgsfromtd.push(image);
                   
                    

                });
            
                //console.log($(this).html())
            }
            
            
        else if($(this).children('input[type=image]')){
                

                image = $(this).children('input[type=image]').attr('src');
               
                imgsfromtd.push(image);
            } 
            

            
    
    })





})


  

    imgsfromtd = imgsfromtd.filter(function(elm) {
        return elm != null;
    }).filter((str)=>{
        return str.includes('jpg') ;
    });

    console.log(imgsfromtd);
   
    
   




    var imgsfromth = []
    $('th').each(function(){ 
        

        $(this).children().each(function (i) {

        
            var backImg;
    
      
           
            if ($(this).children('img')) {
                
              

                imgsfromth.push($(this).children('img').attr('src'));
          
        
            }
            
            
        else if($(this).children('input[type=image]')){
               

                imgsfromth.push($(this).children('input[type=image]').attr('src'));
            } 
            



    
    })})
   
    imgsfromth = imgsfromth.filter(function(elm) {
        return elm != null;
    }).filter((str)=>{
            return str.includes('jpg') ;
    });

    console.log(imgsfromth);
    
     
    return imgsfromtd.concat(imgsfromth)*/
     
}





function readiteminfosEmail (str,numRetailEmail){

var eml = fs.readFileSync(str+".eml", "utf-8");
var imgs;
emlformat.read(eml, function(error, data) {
    if (error) return console.log(error);
      

      imgs = readLinks(data['html'],numRetailEmail)
      console.log("fdfuodqhfpsqdoifjqpdiofsk"+imgs)
   
   
    
});
return imgs;
}

exports.readiteminfosEmail = readiteminfosEmail;



