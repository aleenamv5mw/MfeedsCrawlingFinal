require('dotenv').config();
const cron = require("node-cron");
const cheerio = require("cheerio");
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/opkotiListing");
const mongoose = require('mongoose');
//bot protection
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Register the Stealth plugin
puppeteer.use(StealthPlugin());

async function connectToMongoDb() //connection to mongo db
{
  await mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  );
  
  console.log("connected")
}


async function scrapelisting(page) {
    //await connectmongodb();
    
    await page.goto('https://op-koti.fi/myytavat/asunnot', {timeout: 0});
    //await page.screenshot({path: 'example.png'});
    //await browser.close();
    const html = await page.content();
    const $ = cheerio.load(html);
    // $(".linktype1 ").each((index, element) => console.log($(element).text()));
    // $(".linktype1 ").each((index, element) => 
    //  console.log($(element).attr("href"))
    //  );
  //jQuery to scrape data from a web page  
    const listing = $(".listing-result__link").map((index, element) => {
        const titleElement=$(element).find(".listing-result__type-and-rooms")
        const title = $(titleElement).text();
        const url = $(element).attr("href");
        return { title, url};
    })
    .get();
    
    return listing;
}
async function scrapejobdescription(listing, page){
    for(var i=0; i< 5;i++)
    {
        const { MongoClient } = require('mongodb');

  
  
  
  const client = new MongoClient(process.env.MONGO_URI);


      // Connect to the MongoDB cluster
      await client.connect();
      await findOneListingByName(client, listing[i].url);
      async function findOneListingByName(client, nameOfListing) {
          const cursor = await client.db("mfeeds_db").collection("opkotilistings").find({ url: nameOfListing }).toArray()
        
          if (cursor.length===0)
          {
        await page.goto("https://op-koti.fi"+listing[i].url);
            const html= await page.content();
            const $ = cheerio.load(html);
            const job = $(".listing-basics__description").text();
            const jobdescription = job.replace(/\s+/g, '');
            const address= $(".listing-basics__address").text();
            const vendor="OP-koti"//$("#contact-form > div > div.main-contact > div > div.details").text();
            const type=$("#data-sheet > div > div > section > div:nth-child(2) > div.listing-data-sheet__narrow-content > div:nth-child(1) > dl > dd:nth-child(4)").text();
            const year=$("#data-sheet > div > div > section > div:nth-child(2) > div.listing-data-sheet__narrow-content > div:nth-child(1) > dl > dd:nth-child(18)").text();
            const cor=$("#data-sheet > div > div > section > div:nth-child(4) > div:nth-child(3) > p:nth-child(2)").text();
            const correction=cor.replace(/\s+/g, '');
            const are=$("#data-sheet > div > div > section > div:nth-child(2) > div.listing-data-sheet__narrow-content > div:nth-child(1) > dl > dd:nth-child(16) > div > span").text();
            const area=are.replace(/\s+/g, '');
            const price=$("#data-sheet > div > div > section > div:nth-child(2) > div.listing-data-sheet__narrow-content > div:nth-child(2) > dl > dd:nth-child(2)").text();
            listing[i].jobdescription = jobdescription;//Isännöinti
            listing[i].address=address;//Osoite
            listing[i].vendor=vendor;
            listing[i].type=type;//typpi
            listing[i].year=year;//Rakennusvuosi
            listing[i].correction=correction;//remppa
            listing[i].area=area;
            listing[i].price=price;
            console.log(listing[i].jobdescription);
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
    const jobdescription = await scrapejobdescription(listing, page);
    console.log(listing);



    listing.forEach(item => {
        console.log(`The title: ${item.title}, URL: ${item.url}`);
      });
    
      await browser.close();
    
      return listing;
    }
    //schedules the cron job
    //cron.schedule('*/35 * * * *', async function() {
//       let cronJobCounter = 0;
// const dataFreq = []; // store data frequency in each run

// //schedules the cron job-testing
// cron.schedule('* * * * *', async function() { // Run every minute for testing
//     cronJobCounter++;
//     console.log(`Cron Job run #${cronJobCounter}`);
//     setTimeout(() => {
//       console.log(`Expected number of runs in 12 hours: ${cronJobCounter * 24}`);
//       process.exit(0);
//     }, 30 * 60 * 1000); // 30 minutes x 60 seconds x 1000 milliseconds


//       const listing = await main();
//         // Log data, add frequency data to the dataFreq array
//     dataFreq.push({
//       runNumber: cronJobCounter,
//       dataCount: listing.length,
//     });
//     //print
//       console.log("Data Frequency in Each Cron Job Run:");
//       dataFreq.forEach(({ runNumber, dataCount }) => { 
//         console.log(`Run #${runNumber}: Data Count - ${dataCount}`);
//       });
    
    
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
    // });
    cron.schedule("*/30 * * * * *", function() {
   main();
    console.log('Running Cron Job');

});
