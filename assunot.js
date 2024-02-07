require('dotenv').config();

const cheerio  = require("cheerio");
const cron = require('node-cron');
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/assunotlisting");
const mongoose = require('mongoose');

//bot protection
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Register the Stealth plugin
puppeteer.use(StealthPlugin());
async function connectToMongoDb() //connection to mongdb
{
  await mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  );
  console.log("connected")
}

async function scrapelisting(page)
{

//const browser= await puppeteer.launch({headless:false});
//const page = await browser.newPage();
await page.goto(
    "https://asunnot.oikotie.fi/"
);


const html = await page.content();
const $ =  cheerio.load(html);
//scrape for web page
   
    const results = $(".card-carousel-card").map((index, element) => {
        const tit= $(element).text()
        const title=tit.replace(/\s+/g, '');  
        const url=$(element).attr("href");
        return{title,url};
    })
    .get();
return results;
}
async function scrapejobdescription(listing, page){
    for(var i=0; i< 10;i++)
    {
      console.log(listing[i].url);
      const { MongoClient } = require('mongodb');
  
     
      const client = new MongoClient( process.env.MONGO_URI,);
    
    
          // Connect to the MongoDB cluster
          await client.connect();
          await findOneListingByName(client, listing[i].url);
          async function findOneListingByName(client, nameOfListing) {
              const cursor = await client.db("mfeeds_db").collection("assunotlisting").find({ url: nameOfListing }).toArray()//check for the url is present on the mongo db
            
              if (cursor.length===0) //if the url is null then upade with new
              {
            await page.goto(listing[i].url);
            const html= await page.content();
            const $ = cheerio.load(html);
            const add=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(1) > dl > div:nth-child(1) > dd").text();
            const address=add.replace(/\s+/g, '');   
            const data=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-overview").text();
            const datadescription=data.replace(/\s+/g, '');
            const area=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h15.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div > div:nth-child(2) > div.details-grid__item-text > dl:nth-child(1) > dd").text();
            const year=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(5) > dl > div:nth-child(4) > dd").text();
            const type=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(5) > dl > div:nth-child(3) > dd").text();
            //const ven=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__right > div > div.listing-sidepanel__section.listing-sidepanel__section--contact-form > div > div.listing-contact__person.listing-contact__person--sidepanel > div > div.listing-person__details").text();
            const vendor="Assunot"
            const housingassociation=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(5) > dl > div:nth-child(2) > dd").text();
            const apartment=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(5) > dl > div:nth-child(5) > dd").text();
            const price=$("body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div.listing-header__details > h2 > span:nth-child(1)").text();
            listing[i].housingassociation = apartment//Huoneistojen lukum
            listing[i].housingassociation = housingassociation;//Taloyhtiön nimi


            listing[i].datadescription = datadescription;//Isännöinti
            listing[i].address=address;//Osoite
            listing[i].vendor=vendor;
            listing[i].type=type;//Kohdetyyppi
            listing[i].year=year;//Rakennusvuosi
            //listing[i].correction=correction;
            listing[i].area=area;
            listing[i].price=price;
            
            console.log(listing[i].address);
            console.log(listing[i].vendor);
            console.log(listing[i].type);
            console.log(listing[i].year);
            console.log(listing[i].correction);
            console.log(listing[i].area);
            console.log(listing[i].price);
            console.log(listing[i].housingassociation);
            console.log(listing[i].housingassociation)
            console.log(listing[i].datadescription);
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
    
    
    //}
    
   // main();
   listing.forEach(item => {
    console.log(`The title: ${item.title}, URL: ${item.url}`);
  });

  await browser.close();

  return listing;
}


//TEST CRON
//   let cronJobCounter = 0;
//   const dataFreq = [];
//   cron.schedule('* * * * *', async function() { // Run every minute for testing
//     cronJobCounter++;
//     console.log(`Cron Job run #${cronJobCounter}`);
//     setTimeout(() => {
//       console.log(`Expected number of runs in 12 hours: ${cronJobCounter * 24}`);
//       process.exit(0);
//     }, 30 * 60 * 1000); // 30 minutes x 60 seconds x 1000 milliseconds
//   const listing = await main();
//   // Log data, add frequency data to the dataFreq array
// dataFreq.push({
//   runNumber: cronJobCounter,
//   dataCount: listing.length,
// });
// //print
//   console.log("Data Frequency in Each Cron Job Run:");
//   dataFreq.forEach(({ runNumber, dataCount }) => { 
//     console.log(`Run #${runNumber}: Data Count - ${dataCount}`);
//   });
  //if source not working 

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

 // console.log('Running Cron Job');
 
cron.schedule("*/45 * * * * ", function() {
 //cron.schedule("* * * * * * ", function() {
  main();
   console.log('Running Cron Job');

});

