inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const cheerio = require('cheerio');
var emlformat = require('eml-format');
const path = require("path");
var rp = require('request-promise');
var request = require('request');
var esprima = require('esprima');
var sizeOf = require('image-size');
var url = require('url');
var http = require('http');
var https = require('https');
var probe = require('probe-image-size');
const requestImageSize = require('request-image-size');
var gis = require('g-i-s');
var toHex = require('colornames')

var ImageClassifier = require("image-classifer");

//test 

async function getitems_in_array(emails){
       var infos_about_items_from_tables = []
      for(var i =  0 ; i < emails.length ; i++)
      {
        index  = i;
          infos_about_items_from_tables.push({"mailnum":emails[i].mailnum, "itemskeys":[] ,"items_infos":[]})

        var eml = fs.readFileSync(path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+emails[i].mailnum+".eml", "utf-8");
          
        emlformat.read(eml, async function(error, data) {
          const $ = cheerio.load(data['html'])
          
            console.log('/**********************************************************/')
            



              var thetr = "" ;
            $("tr").each(function(){
               var captr = $(this)
              $(this).children("td").each(function() {
                if($(this).text().toLowerCase() == "price" || $(this).text().toLowerCase() == "size" || $(this).text().toLowerCase() == "price" || $(this).text().toLowerCase() == "prix"){
                  console.log("email num : "+emails[i].mailnum)
                  console.log("td")
                  thetr = $(this);
                }
              })

              $(this).children("th").each(function() {
                if($(this).text().toLowerCase() == "price" || $(this).text().toLowerCase() == "size" || $(this).text().toLowerCase() == "price" || $(this).text().toLowerCase() == "prix" ){
                  console.log("email num : "+emails[i].mailnum)
                  console.log("th")
                  thetr = $(this);
                }
              })
            })


            //console.log(thetr)
              if(thetr != ""){
                     //console.log("nb of tr  : "+thetr.parent().parent().children("tr").html())
                
                     var has_td = false;
              thetr.parent().parent().children("tr").each(function(){
                
                    if($(this).find("td").length != 0 ){
                      has_td = true;
                    }
                //  console.log($(this).html())             
              })

              console.log("it has td  : "  +  has_td)
              var keys = []
                  if(has_td ){

                     var allitems = []
                    thetr.parent().parent().children("tr").each(function(i){
                      var item = {}
                        if(i == 0 ){
                            
                          
                          
                          $(this).children("th").each(function(i){


                              if($(this).text().toLowerCase().includes("art") 
                              ||$(this).text().toLowerCase().includes("ref") )  {
                                keys["reference"]= i
                              }
                              else if($(this).text().toLowerCase().includes("desc")){
                                keys["description"]= i
                              }else if($(this).text().toLowerCase().includes("siz")){
                                keys["size"]= i
                              }else if($(this).text().toLowerCase().includes("col")){
                                keys["color"]= i
                              }else if($(this).text().toLowerCase().includes("qt")
                              ||$(this).text().toLowerCase().includes("qua") ){
                                keys["quantite"]= i
                              }else if($(this).text().toLowerCase().includes("pri")
                              ||$(this).text().toLowerCase().includes("amou")){
                                keys["price"]= i
                              }else if($(this).text().toLowerCase().includes("pro")){
                                keys["produit"]= i
                              }
                            
                            
                            
                            }) 


                             $(this).children("td").each(function(i){
                              
                              if($(this).text().toLowerCase().includes("art") 
                              ||$(this).text().toLowerCase().includes("ref") )  {
                                keys["reference"]= i
                              }
                              else if($(this).text().toLowerCase().includes("desc")){
                                keys["description"]= i
                              }else if($(this).text().toLowerCase().includes("siz")){
                                keys["size"]= i
                              }else if($(this).text().toLowerCase().includes("col")){
                                keys["color"]= i
                              }else if($(this).text().toLowerCase().includes("qt")
                              ||$(this).text().toLowerCase().includes("qua") ){
                                keys["quantite"]= i
                              }else if($(this).text().toLowerCase().includes("pri")
                              ||$(this).text().toLowerCase().includes("amou")){
                                keys["price"]= i
                              }else if($(this).text().toLowerCase().includes("pro")){
                                keys["produit"]= i
                              }
                            
                            
                            
                            }) 
  
                        }else{
                          var src = ""
                          $(this).children("td").each(function(i){
                            
                            var img = $(this).find("img")
                            var input  = $(this).find('input[type=image]')

                            
                            if(img.attr('src') != undefined){
                              src = img.attr('src')
                            }
                            if(input.attr('src') != undefined){
                              src = input.attr('src')
                            }




                            item.src = src
                            if(item.src== undefined){
                              keys["src"] = src;
                              item.src = src
                              //console.log("src : "+ src)
                              }
                              if(keys["reference"] !== undefined){
                            if( keys["reference"] == i){
                                  console.log("reference  : "+ $(this).text())
                                  item.reference = $(this).text();
                            }}
                            if(keys["description"] !== undefined){
                              if( keys["description"] == i){
                                    console.log("description  : "+ $(this).text())
                                    item.description = $(this).text();
                              }}
                              if(keys["size"] !== undefined){
                                if( keys["size"] == i){
                                      console.log("size  : "+ $(this).text())
                                      item.size = $(this).text();
                                }}
                            if(keys["color"] !== undefined){
                              if( keys["color"] == i){
                                    console.log("color  : "+ $(this).text())
                                    item.color = $(this).text();
                              }}
                              if(keys["quantite"] !== undefined){
                                if( keys["quantite"] == i){
                                      console.log("quantite  : "+ $(this).text())
                                      item.quantite = $(this).text();
                                }}
                                if(keys["price"] !== undefined){
                                  if( keys["price"] == i){
                                        console.log("price  : "+ $(this).text())
                                        item.price = $(this).text();
                                  }}
                                  if(keys["produit"] !== undefined){
                                    if( keys["produit"] == i){
                                          console.log("produit  : "+ $(this).text())
                                          item.produit = $(this).text();
                                    }}


                          })

                          allitems.push(item)
                        }
                               
                })
                      
               
                if(allitems.length != 0){
                infos_about_items_from_tables[index].itemskeys = keys
                infos_about_items_from_tables[index].items_infos = allitems
                console.log(infos_about_items_from_tables[index])
                }
                  }
                  else{
                    //console.log( thetr.parent().parent().children("tr").parent().parent().children("tbody").children("tr").html())


                    thetr.parent().parent().children("tr").each(function(i){
                      if(i == 0 ){
                          
                        
                        
                        $(this).children("th").each(function(i){


                            if($(this).text().toLowerCase().includes("art") 
                            ||$(this).text().toLowerCase().includes("ref") )  {
                              keys["reference"]= i
                            }
                            else if($(this).text().toLowerCase().includes("desc")){
                              keys["description"]= i
                            }else if($(this).text().toLowerCase().includes("siz")){
                              keys["size"]= i
                            }else if($(this).text().toLowerCase().includes("col")){
                              keys["color"]= i
                            }else if($(this).text().toLowerCase().includes("qt")
                            ||$(this).text().toLowerCase().includes("qua") ){
                              keys["quantite"]= i
                            }else if($(this).text().toLowerCase().includes("pri")
                            ||$(this).text().toLowerCase().includes("amou")){
                              keys["price"]= i
                            }else if($(this).text().toLowerCase().includes("pro")){
                              keys["produit"]= i
                            }
                          
                          
                          
                          })

                          $(this).children("td").each(function(i){
                              
                            if($(this).text().toLowerCase().includes("art") 
                            ||$(this).text().toLowerCase().includes("ref") )  {
                              keys["reference"]= i
                            }
                            else if($(this).text().toLowerCase().includes("desc")){
                              keys["description"]= i
                            }else if($(this).text().toLowerCase().includes("siz")){
                              keys["size"]= i
                            }else if($(this).text().toLowerCase().includes("col")){
                              keys["color"]= i
                            }else if($(this).text().toLowerCase().includes("qt")
                            ||$(this).text().toLowerCase().includes("qua") ){
                              keys["quantite"]= i
                            }else if($(this).text().toLowerCase().includes("pri")
                            ||$(this).text().toLowerCase().includes("amou")){
                              keys["price"]= i
                            }else if($(this).text().toLowerCase().includes("pro")){
                              keys["produit"]= i
                            }
                          
                          
                          
                          }) 
                        
                        
                        }})


                        console.log(keys)



                        var allitems = []
                        thetr.parent().parent().children("tr").parent().parent().children("tbody")
                        .children("tr").each(function() {
                          var src = ""
                          var item = {}
                          $(this).children("td").each(function(i){


                              var img = $(this).find("img")
                              var input  = $(this).find('input[type=image]')

                              
                              if(img.attr('src') != undefined){
                                src = img.attr('src')
                              }
                              if(input.attr('src') != undefined){
                                src = input.attr('src')
                              }
                              item.src = src
                              if(item.src== undefined){
                              keys["src"] = src;
                              item.src = src
                              //console.log("src : "+ src)
                              }

                          if(keys["reference"] !== undefined){
                            if( keys["reference"] == i){
                                  console.log("reference  : "+ $(this).text())
                                  item.reference = $(this).text();
                            }}
                            if(keys["description"] !== undefined){
                              if( keys["description"] == i){
                                    console.log("description  : "+ $(this).text())
                                    item.description = $(this).text();
                              }}
                              if(keys["size"] !== undefined){
                                if( keys["size"] == i){
                                      console.log("size  : "+ $(this).text())
                                      item.size = $(this).text();
                                }}
                            if(keys["color"] !== undefined){
                              if( keys["color"] == i){
                                    console.log("color  : "+ $(this).text())
                                    item.color = $(this).text();
                              }}
                              if(keys["quantite"] !== undefined){
                                if( keys["quantite"] == i){
                                      console.log("quantite  : "+ $(this).text())
                                      item.quantite = $(this).text();
                                }}
                                if(keys["price"] !== undefined){
                                  if( keys["price"] == i){
                                        console.log("price  : "+ $(this).text())
                                        item.price = $(this).text();
                                  }}
                                  if(keys["produit"] !== undefined){
                                    if( keys["produit"] == i){
                                          console.log("produit  : "+ $(this).text())
                                          item.produit = $(this).text();
                                    }}
                                  
                                  
                                  })


                                  allitems.push(item)

                        })





                        if(allitems.length != 0){
                          infos_about_items_from_tables[index].itemskeys = keys
                          infos_about_items_from_tables[index].items_infos = allitems
                          console.log(infos_about_items_from_tables[index])
                          }






                    
                  }










            }


                /* *************************************  */



        });


      }



console.log("**************** items *************")
        for(var  i  = 0 ; i< infos_about_items_from_tables.length ; i++){


            for(var j = 0 ; j < infos_about_items_from_tables[i].items_infos.length ; j++){
                   if(j!=0  ){
                    console.log((Object.keys(infos_about_items_from_tables[i].items_infos[j]).length))

                     if(Object.keys(infos_about_items_from_tables[i].items_infos[j]).length<
                     Object.keys(infos_about_items_from_tables[i].items_infos[j-1]).length &&
                     Object.keys(infos_about_items_from_tables[i].items_infos[j]).length <= 2){
                      console.log("**************** entered to condition and eliminated one  posssible wrong data *************")
                      infos_about_items_from_tables[i].items_infos.splice(j,1) 
                      j--;
                     }
                   }
              console.log(infos_about_items_from_tables[i].items_infos[j])

            }
            
              for(var it = 0 ; it < emails.length ; it++){
                
                if(infos_about_items_from_tables[i].mailnum == emails[it].mailnum ){
                  console.log(" ------------------->with images<-------------------")
                  
                  for(var j = 0 ; j< emails[it].mainImgsrc.length ;j++){
                      if(emails[it].linkToItem[it] != ""){
                        console.log('get the image from  the link !')
                        console.log(emails[it].linkToItem[j])
                        if(emails[it].linkToItem[j] != undefined){
                          var res = await getfromthelinkmoreImages(emails[it].linkToItem[j]);
                          console.log("this is the response:")
                          console.log(res)
                          infos_about_items_from_tables[i].items_infos.push({"src": emails[it].mainImgsrc[j],"moreimgs":res})
                        }
                      }
                  }

                
                 console.log(" -------------------><-------------------")
                }
              }
            
             
        }
        infos_about_items_from_tables = cleanRedendancy(infos_about_items_from_tables)
        infos_about_items_from_tables = await getmoreimgsfromdescriptionororproduct(infos_about_items_from_tables)
        
        infos_about_items_from_tables = await descriptionextracter(infos_about_items_from_tables)

        
        for(var  i  = 0 ; i< infos_about_items_from_tables.length ; i++){
        for(var j = 0 ; j < infos_about_items_from_tables[i].items_infos.length ; j++){
          console.log("oooooooooooooooooooooooooooooooo item oooooooooooooooooooooooooooooo ")
         

          if(infos_about_items_from_tables[i].items_infos[j].moreimgs.length == 0){
            infos_about_items_from_tables[i].items_infos[j].moreimgs = []
            infos_about_items_from_tables[i].items_infos[j].moreimgs.push("https://static.pullandbear.net/2/photos//2020/V/0/2/p/5234/915/800/5234915800_2_1_8.jpg?t=1582040133023&imwidth=1100")
            infos_about_items_from_tables[i].items_infos[j].moreimgs.push("https://lp2.hm.com/hmprod?set=source[/model/2015/A00%200102164%20001%2048%200550.jpg],type[STILLLIFE_FRONT],res[y]&hmver=1&call=url[file:/product/main]")
            infos_about_items_from_tables[i].items_infos[j].moreimgs.push("https://lp2.hm.com/hmgoepprod?set=quality[79],source[/ff/d0/ffd027a554a3e0a6efba77cfdf1fab1e0eb1d291.jpg],origin[dam],category[ladies_skirts_midiskirts],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/main]")

          }
          console.log(infos_about_items_from_tables[i].items_infos[j])
          }}

          infos_about_items_from_tables = await getRestOfInfosFromEmails(infos_about_items_from_tables)
          //infos_about_items_from_tables =  cleandataredend(infos_about_items_from_tables)
          console.log(infos_about_items_from_tables)
          return infos_about_items_from_tables


}


