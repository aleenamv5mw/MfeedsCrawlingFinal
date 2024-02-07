require('dotenv').config();
const cron = require("node-cron");
//const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const http = require('http');
const mongo = require("mongodb");
const Listing = require("./model/hListing");
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
await page.goto('https://www.huoneistokeskus.fi/myytavat-asunnot?page=%22.$page.%22&MinUnencumberedSalesPrice=&MaxUnencumberedSalesPrice=&Id=&MinLivingArea=&MaxLivingArea=&MinPlotArea=&MaxPlotArea=&MinConstructionYear=&MaxConstructionYear=&SaleStartedDaysAgo=&NewProperty=include&service=Residences&orderby=SaleStarted+desc&top=12&op=Hae&trigger_field=&form_build_id=form-kkDNbXywW0nXW6E94lxLs1h9y60W94alIReIWA_htdQ&form_id=realia_masteri_search_form_builder', {timeout:0});
const html = await page.content();
    const $ = cheerio.load(html);
    const example = await page.$('#onetrust-reject-all-handler');

await example.click({
  button: 'left',
}); 
//JQuery Scrape the web page

const listing = $("#content > div > div > div.panel-panel.panel-col-middle-wide.panel-top-level > div > div.panel-pane.pane-residence-search-result > div > div.search-result-list > a").map((index, element) => {
    const titleelement= $(element).find("div > div.card-detail-wrapper > div.card-bottom > div > div.title");                                     
     const title = $(titleelement).text();
     const url = $(element).attr("href");                                                                                                                  
      return{title, url};                                             
 
})
.get();
console.log("scrape listing check");
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
          const cursor = await client.db("mfeeds_db").collection("hlistings").find({ url: nameOfListing }).toArray()
        
          if (cursor.length===0)
          {
         await page.goto(listing[i].url);
        const html= await page.content();
        const $ = cheerio.load(html);
        
        const data =$("#content > div > div.clearfix.container.set-main-container > div.property-main > div > pre").text();
        const datadescription=data.replace(/\s+/g, '');   
        const add=$("#content > div > div.set-main-container.hyphenate.detail-container.container > div > div.details-wrapper > div:nth-child(3) > div.value").text();
        const address=add.replace(/\s+/g, '');   
        //const ven=$("#content > div > div.clearfix.container.set-main-container > div.broker-and-promo-wrapper.clearfix > div.left-block > div > div.clearfix.broker.broker-partial > div.broker-details").text();
        const vendor="Huoneistokeskus."//ven.replace(/\s+/g, '');                                                  
        const type=$("body > main > section > div.content.content--primary-background.center-on-wallpaper.padded.padded--v30-h15.padded--desktop-v50-h15.padded--xdesktop-v50-h0.padded--topless > div > div > div:nth-child(4) > div.details-grid__item-text > dl:nth-child(2) > dd").text();
        const ye=$("#content > div > div.set-main-container.hyphenate.detail-container.container > div > div.details-wrapper > div:nth-child(8) > div.value").text();
        const year=ye.replace(/\s+/g, ''); 
        const corr=$("#content > div > div.set-main-container.hyphenate.detail-container.container > div > div.details-wrapper > div:nth-child(27) > div.value").text();
        const correction=corr.replace(/\s+/g, ''); 
        const area=$("#content > div > div.clearfix.container.set-main-container > div.property-top > div.top-specs-wrapper > div.specs-wrapper > h3.specs-short > strong").text();
        const price=$("#content > div > div.clearfix.container.set-main-container > div.property-top > div.top-specs-wrapper > div.specs-wrapper > h3.price-short > strong").text();

        listing[i].datadescription = datadescription; //Isännöinti
        listing[i].address=address;//Osoite
        listing[i].vendor=vendor;
        listing[i].type=type;//Kohdetyyppi
        listing[i].year=year; //Rakennusvuosi
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
//scheduled the cron job
cron.schedule('* * * * * * ', async function() {
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
//  console.log('Running Cron Job');

//});


// (#apartment-specs > div:nth-child(1) > div.sc-ecaExY.mPZZQ > div:nth-child(2) > span.sc-jMMfwr.bzNyAW).text()
// #apartment-specs > div:nth-child(1) > div.sc-hgRTRy.kUSLIY > div:nth-child(2) > span.sc-feryYK.KAgbu > font > font
//#apartment-specs > div:nth-child(1) > div.sc-ESoVU.dySeie > div:nth-child(2) > span.sc-cZBZkQ.jyfRaj > font > font
//#apartment-heading > div.sc-hMrMfs.dQryMR > div.sc-drlKqa.gYfhDV

//#\32 1464337
//#\32 0292398
//html > body > div > div > div > div > div > div > div > div > div > div > div > div > a
//html/body/div[2]/div/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div/a/div/div[2]/div/div[1]/div[1]/h5


// $("html > body > div > div > div > div > div > div > div > div > div > div > div > div > a").each((index,element) =>  {
//     console.log($(element).attr("href")) 
//   })
//$("html > body > div > div > div > div > div > div > div > div > div > div > div > div > a > div > div > div  > div > div > h5").each((index,element) =>  {
    //console.log($(element).text()) 
  //})

 // $("html > body > div > div > div > div > div > div > div > div > div > div > div > div > a").each((index, element) => {
  //  const titleelement= $(element).find("a > div > div > div  > div > div > h5");                                     
     //const title = $(titleelement).text();
     //const url = $(element).attr("href");                               
    //});   
    
    //#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div:nth-child(10) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4
    //$("#showings > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-12__3lVf6.flexboxgrid__col-md-8__161oS.flexboxgrid__col-lg-8__2H2vd > div:nth-child(12) > div.flexboxgrid__col-xs-12__1I1LS.flexboxgrid__col-sm-8__2jfMv.CompactInfoRow__content__3jGt4").text();
    //$("#infos > div > div.flexboxgrid__col-xs-12__1I1LS.ItemSummaryContainer__itemTitleContainer__cDLuQ > div > div:nth-child(2) > div > div.flexboxgrid__col-xs-4__p2Lev.flexboxgrid__col-md-3__1YPhN > h3").text();
   // ("#announcement-list > div.MuiGrid-root.MuiGrid-container.e1wmqowa1.mui-style-sjvcny > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-true.e1wmqowa0.mui-style-kp8qra > div.MuiGrid-root.MuiGrid-container.ListPage__items__3n9Bd.mui-style-1d3bbye > div > div> a").map((index, element) => {
      /*const titleelement= $(element).find(".MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-1547ak > h5");                                     
       const title = $(titleelement).text();
       const url = $(element).attr("href");                                                                                                                  
        console.log(title);                                            */