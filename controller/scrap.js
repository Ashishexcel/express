const cheerio = require('cheerio');
// const axios = require('axios');
const request = require('request')



const flipkarturl = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io&otracker=categorytree';
// const snapurl = 'https://www.snapdeal.com/search?keyword=tshirt&santizedKeyword=tshirt&catId=0&categoryId=3033&suggested=false&vertical=p&noOfResults=20&searchState=k3%3Dtrue%7Ck5%3D0%7Ck6%3D0%7Ck7%3DAAwIAIIgAAAMAKAEQAAAACAAAAIAAQAAAAAIAAAAAAAAAACAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAgAACABA%3D%7Ck8%3D0&clickSrc=searchOnSubCat&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy#bcrumbSearch:tshirt';
const snapurl  = 'https://www.snapdeal.com/search?keyword=tshirt&santizedKeyword=tshirt&catId=0&categoryId=3033&suggested=false&vertical=p&noOfResults=20&searchState=k3%3Dtrue%7Ck5%3D0%7Ck6%3D0%7Ck7%3DAAwIAIIgAAAMAKAEQAAAACAAAAIAAQAAAAAIAAAAAAAAAACAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAgAACABA%3D%7Ck8%3D0&clickSrc=searchOnSubCat&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy#bcrumbSearch:tshirt'
const flipscrap = async(req,res)=>{
    try {
         request(flipkarturl,(res,err,body)=>{
            let $ = cheerio.load(body);
           const data =  $('div._36fx1h > div._1YokD2 > div._1YokD2 > div._1AtVbE > div._13oc-S').each(function(index,data){
                
                var name = $(this).find('div._4rR01T').text();
                var link = $(this).find('div._2kHMtA>a').attr('href');
                var price = $(this).find('div._25b18c').text()
                
              let    obj={
                    name:name,
                    link:link,
                    price:price 
                };
               console.log(obj) 
            });
        })
        res.status(200).json({message:"success"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:error
        })
    }          
}

const snapscrap = (req,res)=>{
    try {
        request(snapurl,(res,err,body)=>{
            let $ = cheerio.load(body);
            
            $('.product-tuple-description ').each(function(idx ,el){
                const productdata = $(el).children('.product-desc-rating').text()
                let obj = {
                            productdata:productdata
                        }
                        console.log(obj)
            })
            
            // .each(function(idx,element){
            //     var first = $(this).find('div.product-desc-rating').attr('href');
            //     let obj = {
            //         first:first
            //     }
            //     console.log(obj)
            // })
            // console.log(name)
        
            
       })
       
   } catch (error) {
       console.log(error)
       res.status(500).json({
           error:error
       })
   }          
};


const flipscrapdetail = async(req,res)=>{
    try {

         request(flipkarturl,(res,err,body)=>{
             var olink;
             var obj;
             var item;
             let $ = cheerio.load(body);
             const data =  $('div._36fx1h > div._1YokD2 > div._1YokD2 > div._1AtVbE > div._13oc-S').each(function(index,data){
                 
                 var link = $(this).find('div._2kHMtA>a').attr('href');
                 var list = [];
                
                 olink = 'https://www.flipkart.com' + link;
                list.push(olink)
                 request(olink,(res,err,again)=>{
                const che = cheerio.load(again)
                
                const war = che('div._3Mn1Gg div._1AtVbE >  div._1UdlE- > div.XcYV4g > div._352bdz').text()

                // const storage = che('div.UtUXW0 > div._2GoDe3 >  div._3Mn1Gg > div._1AtVbE > div.aMaAEs').find('div.B_NuCI').text()
                const high = che('._21Ahn-').each((i,el)=>{
                     item = $(el).text();
                     list.push(item)
                })
                obj = {
                        link:olink,
                        list:list
                    }
                    console.log(obj)
            })
        });




        });
        res.status(200).json({message:"success"});
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:error
        })
    }          
}


module.exports = {flipscrap,snapscrap,flipscrapdetail};