function cleandataredend(lastinfos){
  for(var  i  = 0 ; i< lastinfos.length ; i++){

      //if(lastinfos)


  }
 
}






async function readEmil(mailnum){

  return new Promise((resolve, reject)=>{
    var eml = fs.readFileSync(path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+mailnum+".eml", "utf-8");
          
    emlformat.read(eml, async function(error, data) {
      
    resolve(data['html']);
    })
  })
  
}

async function getlinkss(data,src){
  const $ = cheerio.load(data);
  
  var link = ""
 
    elem = $('html').find('img[src$="'+src+'"]').parent()
    console.log("this is the elem : "+elem.html())
  if(elem.is('a')){
      link = elem.attr("href");
  }

  return link;
  
}









async function getlistofelemss(data){
  return new Promise((resolve, reject)=> {

    var tab = []
    const $ = cheerio.load(data, { xmlMode: false });

    
    $('td').each(function(){

     
      tab.push($(this).text())
      
    })
    $('tr').each(function(){
     
      tab.push($(this).text())
     

    })

    resolve(tab)




  })
  
}



async function getPrice(data,resultsfromemails){
  return new Promise((resolve, reject)=> {

    var price = [] ;
    var product ="";
    var lastprodact = ""
    const $ = cheerio.load(data, { xmlMode: false });

    
    $('td').each(function(){
          
         product ="";
     if(/\d{3}/.test($(this).text())) {
      //price.push($(this).text())
      var pricestab = $(this).text().match(/(\d+\.\d{1,2})/g);
      
      if(pricestab != null && Array.isArray(resultsfromemails)){
        console.log("oooooooooooooooooooooooooo")
        for(var it = 0 ; it < resultsfromemails.length ; it++){
        if($(this).text().includes(resultsfromemails[it])){
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + pricestab)
          price.concat(pricestab)
          if(pricestab.length == 1)
          product = product + " " +resultsfromemails[it]+ "  "+pricestab;
        }
        }

        
       
      }



     }
     if(product !="" && lastprodact.length < product.length){
      lastprodact = product;
      }
      else{
        product= lastprodact;
      }
    })
    $('tr').each(function(){
      product ="";
      if(/\d{3}/.test($(this).text())) {
       // price.push($(this).text())
       var pricestab = $(this).text().match(/(\d+\.\d{1,2})/g);
           
       if(pricestab != null &&Array.isArray(resultsfromemails)){
        console.log("oooooooooooooooooooooooooo")
         for(var it = 0 ; it < resultsfromemails.length ; it++){
         if($(this).text().includes(resultsfromemails[it])){
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + pricestab)
          price.concat(pricestab)
          if(pricestab.length == 1)
           product = product + " " +resultsfromemails[it] + " "+pricestab;
         }
         }
 
         
 
       }
 
       }
     
       if(product !="" && lastprodact.length < product.length){
        lastprodact = product;
        }
        else{
          product= lastprodact;
        }
    })

    console.log(product)
    resolve(lastprodact)




  })
  
}



