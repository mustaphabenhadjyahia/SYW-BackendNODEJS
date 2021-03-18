const path = require("path");
var urlparser = require("./MailReaderFunc/urlextract")
var infoItemparser = require("./MailReaderFunc/infos_of_items")
var gettherestofinfosfromtheImage = require("./MailReaderFunc/getrestoftheinfosfromtheimage")
var gis = require('g-i-s');


var ImageClassifier = require("image-classifer");
const email_retails = []
exports.getInfosFromEmail = (req, resp, next) => {

    //urlparser.readEmail(path.resolve(__dirname,"../public/EmailForTest/Fwd_ Order confirmation"))
    
    resp.json(urlparser.readEmail(path.resolve(__dirname,"../public/EmailForTest/1")));
}
exports.getItemInfosFromEmail = (req, resp, next) => {

    //urlparser.readEmail(path.resolve(__dirname,"../public/EmailForTest/Fwd_ Order confirmation"))
    var all = [];

    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/1")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/5")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/3")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/4")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/2")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/6")) )
    all.push(infoItemparser.readiteminfosEmail(path.resolve(__dirname,"../public/EmailForTest/7")) )
    console.log({"data":all})
    resp.json({"data":all});


}
exports.getnbofRetailsEmails = (req, resp, next) => {

    resp.json({"nbConfirmationEmails":3});


}
const getimgs = (opts) => {
    return new Promise((resolve, reject) => {
        gis(opts,  (err, result) => {
            

            resolve(JSON.stringify(result, null, '  '));
        });
    });
}
async function getImagesResponse(req, resp, next){

    req.setTimeout(0)

    var opts = {
        searchTerm: 'Arty gold-plated glass ring',
        
              };
     
        console.log(req.body.transaction)
        var  data = await gettherestofinfosfromtheImage.gettherestofinfosfromtheImage( req.body.transaction)
      
            resp.json({"data": data})
 
}
exports.getImagesResponse =  getImagesResponse  
exports.getinfosFromImage = (req, resp, next) => {

}