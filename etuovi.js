require('dotenv').config();
const cron = require("node-cron");
//const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/eutoviListing");
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


async function scrapelisting(page) {
await page.goto('https://www.etuovi.com/myytavat-asunnot/tulokset?haku=M28373768&rd=50', {timeout: 0});
const html = await page.content();
    const $ = cheerio.load(html);
    /* const example = await page.$('#km-ccw > div > div.consent-buttons > button.consent-buttons__yes');

await example.click({
  button: 'left',
}); */

//scrape for web page
const listing = $("#announcement-list > div > div > div > div > div>a").map((index, element) => {
  const titleelement= $(element).find(".MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > h5");                                     
   const title = $(titleelement).text();
   const url = $(element).attr("href");   
   console.log(url);                                                                                                               
    return{ title,url};                                             

})
.get();



return listing;
}
//var ven=new Array();
async function scrapejobdescription(listing, page){
for(var i=0; i< 10;i++)
{
  
  const { MongoClient } = require('mongodb');

  
  const client = new MongoClient( process.env.MONGO_URI,);


      // Connect to the MongoDB cluster
      await client.connect();
      await findOneListingByName(client, listing[i].url);
      async function findOneListingByName(client, nameOfListing) {
          const cursor = await client.db("mfeeds_db").collection("eutovilistings").find({ url: nameOfListing }).toArray()
        
          if (cursor.length===0)
          {
        await page.goto("https://www.etuovi.com"+listing[i].url);
        const html= await page.content();
        const $ = cheerio.load(html);
        
        const data = $("#infos > div > div:nth-child(2) > div:nth-child(2) > div").text();
        const datadescription=data.replace(/\s+/g, ''); 
        const address= $("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div").text();
        const vendor="Etuovi"//$("#contact > div > div> div > div > div > div > div > div").text();
        const type=$("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div:nth-child(3) > div").text();
        const year=$("#infos > div > div > div > div:nth-child(2) > div > div > h3").text();
        const corr=$("#infos > div > div> div > div > p").text();
        const correction=corr.replace(/\s+/g, ''); 
        const area=$("#infos > div > div > div > div > div > div > h3 > span").text();
        const price=$("#infos > div > div > div > div> div > div > h3").text();

        listing[i].datadescription = datadescription;//Isännöinti
        listing[i].address=address;//Osoite
        listing[i].vendor=vendor;
        listing[i].type=type;//Kohdetyyppi
        listing[i].year=year;//Rakennusvuosi
        listing[i].correction=correction;//remppa
        listing[i].area=area;
        listing[i].price=price;
        console.log(listing[i].datadescription);
        console.log(listing[i].address);
        console.log(listing[i].vendor);
        console.log(listing[i].type);
        console.log(listing[i].year);
        console.log(listing[i].correction);
        console.log(listing[i].area);
        console.log(listing[i].price);
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
const listing = await scrapelisting(page);
const datadescription = await scrapejobdescription(listing, page);
console.log(listing);
listing.forEach(item => {
  console.log(`The title: ${item.title}, URL: ${item.url}`);
});

await browser.close();

return listing;
}
//schedules the cron job
cron.schedule('*/30 * * * *', async function() {
const listing = await main();

// if (!listing || listing.length === 0 || listing.some(item => !item.title || !item.url))  {
//   console.log('Sending email...');

//   const transporter = nodemailer.createTransport({
    
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'revtemp123@gmail.com',
//       pass: 'vsdfabpoyvkwvqln'
//     }
//   });

//   const message = {
//     from: 'revtemp123@gmail.com',
//     to: ['revathi.r@meltwater.com','revathir1610@gmail.com'],
//     subject: 'Test Email',
//     text: 'This is a test email message'
//   };
  
//   transporter.sendMail(message, (err, info) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(info);
//     }
//   });
// } else {
//   console.log('Listing is not empty, not sending email.');
// }

console.log('Running Cron Job');
});
