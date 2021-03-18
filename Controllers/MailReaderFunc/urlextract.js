var Imap = require('imap'),
inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const cheerio = require('cheerio');
var emlformat = require('eml-format');
const path = require("path");
var http = require('http');
var urlExists = require('url-exists');



var host = ""
var infosFromThisEmail = {
    url:"",
    theTrueUrl:""

};
var scoreUrl = {};
var oldScoreUrl ={};


function getretailpossiblelinks(str){
    newstr = "";
           
    var compofslash = 1;
    for(var i = 0 ; i < str.length && compofslash < 4 ; i++){
        
        if(str[i] == '/'){
            compofslash ++;
            
        }
     
        newstr = str.substr(0, i+1);
       
    }
    
    return newstr;
}


// ---------------------------------->  add to the score url values


function urltoScoreEmail(url,scoreUrl,  isimgpng , isimgjpg){
    
    if(scoreUrl[url] == null){
        scoreUrl[url] = 1
    }
    else {
        if(isimgjpg == true){
            scoreUrl[url] - 10;
        }
        else if(isimgpng == true){
            scoreUrl[url] + 10;
        }
        else{
        scoreUrl[url] ++;
        }
    }
    
    return scoreUrl;
    
}






//  --------------------------------->   sort the url score


function sortProperties(obj)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
	  return b[1]-a[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}




async function apiurlexists(str, urlfortest) {


    urlExists(urlfortest,  function (err, exists)  {




        var parts1 = []
        parts1 = str.split('.')
        
        var firstpart1 = []
        firstpart1 = parts1[0].split("//")
        
        firstpart1[0]  = firstpart1[0] + "//"
        parts1.shift()
        
        parts1.unshift(firstpart1[1])
        parts1.unshift(firstpart1[0])
    
    
        if(exists == true){
            hostname = parts1[parts1.length-2]+"."+parts1[parts1.length-1]
          
            if(hostname.slice(-1) == '/'){
                hostname=hostname.slice(0, -1); 
            }
            console.log('this url exists and the hostname is ' + hostname)
           return   hostname;
        
        }
        else {
            var  url = ""
            var lastones = ""
    
            console.log('entered to the loop')
            console.log(parts1)
            
           for(var i = parts1.length-3; i > 0 ; i-- ){
    
                
                lastones =  parts1[i]+ "." + lastones;
               
    
    
                var stro = ""+lastones + parts1[parts1.length-2]+"."+parts1[parts1.length-1];

                
                !function outer(stro){
                urlExists((""+parts1[0]+lastones + parts1[parts1.length-2]+"."+parts1[parts1.length-1]),
                (err, exists1) => {
    
                    if(exists1 == true){
                        console.log("found after looping !!");
                        console.log(stro);
                        return stro
    
                    }
    
                })}(stro)
                
    
    
           }
          
        }
    
    })



}




//  ---------->   try to repaire the link
async  function repairethelink(str){
    



   //  str = "https://email.org.micolet.co.uk/";

    var parts = []
    parts = str.split('.')
    
    var firstpart = []
    firstpart = parts[0].split("//")
    
    firstpart[0]  = firstpart[0] + "//"
    parts.shift();
    
    parts.unshift(firstpart[1]);
    parts.unshift(firstpart[0]);
    
    

// repairing  and testing the link 


console.log(parts);
urlfortest  = parts[0] + parts[parts.length-2]+"."+parts[parts.length-1]

console.log("this is the url for test !! "+ parts[0] + parts[parts.length-2]+"."+parts[parts.length-1]);

hostname = ""



 return apiurlexists(str, urlfortest)
    /*if(parts.length <= 4 && !parts[1].includes("www") ){
        parts[1] = "www"
    }
    else if(!parts[1].includes("www")){
        for(i  = 1 ; i< parts.length - 2; i++){
            parts.splice(i,1)
            i--
        }
        parts.splice(1,0,"www")
    }
      */
   
    
}






// - - - - - - - - - - - - - - - - - - - - - >    read the links

async function readLinks(data) {
    const $ = cheerio.load(data);
   
    //$ bch tjiblek objet hatitha fil $ mtaa html ==> chtjiblek dom mtaak
    
  
    
    $('a').each((index,element)=>{
        var expression = /^(https?|http?|chrome):\/\/[^\s$.?#].[^\s]*$/gi;
        var regex = new RegExp(expression);
        str = $(element).attr('href').match(regex);
       
       
        
         //console.log(str);
        newstrk = ''
        if(str != null){
            newstrk = getretailpossiblelinks(str[0]);
             oldScoreUrl = urltoScoreEmail(str[0], oldScoreUrl);
        }
        // console.log(newstrk);
        
        if(newstrk!=''){
        scoreUrl  =  urltoScoreEmail(newstrk,scoreUrl);
       
        }
        
    
    });
    
   

   scoreUrl =  sortProperties(scoreUrl)
   oldScoreUrl =  sortProperties(oldScoreUrl)
    
   
   
   var repairedlink = await repairethelink(scoreUrl[0][0]).then(
       v=>  {console.log("hiiiiiiiiiiiiiiii" + v)
       return repairedlink}
   );
   
       
   

    
    //console.log('this is the old one    ---->  : '+   oldScoreUrl[0][0]);
    
     //console.log(repairedlink);

      //console.log(infosFromThisEmail);
     
     
}





function readEmail (str){

var eml = fs.readFileSync(str+".eml", "utf-8");
emlformat.read(eml, function(error, data) {
    if (error) return console.log(error);
   // fs.writeFileSync("sample.json", JSON.stringify(data, " ", 2));
        
//console.log("this is the repaired link from the last place in reademail ----------> " + readLinks(data['html']));
     readLinks(data['html']).then(
       (v) => { return v;}
   )
   
   
    
});

}
exports.readEmail = readEmail;