async function getlistofelems(data){
  return new Promise((resolve, reject)=> {

    var tab = []
    const $ = cheerio.load(data, { xmlMode: false });

    
    tab = $('body').text().split(" ")

    resolve(tab)




  })
  
}






async function get_from_the_link(link){

  if(!link.toLowerCase().includes("email")){
    try {
      const htmlString = await rp(link);
   
   
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    return await getlistofelems(htmlString);
  } catch (error) {
    
   
   console.log("this web site is closed ")
   return []
  }
   
  }
 return rp({
  url: link,
  method: "GET",
  resolveWithFullResponse: true,
  followRedirect:  function(response){ 
    console.log("REDIRECTED FROM: ", response.request.href)    
    return true
  }
}).then( async response =>{
  

  
  console.log("ENDED AT: ", response.request.href);



  var url = response.request.href
  var lasturl  =  response.request.href;
    var times = 0, index = null;

    while (times < 3 && index !== -1) {
        index = url.indexOf("/", index+1);
        times++;
    }


    what  = '/uk';

    url = url.replace(/./g, function(v, i) {
    return i === index - 1 ? v + what : v;
});  


console.log("rrr"+index);
 
    console.log("this is the repaired link");
    console.log(url);
   const htmlString = await rp(url)
   
 
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  return await getlistofelems(htmlString);
    









}).catch(e=>{
  console.log("cant read the email link")
})
  
  


}




