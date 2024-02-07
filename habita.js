require('dotenv').config();
const cron = require("node-cron");
//const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const mongo = require("mongodb");
const Listing = require("./model/habitalisting");
const mongoose = require('mongoose');

//bot protection
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Register the Stealth plugin
puppeteer.use(StealthPlugin());

async function connectToMongoDb()
{
  await mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  );
  console.log("connected")
}

//API call - fetch the data
async function scrapelisting(){
  const myPosts = await fetch("https://www.habita.com/propertysearch/results/fi/1?sort=newest&type=ResidenceSale");
  const response = await myPosts.json();
  console.log(response);
  

    var count = response["results"].length;
    console.log(count)
    var loc=new Array()
    const setting=[];
    
    for(var i = 0; i < 6; i++) {


    var url1=response["results"][i].images[0];
    var myArray = url1.match(/\/\d{6}/);
    url="https://www.habita.com/property"+myArray;
        
   
  
   var price=response["results"][i].price;
   var title=response["results"][i].title;
   var area=response["results"][i].area;
   var type=response["results"][i].type;
    
   var loc={};
   loc['title']=title;
   loc['url']=url;
   loc['price']=price;
   loc['type']=type;
   loc['area']=area;
    
   
setting.push({
    title:loc['title'],
    url: loc['url'],
    price: loc['price'],
    type: loc['type'],
    area: loc['area']

});

    }
   
console.log(setting);
 
  // address.push(response["data"]["results"][i].city,response["data"]["results"][i].county,response["data"]["results"][i].district)
   
  
  return setting;


}
 async function scrapejobdescription(listing, page){
   for(var i=0; i< 6;i++)
    {
      const { MongoClient } = require('mongodb');

    
      const client = new MongoClient( process.env.MONGO_URI,);
        
    
      
            // Connect to the MongoDB cluster
            await client.connect();
            await findOneListingByName(client, listing[i].url);
            async function findOneListingByName(client, nameOfListing) {
                const cursor = await client.db("mfeeds_db").collection("habitalistings").find({ url: nameOfListing }).toArray()
              
                if (cursor.length===0)
                {
                  await page.goto(listing[i].url);
                  const html= await page.content();
                  const $ = cheerio.load(html);
                  //const datadescription = $("#apartment-intro").text();
                  const add1= $("#descriptions > h1").text();
                  const add2= $("#descriptions > h4").text();
                  const address=add1+add2;
                  //const vend=$("#property > section.center-container.grid2-lplus > div:nth-child(2) > section > div > div.information").text();
                  const vendor="Habita"//vend.replace(/\s+/g, ''); 
                  const year=$("#property > section:nth-child(4) > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(1) > td").text();
                  const correct=$("#property > section:nth-child(4) > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(12) > td").text();
                  const correction=correct.replace(/\s+/g, ''); 
                  // const area=$("#apartment-heading > div.sc-imABML.cZXBfz > span:nth-child(1)").text();
                  //const price=$("#apartment-heading > div.sc-dRaagA.cFzXaa > div.sc-fEUNkw.gArMiz > font > font").text();
                  //listing[i].datadescription = datadescription;
                  //listing[i].title=title;
                  listing[i].address=address;//Osoite
                  listing[i].vendor=vendor;
                  //listing[i].type=type;
                  listing[i].year=year;//Rakennusvuosi
                  listing[i].correction=correction;//remppa
                  //listing[i].area=area;
                
                  //console.log(listing[i].datadescription);
                  //console.log(listing[i].title);
                  console.log(listing[i].address);
                  console.log(listing[i].vendor);
                 // console.log(listing[i].type);
                  console.log(listing[i].year);//typpi
                  console.log(listing[i].correction);
          
                  let ts = Date.now();
          
                  let date_time = new Date(ts);
                  let date = date_time.getDate();
                  let month = date_time.getMonth() + 1;
                  let year1 = date_time.getFullYear();
          
                  // prints date & time in YYYY-MM-DD format
                  let v = year1 + "-" + month + "-" + date;
                  listing[i].date = v;
                  console.log(listing[i].date);
          
                  let hours = date_time.getHours();
                  let minutes = date_time.getMinutes();
                  let seconds = date_time.getSeconds();
          
                  let y = hours + ":" + minutes + ":" + seconds;
                  listing[i].time = y;
                  console.log(listing[i].time);
                  const listingModel = new Listing(listing[i])
                  await listingModel.save();
          
                  await sleep(1000);
    
               }

               else{
                client.close();
        
               }
                
            
    
            // Make the appropriate DB calls
    
              }
    
    
    

   



   } 
  }

 
 
 
async function sleep(milliseconds){
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


 
  

  


async function main()
{
    await connectToMongoDb();
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const listing = await scrapelisting();
    
    const jobdescription = await scrapejobdescription(listing, page);
    console.log(listing);
    

    listing.forEach(item => {
      console.log(`The title: ${item.title}, URL: ${item.url}`);
    });
  
    await browser.close();
  
    return listing;
  }
  //schedules the cron job
  cron.schedule('* /55 * * * *', async function() {
    const listing = await main();
  
  //   if (!listing || listing.length === 0 || listing.some(item => !item.title || !item.url))  {
  //     console.log('Sending email...');
  
  //     const transporter = nodemailer.createTransport({
        
  //       host: 'smtp.gmail.com',
  //       port: 587,
  //       secure: false,
  //       auth: {
  //         user: 'revtemp123@gmail.com',
  //         pass: 'vsdfabpoyvkwvqln'
  //       }
  //     });
  
  //     const message = {
  //       from: 'revtemp123@gmail.com',
  //       to: ['revathi.r@meltwater.com','revathir1610@gmail.com'],
  //       subject: 'Test Email',
  //       text: 'This is a test email message'
  //     };
      
  //     transporter.sendMail(message, (err, info) => {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         console.log(info);
  //       }
  //     });
  //   } else {
  //     console.log('Listing is not empty, not sending email.');
  //   }
  
  //   console.log('Running Cron Job');
 });
  //cron.schedule("*/10 * * * * *", function() {
   // main();
    //console.log('Running Cron Job');

//});
