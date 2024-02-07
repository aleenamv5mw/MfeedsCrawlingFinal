require('dotenv').config();
const cron = require("node-cron");

const cheerio = require("cheerio");
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/torietuoviListing.js");
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

async function scrapelisting(page) {
await page.goto('https://www.etuovi.com/myytavat-tontit/tulokset?haku=M1075597570&rd=10', {timeout: 0});
const html = await page.content();
    const $ = cheerio.load(html);
    /* const example = await page.$('#km-ccw > div > div.consent-buttons > button.consent-buttons__yes');

await example.click({
  button: 'left',
}); */

//jQuery to scrape data from a web page

const listing = $("#announcement-list > div > div > div > div > div > a").map((index, element) => {
  const titleelement= $(element).find(" div > div > div > div > div > h4");                                     
   const title = $(titleelement).text();
   const url = $(element).attr("href"); 
  console.log(url)
        return{title,url}                                                                                                                                                                                                                                                                                
      })
.get();

return listing;
}
async function scrapejobdescription(listing, page){
    for(var i=0; i< 4;i++)
    {
      const { MongoClient } = require('mongodb');
      
      const client = new MongoClient( process.env.MONGO_URI,);
    
      
      // Connect to the MongoDB cluster
      await client.connect();
      console.log(listing[i].url);
      await findOneListingByName(client, listing[i].url);
      async function findOneListingByName(client, nameOfListing) {
          const cursor = await client.db("mfeeds_db").collection("torilistings").find({ url: nameOfListing }).toArray()
       
          if (cursor.length===0){
      
        await page.goto("https://www.etuovi.com"+listing[i].url,{timeout:60000});
        
        
        const url1=listing[i].url;
        //console.log(listing[i].url);
        const html= await page.content();
        const $  = cheerio.load(html);
         if (url1.match(/\/\w{1}\d{5}\?/)){
       
        const id=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div > span").text();
        const add=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4").text();
        const addinfo=add.replace(/\s+/g, ''); 
        const descrip=$("#infos > div > div:nth-child(2) > div:nth-child(2) > div > p").text();
        const description=descrip.replace(/\s+/g, '');
        const area=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div:nth-child(2) > div > div.flexboxgrid__col-xs-6__2c5DO.flexboxgrid__col-sm-3__28H0F.flexboxgrid__col-md-4__2DYW- > h3 > span").text();
        const address=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-md-6__1n8OT.ItemSummaryContainer__alignLeft__2IE5Z > h1").text();
        const building=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(5) > div > span").text();
        const Zoning=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(7) > div").text();
        const type=$("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div:nth-child(3) > div > a").text();
        
 
       const vendor="Eutovi(Tori)"//$("#contact > div.MuiGrid-root.MuiGrid-container.e1j97vdy5.mui-style-1uy4edm > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6.mui-style-18394z3 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e1j97vdy3.mui-style-bwhq8t > div.MuiGrid-root.MuiGrid-container.mui-style-1i8dzhp > div").text();
       
       
        
      
    

  // retrieve the value from the corresponding element
  
       listing[i].building=building;
        listing[i].id=id;
        listing[i].addinfo=addinfo;
        listing[i].Zoning=Zoning;
        listing[i].address=address;
        listing[i].area=area;
        listing[i].description=description;
        listing[i].type=type; 
        listing[i].vendor=vendor;
        
            
        } 

        //const vendor=new Array()
         if (url1.match(/\/\d{6}\?/)){
        const id=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const add=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4").text();
        const addinfo=add.replace(/\s+/g, ''); 
        const descrip=$("#infos > div > div:nth-child(2) > div:nth-child(2) > div > p").text();
        const description=descrip.replace(/\s+/g, '');
        const area=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div:nth-child(2) > div > div.flexboxgrid__col-xs-6__2c5DO.flexboxgrid__col-sm-3__28H0F.flexboxgrid__col-md-4__2DYW- > h3 > span").text();
        const address=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-md-6__1n8OT.ItemSummaryContainer__alignLeft__2IE5Z > h1").text();
        const building=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(6) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const Zoning=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(7) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4").text();
        const type=$("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div:nth-child(3) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4").text();
        //const vendor=$("#contact > div.MuiGrid-root.MuiGrid-container.brand.e1j97vdy5.mui-style-1uy4edm > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6.mui-style-18394z3 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e1j97vdy3.mui-style-bwhq8t > div.MuiGrid-root.MuiGrid-container.mui-style-1i8dzhp > div").text();
        const vendor="Eutovi(Tori)"//$("#contact > div.MuiGrid-root.MuiGrid-container.brand.e1j97vdy5.mui-style-1uy4edm > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6.mui-style-18394z3 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e1j97vdy3.mui-style-bwhq8t > div.MuiGrid-root.MuiGrid-container.mui-style-1i8dzhp > div").text();
        listing[i].building=building;
        listing[i].id=id;
        listing[i].addinfo=addinfo;
        listing[i].Zoning=Zoning;
        listing[i].address=address;
        listing[i].area=area;
        listing[i].description=description;
        listing[i].type=type;
        listing[i].vendor=vendor;

        } 
         if (url1.match(/\/\d{7}\?/)){
        
        const id=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span > font > font").text();
        const add=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd").text();
        const addinfo=add.replace(/\s+/g, ''); 
        const descrip=$("#infos > div > div:nth-child(2) > div:nth-child(2) > div > p").text();
        const description=descrip.replace(/\s+/g, '');
        const area=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div:nth-child(2) > div > div.flexboxgrid__col-xs-6__2c5DO.flexboxgrid__col-sm-3__28H0F.flexboxgrid__col-md-4__2DYW- > h3 > span").text();
        const address=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-md-6__1n8OT.ItemSummaryContainer__alignLeft__2IE5Z > h1").text();
        const building=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const Zoning=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div > div:nth-child(6) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const type=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-md-6__1n8OT.ItemSummaryContainer__alignLeft__2IE5Z > h2").text();
        const vendor="Eutovi(Tori)"//$("#contact > div.MuiGrid-root.MuiGrid-container.brand.e1j97vdy5.mui-style-1uy4edm > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6.mui-style-18394z3 > div").text();
        
        listing[i].building=building;
        listing[i].id=id;
        listing[i].addinfo=addinfo;
        listing[i].Zoning=Zoning;
        listing[i].address=address;//(Osoite)
        listing[i].area=area;
        listing[i].description=description;//Isännöinti
        listing[i].type=type;//Tyyppi
        listing[i].vendor=vendor;
        }  
         if(url1.match(/\/\d{8}\?/)){
         
        const id=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        
        const add=$("#showings > div:nth-child(4) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd").text();
        const addinfo=add.replace(/\s+/g, ''); 
        const descrip=$("#infos > div > div:nth-child(2) > div:nth-child(2) > div > p").text();
        const description=descrip.replace(/\s+/g, '');
        const area=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div:nth-child(2) > div > div.flexboxgrid__col-xs-6__2c5DO.flexboxgrid__col-sm-3__28H0F.flexboxgrid__col-md-4__2DYW- > h3 > span").text();
        const address=$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-md-6__1n8OT.ItemSummaryContainer__alignLeft__2IE5Z > h1").text();
        const building=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(8) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const Zoning=$("#showings > div:nth-child(5) > div:nth-child(2) > div > div > div > div > div > div:nth-child(10) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > span").text();
        const type=$("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div:nth-child(3) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4 > a").text();
        const vendor="Eutovi(Tori)"//$("#contact > div.MuiGrid-root.MuiGrid-container.e1j97vdy5.mui-style-1uy4edm > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-6.mui-style-18394z3 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e1j97vdy3.mui-style-bwhq8t > div > div > div").text();
        
        module.exports = url1;
        console.log("data")

    
        listing[i].building=building;
        listing[i].id=id;
        listing[i].addinfo=addinfo;
        listing[i].Zoning=Zoning;
        listing[i].address=address;
        listing[i].area=area;
        listing[i].description=description;
        listing[i].type=type; 
        listing[i].vendor=vendor;  
            
        }
        console.log(listing[i].building);
        console.log(listing[i].id)
        console.log(listing[i].addinfo);
        console.log(listing[i].Zoning);
        console.log(listing[i].address);
        console.log(listing[i].area);
        console.log(listing[i].description);
        console.log(listing[i].type);
        console.log(listing[i].vendor);
        console.log(listing[i].ven1);
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
        //await sleep(3000);
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
  //test
  //cron.schedule('*/40 * * * *', async function() {
// let cronJobCounter = 0;
// const dataFreq = [];
// cron.schedule('* * * * *', async function() { // Run every minute for testing
//   cronJobCounter++;
//   console.log(`Cron Job run #${cronJobCounter}`);
//   setTimeout(() => {
//     console.log(`Expected number of runs in 12 hours: ${cronJobCounter * 24}`);
//     process.exit(0);
//   }, 30 * 60 * 1000); // 30 minutes x 60 seconds x 1000 milliseconds

// const listing = await main();

// // Log data, add frequency data to the dataFreq array
// dataFreq.push({
//   runNumber: cronJobCounter,
//   dataCount: listing.length,
// });
// //print
//   console.log("Data Frequency in Each Cron Job Run:");
//   dataFreq.forEach(({ runNumber, dataCount }) => { 
//     console.log(`Run #${runNumber}: Data Count - ${dataCount}`);
//   });


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

// console.log('Running Cron Job');
// });
cron.schedule("*/20 * * * * ", function() {
   main();
    console.log('Running Cron Job');

});