async function compaireTowVContents(tabfrommail, tabfromlink){

  return new Promise((resolve,reject)=> {
    console.log(tabfrommail.length + "  ------------    "+tabfromlink.length)
    var tab = []
    for(var i = 0; i< tabfromlink.length ; i++){
      var linkitems = tabfromlink[i].split(" ");
      for(var j = 0 ; j < tabfrommail.length ; j++){
          var mailitems = tabfrommail[j].split(" ")

              
                  var commonsFound = 0;
                  //console.log("lalalalalalalalalalalalalalalalalalalaalalalal")
                  //console.log(chunks)
                      if(tabfrommail[j] != undefined){
                      if(tabfrommail[j].includes(tabfromlink[i]) 
                     && tabfromlink[i] != ''
                      ){
                        
                        if(tabfromlink[i].length >= 5){
                        tab.push(tabfromlink[i]);
                        }
                      //console.log(chunks)
                      }
                    }
                  

       
        //if(tabfromlink[i].includes(tabfrommail[j]) ||  tabfrommail[j].includes(tabfromlink[i])){
         
        




      }
      
    
    
    }
    var uniqueArray = tab.filter(function(item, pos) {
      return tab.indexOf(item) == pos;
  })

    for(let  ii = 0 ; ii< uniqueArray.length ;ii++){

      if(uniqueArray[ii].toLowerCase().includes("stree")
      ||uniqueArray[ii].toLowerCase().includes("deliv")
      ||uniqueArray[ii].toLowerCase().includes("return")
      ||uniqueArray[ii].toLowerCase().includes("pay")
      ||uniqueArray[ii].toLowerCase().includes("follo")
      ||uniqueArray[ii].toLowerCase().includes("contac")
      ||uniqueArray[ii].toLowerCase().includes("info")
      ||uniqueArray[ii].toLowerCase().includes("ship")
      ||uniqueArray[ii].toLowerCase().includes("cust")
      ||uniqueArray[ii].toLowerCase().includes("plea")
      ||uniqueArray[ii].toLowerCase().includes("phon")
      ||uniqueArray[ii].toLowerCase().includes("order")
      ||uniqueArray[ii].toLowerCase().includes("than")
      ||uniqueArray[ii].toLowerCase().includes("recei")
      ||uniqueArray[ii].toLowerCase().includes("you")
      
      ){

        uniqueArray.splice(ii, 1)
        ii--;

      }


    }
    /*for(let  i = 0 ; i< uniqueArray.length ;i++){
      console.log(" this is the color "+toHex(uniqueArray[i]))
    }*/

    resolve(uniqueArray)
  })


}







