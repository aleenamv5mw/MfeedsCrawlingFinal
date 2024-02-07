require('dotenv').config();
//const fetch = require ('node-fetch');
const cron = require("node-cron");
//const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const mongo = require("mongodb");
const Listing = require("./model/kinteistoListing");
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



//Using API fetch the data are crawled 
async function scrapelisting(){
  const myPosts = await fetch("https://www.kiinteistomaailma.fi/api/km/KM?limit=30&maxArea=&maxYearBuilt=&minArea=&minYearBuilt=&sort=latestPublishTimestamp&sortOrder=desc&type=property");
  const response = await myPosts.json();
  
    const address = new Array();
    var count = response["data"]["results"].length;
    console.log(count)
    var loc=new Array()
    const setting=[];
    
    for(var i = 0; i < 5; i++) {


   
   
   
   var url=response["data"]["results"][i].canonicalUrl;
   var price=response["data"]["results"][i].salesPrice;
   var title=response["data"]["results"][i].roomTypes;
  
   var area=response["data"]["results"][i].totalArea;
    
   var loc={};
   loc['title']=title;
   loc['url']=url;
   loc['price']=price;
   loc['area']=area;
    
   
setting.push({
    title:loc['title'],
    url: loc['url'],
    price: loc['price'],
    area: loc['area']

});

    }
   
 //console.log(setting);
 
  // address.push(response["data"]["results"][i].city,response["data"]["results"][i].county,response["data"]["results"][i].district)
   
  
  return setting;


}
 async function scrapejobdescription(listing, page){
   for(var i=0; i< 5;i++)
    {
      const { MongoClient } = require('mongodb');

    
    
      const client = new MongoClient( process.env.MONGO_URI,);
   
    //const client = new MongoClient(uri);
      await client.connect();
      await findOneListingByName(client, listing[i].url);
      async function findOneListingByName(client, nameOfListing) {
          const cursor = await client.db("mfeeds_db").collection("kinteistolistings").find({ url: nameOfListing }).toArray()
        
          if (cursor.length===0)
          {
      
        await page.goto(listing[i].url);
            const html= await page.content();
            const $ = cheerio.load(html);
            const descrip = $("#apartment-intro").text();
            const datadescription=descrip.replace(/\s+/g, '');
            const address= $("#apartment-heading > h1").text();
            const vendor= "Kilnteistimaailma"//$("#apartment-form > div > div > div").text();
            
            const type=$("#apartment-specs > div:nth-child(1) > div > div:nth-child(2) > span ").text();
            
            const year=$("#apartment-specs > div:nth-child(1) > div.sc-kcDeIU.hlsFVp > div:nth-child(10) > span.sc-cqpYsc.djxGAw > font > font").text();
            const correction=$("#apartment-specs > div:nth-child(1) > div > div:nth-child(17) > span").text();
           
            listing[i].datadescription = datadescription;//Isännöinti
            //listing[i].title=title;
            listing[i].address=address;//Osoite
            listing[i].vendor=vendor;
            listing[i].type=type;//typpi
            listing[i].year=year;//Rakennusvuosi
            listing[i].correction=correction;//remppa
            //listing[i].area=area;
          
            console.log(listing[i].datadescription);
            //console.log(listing[i].title);
            console.log(listing[i].address);
            console.log(listing[i].vendor);
            console.log(listing[i].type);
            console.log(listing[i].year);
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
           //console.log(listing[i].area);
           const listingModel = new Listing(listing[i])
           await listingModel.save();
   
           //await sleep(1000);
            await sleep(1000);
          }
    

          else{
           client.close();
    
          }
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
cron.schedule('*/40 * * * * *', async function() {
  const listing = await main();

  if (!listing || listing.length === 0 || listing.some(item => !item.title || !item.url))  {
    console.log('Sending email...');

    const transporter = nodemailer.createTransport({
      
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'revtemp123@gmail.com',
        pass: 'vsdfabpoyvkwvqln'
      }
    });

    const message = {
      from: 'revtemp123@gmail.com',
      to: ['revathi.r@meltwater.com','revathir1610@gmail.com'],
      subject: 'Test Email',
      text: 'This is a test email message'
    };
    
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
  } else {
    console.log('Listing is not empty, not sending email.');
  }

  console.log('Running Cron Job');
});
//cron.schedule("*/10 * * * * *", function() {
   // main();
    //console.log('Running Cron Job');

//});