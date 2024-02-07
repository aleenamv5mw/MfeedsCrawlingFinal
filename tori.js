require('dotenv').config();
const cheerio = require("cheerio");
const cron = require('node-cron');
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/toriListing");
const mongoose = require('mongoose');
//bot protection
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Register the Stealth plugin
puppeteer.use(StealthPlugin());



async function connectToMongoDb() //connection to mongodb
{
  await mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  );
  
  console.log("connected")
}


async function scrapelisting(page) {
await page.goto('https://www.tori.fi/koko_suomi?q=&cg=1030&w=3&st=s&ht=&ps=&pe=&ca=18&l=0&md=th', {timeout: 0});
const html = await page.content();
    const $ = cheerio.load(html);
    /* const example = await page.$('#km-ccw > div > div.consent-buttons > button.consent-buttons__yes');

await example.click({
  button: 'left',
}); */
//jQuery to scrape data from a web page

const listing = $("#blocket > div.main > div > div > div.list_mode_thumb >a").map((index, element) => {
    const titleelement= $(element).find("div.desc_flex > div.ad-details-left > div.li-title");                                     
 const title = $(titleelement).text();
    
     const url = $(element).attr("href"); 
          return{title,url}
})
.get();
return listing;
}




async function scrapejobdescription(listing, page){
    for(var i=0; i<5;i++)
    
    {
      const { MongoClient } = require('mongodb');
      
      const client = new MongoClient(process.env.MONGO_URI);
    
      
      // Connect to the MongoDB cluster
      await client.connect();
      await findOneListingByName(client, listing[i].url);
      async function findOneListingByName(client, nameOfListing) {
          const cursor = await client.db("mfeeds_db").collection("torilistings").find({ url: nameOfListing }).toArray()
        
          if (cursor.length===0){
  

     const url1= listing[i].url;
     if (url1.match(/\/\d{8}\?/))
     {
      await page.goto(listing[i].url);
            const html= await page.content();
            const $ = cheerio.load(html);
            const address=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(1) > dl > div:nth-child(1) > dd").text();
            const area=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h15.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div > div:nth-child(2) > div.details-grid__item-text > dl > dd ").text();
            const type=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-details-container > div:nth-child(3) > dl > div:nth-child(1) > dd").text();
            const descrip=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h0.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div.listing-columns > div.listing-columns__left > div.listing-overview").text();
            const description=descrip.replace(/\s+/g, ''); 
            listing[i].type= type;
            console.log(listing[i].type);
            listing[i].description = description;
            console.log(listing[i].description);
            listing[i].area = area;
            console.log(listing[i].area);
            listing[i].address = address;
            console.log(listing[i].address);
            let ts = Date.now();

        let date_time = new Date(ts);
        let date = date_time.getDate();
        let month = date_time.getMonth() + 1;
        let year1 = date_time.getFullYear();

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
        await page.goto(listing[i].url);
            const html= await page.content();
            const $ = cheerio.load(html);
            
            //const datadescription = $("#blocket > div.main > div > div > div.view > div.content_area.content_area_660 > div.view_content > div.details > div:nth-child(3) > div.body").text();
            const price1= $("#blocket > div.main > div > div > div.view > div.content_area.content_area_660 > div > div.subject > div.price > span").text();
            const price=price1.replace(/\s+/g, ''); 
            //const vend=$("#seller_info > div").text();
            const vendor="Tori"//vend.replace(/\s+/g, ''); 
            const descrip=$("#blocket > div.main > div > div > div.view > div.content_area.content_area_660 > div > div.details > div:nth-child(3) > div.body").text();
            const description=descrip.replace(/\s+/g, ''); 
            
            listing[i].description = description;
            listing[i].price=price;
            console.log(listing[i].price);
           listing[i].vendor=vendor;
           console.log(listing[i].vendor);
           console.log(listing[i].description);
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
  //cron.schedule('*/10 * * * *', async function() {
//     let cronJobCounter = 0;
// const dataFreq = [];
// cron.schedule('* * * * *', async function() { // Run every minute for testing
//   cronJobCounter++;
//   console.log(`Cron Job run #${cronJobCounter}`);
//   setTimeout(() => {
//     console.log(`Expected number of runs in 12 hours: ${cronJobCounter * 24}`);
//     process.exit(0);
//   }, 30 * 60 * 1000); // 30 minutes x 60 seconds x 1000 milliseconds
//     const listing = await main();
//   // Log data, add frequency data to the dataFreq array
//   dataFreq.push({
//     runNumber: cronJobCounter,
//     dataCount: listing.length,
//   });
  
//   //print
//     console.log("Data Frequency in Each Cron Job Run:");
//     dataFreq.forEach(({ runNumber, dataCount }) => { 
//       console.log(`Run #${runNumber}: Data Count - ${dataCount}`);
//     });

//     if (!listing || listing.length === 0 || listing.some(item => !item.title || !item.url))  {
//       console.log('Sending email...');
  
//       const transporter = nodemailer.createTransport({
        
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//           user: 'revtemp123@gmail.com',
//           pass: 'vsdfabpoyvkwvqln'
//         }
//       });
  
//       const message = {
//         from: 'revtemp123@gmail.com',
//         to: ['revathi.r@meltwater.com','revathir1610@gmail.com'],
//         subject: 'Test Email',
//         text: 'This is a test email message'
//       };
      
//       transporter.sendMail(message, (err, info) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(info);
//         }
//       });
//     } else {
//       console.log('Listing is not empty, not sending email.');
//     }
  
//     console.log('Running Cron Job');
//   });
  cron.schedule("*/15 * * * * *", function() {
    main();
    console.log('Running Cron Job');

});
    ///html/body/main/listing-search/section[2]/div/div/div/search-result-cards-v2/div/div[1]/card-v2/card-v2-regular/a
///html > body > main > listing-search > section > div > div > div > search-result-cards-v2 > div > div > card-v2 > card-v2-regular > a > div > div > card-v2-features > div > div > div