async function getRestOfInfosFromEmails(lastinfos){

  for(var  i  = 0 ; i< lastinfos.length ; i++){
    for(var j = 0 ; j < lastinfos[i].items_infos.length ; j++){

          if(lastinfos[i].items_infos[j].produit == undefined &&
            lastinfos[i].items_infos[j].color == undefined &&
            lastinfos[i].items_infos[j].size == undefined&&
            lastinfos[i].items_infos[j].price == undefined &&
            lastinfos[i].items_infos[j].src != ""){

             var response =  await readEmil(lastinfos[i].mailnum)
              var link = await getlinkss(response,lastinfos[i].items_infos[j].src)
              var elems = await getlistofelemss(response)
              var fromthelink = await get_from_the_link(link)
              var results = await compaireTowVContents(elems,fromthelink)
              var pricewithinfos  =  await getPrice(response,results)
              var descrp = ""
              var price = 0;

              console.log(elems.length)
              console.log(link.length)
              console.log(fromthelink.length)
              console.log(results)
              var arr = []
              arr = pricewithinfos.split(" ")

              for(let ite = 1 ; ite < arr.length ; ite = ite +2){
                descrp = descrp + " " + arr[ite]
              }
              price = arr[2];
              lastinfos[i].items_infos[j].produit = descrp;
              lastinfos[i].items_infos[j].price = price;
              console.log(lastinfos[i].items_infos[j])
            }
    }}

return lastinfos;
}







const getdesc = (img) =>{
  return new Promise((resolve,rej) =>{
    new ImageClassifier(img, res => {
    
      resolve(res); 
  });
  })
 
}


async function descriptionextracter(lastinfos) {
  for(var  i  = 0 ; i< lastinfos.length ; i++){
    for(var j = 0 ; j < lastinfos[i].items_infos.length ; j++){
        if(lastinfos[i].items_infos[j].description == undefined ){
          if(lastinfos[i].items_infos[j].src!="" && lastinfos[i].items_infos[j].src.includes("jpg") ){
            await requestImageSize(lastinfos[i].items_infos[j].src)
            .then(size => {console.log(size)
                  if (size.height >= 300 || size.width >= 300){
                    lastinfos[i].items_infos[j].moreimgs.unshift(lastinfos[i].items_infos[j].src)
                   return '1'
                  }
                
                 
            }) .catch(err => console.error(err));
            console.log("this is the url passed to desc !"+lastinfos[i].items_infos[j].moreimgs[0])
            if (lastinfos[i].items_infos[j].moreimgs[0] == undefined){
              lastinfos[i].items_infos[j].description = await getdesc(""+lastinfos[i].items_infos[j].src)
            }
            else{
          lastinfos[i].items_infos[j].description = await getdesc(""+lastinfos[i].items_infos[j].moreimgs[0])
            }
          }
        }
        else if(lastinfos[i].items_infos[j].produit == undefined && lastinfos[i].items_infos[j].description != undefined ){
          lastinfos[i].items_infos[j].produit = lastinfos[i].items_infos[j].description;
          if(lastinfos[i].items_infos[j].src!="" && lastinfos[i].items_infos[j].src.includes("jpg")){
            console.log(lastinfos[i].items_infos[j].src)
                await requestImageSize(lastinfos[i].items_infos[j].src)
            .then(size => {console.log(size)
                  if (size.height >= 300 || size.width >= 300){
                    lastinfos[i].items_infos[j].moreimgs.unshift(lastinfos[i].items_infos[j].src)
                    return '1'
                  }
                  
                  
            }) .catch(err => console.error(err));
            if (lastinfos[i].items_infos[j].moreimgs[0] == undefined){
              lastinfos[i].items_infos[j].description = await getdesc(""+lastinfos[i].items_infos[j].src)
            }
            else{
          lastinfos[i].items_infos[j].description = await getdesc(""+lastinfos[i].items_infos[j].moreimgs[0])
            }
          }else if(lastinfos[i].items_infos[j].moreimgs != undefined && lastinfos[i].items_infos[j].moreimgs.length!= 0){
            lastinfos[i].items_infos[j].description = await getdesc(""+lastinfos[i].items_infos[j].moreimgs[1])
          }
         
        }
      
    }}

    return lastinfos
}

















const getimgs = (opts) => {
  return new Promise((resolve, reject) => {
      gis(opts,  (err, result) => {
          

          resolve(JSON.stringify(result, null, '  '));
      });
  });
}


async function getmoreimgsfromdescriptionororproduct(lastinfos){
  for(var  i  = 0 ; i< lastinfos.length ; i++){
    for(var j = 0 ; j < lastinfos[i].items_infos.length ; j++){
      if(lastinfos[i].items_infos[j].moreimgs== undefined ){
        lastinfos[i].items_infos[j].moreimgs= []
      }
      if(lastinfos[i].items_infos[j].description != undefined){
      if(lastinfos[i].items_infos[j].description.length >25  &&  lastinfos[i].items_infos[j].moreimgs.length <2){
        var opts = {
          searchTerm: lastinfos[i].items_infos[j].description,
          /*filterOutDomains: [
              'matchesfashion.com',
  
              
            ]*/
                };
       
                var resp = await getimgs(opts)
                console.log("popopopopopopopopopopopopopopopopop"+resp)
                //for(var it = )
                var obj = JSON.parse(resp)
                for(let p = 0 ; p < obj.length  ; p++){
                 
                  if((obj[p].height> 400 || obj[p].width> 400) && p <7 )
                  lastinfos[i].items_infos[j].moreimgs.push(obj[p].url)
                }
      }}


      }}




      for(var  i  = 0 ; i< lastinfos.length ; i++){
        for(var j = 0 ; j < lastinfos[i].items_infos.length ; j++){
          if(lastinfos[i].items_infos[j].moreimgs== undefined ){
            lastinfos[i].items_infos[j].moreimgs= []
          }
          if(lastinfos[i].items_infos[j].produit != undefined){
          if(lastinfos[i].items_infos[j].produit.length >25  &&  lastinfos[i].items_infos[j].moreimgs.length <2){
            var opts = {
              searchTerm: lastinfos[i].items_infos[j].produit,
              /*filterOutDomains: [
                  'matchesfashion.com',
      
                  
                ]*/
                    };
           
                    var resp = await getimgs(opts)
                    console.log("popopopopopopopopopopopopopopopopop"+resp)
                    //for(var it = )
                    var obj = JSON.parse(resp)
                    for(let p = 0 ; p < obj.length  ; p++){
                     
                      if((obj[p].height> 400 || obj[p].width> 400) && p <7 )
                      lastinfos[i].items_infos[j].moreimgs.push(obj[p].url)
                    }
          }}
    
    
          }}

      return lastinfos
}

function cleanRedendancy(items) {

  for(var  i  = 0 ; i< items.length ; i++){
    for(var j = 0 ; j < items[i].items_infos.length-1 ; j++){

       for(var k = j+1 ;  k < items[i].items_infos.length ; k++){
          if(items[i].items_infos[j].src == items[i].items_infos[k].src && items[i].items_infos[j].src!= ""  ){

            
            items[i].items_infos.splice(j,1);

            if(j!=0)
            j--
            
          }
       }

    }
  }

  return items;


}




async function getfromthelinkmoreImages(link){



  if(!link.toLowerCase().includes("email")){
    try {
      const htmlString = await rp(link);
   
    const $ = cheerio.load(htmlString, { xmlMode: false });
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    return await readthe_image_link($);
  } catch (error) {
    
   
   console.log("this web site is closed ")
   return []
  }
   
  }
 return rp({
  url: link,
  method: "GET",
  resolveWithFullResponse: true,
  followRedirect:  function(response){ 
    console.log("REDIRECTED FROM: ", response.request.href)    
    return true
  }
}).then( async response =>{
  

  
  console.log("ENDED AT: ", response.request.href);



  var url = response.request.href
  var lasturl  =  response.request.href;
    var times = 0, index = null;
/*
    while (times < 3 && index !== -1) {
        index = url.indexOf("/", index+1);
        times++;
    }



    what  = '/uk';

    url = url.replace(/./g, function(v, i) {
    return i === index - 1 ? v + what : v;
});  
*/

console.log("rrr"+index);
 
    console.log("this is the repaired link");
    console.log(url);
   const htmlString = await rp(url).catch(e => {})
   if(htmlString == undefined || htmlString  == ""){
    const htmlString = await rp(lasturl).catch(e=> {})
   }
   
  const $ = cheerio.load(htmlString, { xmlMode: false });
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  return await readthe_image_link($);
    









}).catch(e=>{
  console.log("cant read the email")
})
  











}




async function readthe_image_link($) {


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

  $('script').each(function(){ 

    words = []
    words = $(this).html().split(' ');
    console.log("this is the script !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    for(var i = 0 ; i < words.length ; i++){
      wordswitoutcotes = []
      wordswitoutcotes= words[i].split('"')
      for(var j = 0 ; j < words.length ; j++){
        if(wordswitoutcotes[j] != undefined){
        if(wordswitoutcotes[j].includes("jpg") && wordswitoutcotes[j].includes("http")){
         
          
          imgs.push(wordswitoutcotes[j])
          

        }
      }
      }

      }
      
  })



  imgs = imgs.filter((str)=>{
          if(str != undefined)
          return str.includes('jpg') || str.includes('jpeg');
          return false;
  });

  imgs =  imgs.filter(function(item, pos) {
    return imgs.indexOf(item) == pos;
})
console.log(imgs)

var imageswithgoodresolution = []
for (var i = 0 ; i< imgs.length ; i++){
 await requestImageSize(imgs[i])
          .then(size => {console.log(size)
                if (size.height >= 300 || size.width >= 300){
                  imageswithgoodresolution.push(imgs[i]);
                  return '1'
                }
          })
          .catch(err => console.error(err));
}
console.log(imageswithgoodresolution)
return imageswithgoodresolution;
}





async function get_the_link_from_the_image(data, img){
  const $ = cheerio.load(data);
      console.log("enterd the func")
      console.log(img)
      var tab = []
      for(var  i = 0 ; i < img.src.length ; i ++ ){
        elem = $('html').find('img[src$="'+img.src[i]+'"]').parent()
        console.log("this is the elem : "+elem.html())
      if(elem.is('a')){
          tab.push(elem.attr("href"))
      }
      }
      


      console.log("this is the liiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiks"+tab)
      console.log(tab)
      
        return {"mailnum": img.mailnum+1, "mainImgsrc":  img.src, "linkToItem":tab}
      









}





async function gettherestofinfosfromtheImage(imagesSrc) {
  console.log("very  out")





  








    
  if(!Array.isArray(imagesSrc)){
    imagesSrc = [imagesSrc]
  }





    var emails = [];
    var files = fs.readdirSync( path.resolve(__dirname,"../../public/EmailForTest/")+"\\");

     const rr =  await  files.forEach( async function(file,i) {
        console.log (i)
        var yes = false;
        for(var it =  0  ; it < imagesSrc.length ; it++  ){
  
  
          var cmp = imagesSrc[it].mailnum+1
          console.log("in" + cmp  + path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+cmp+".eml")
          var eml = fs.readFileSync(path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+cmp+".eml", "utf-8");
          
          emlformat.read(eml, async function(error, data) {
            console.log("link !!!!!!!!!!!!!!!!!  "+ imagesSrc[it])
              var item =  await get_the_link_from_the_image(data['html'], imagesSrc[it])
             
              console.log("link !!!!!!!!!!!!!!!!!  "+ item)
              console.log(item)
              emails.push({"mailnum": item.mailnum, "mainImgsrc":  item.mainImgsrc, "linkToItem":item.linkToItem});
               
           
          
            })}
           
            emails.push({"mailnum": i+1, "mainImgsrc": "", "linkToItem":""});
        
       return "dd"
         
            
      });
      console.log("/***************/")
      console.log(emails)

      for(var k = 0 ; k < emails.length-1 ; k++){
        console.log("/***************/")
          for(var h   = k+1 ; h < emails.length; h++ ){
                if(emails[k].mailnum == emails[h].mailnum){
                  emails.splice(k, 1);
                  if(k!=0)
                  k--
                
                }
          } 


      }
      console.log("/***************/")
      //console.log(emails)
     return await getitems_in_array(emails);
     /* console.log("out")
      console.log(imagesSrc.length)
            for(var i =  0  ; i < imagesSrc.length ; i++  ){
  
  
              var cmp = imagesSrc[i].mailnum+1
              console.log("in" + cmp  + path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+cmp+".eml")
              var eml = fs.readFileSync(path.resolve(__dirname,"../../public/EmailForTest/")+"\\"+cmp+".eml", "utf-8");
              
              emlformat.read(eml, async function(error, data) {
                  
                  
                 var link =  await get_the_link_from_the_image(data['html'], imagesSrc[i].src)
                 console.log(imagesSrc[i] )
                 for(var j =  0  ; j < emails.length ; j++  ){
                 
                    console.log(emails[j] )
                    console.log(imagesSrc[i] )
                  
                    if(emails[j].mailnum ==imagesSrc[i].mailnum ){
                      emails[j].mainImgsrc= imagesSrc[i].src;
                      emails[j].linkToItem = link;


                    }

                 }
  
  
              });
               
  
              console.log("iterated !")
             
            } */
  
            

             
    





     
   
        





  }
    




/*function readtheelementsfromtheImage (str,){

    var eml = fs.readFileSync(str+".eml", "utf-8");
    var imgs;
    emlformat.read(eml, function(error, data) {
        if (error) return console.log(error);
          
    
          imgs = readLinks(data['html'],numRetailEmail)
          console.log("fdfuodqhfpsqdoifjqpdiofsk"+imgs)
       
       
        
    });
    return imgs;
    }*/

exports.gettherestofinfosfromtheImage = gettherestofinfosfromtheImage;