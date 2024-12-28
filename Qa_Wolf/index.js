/**
 * Author: Michael Adogeri
 * Date: 10-16-2024
 * Title: QA Wolf Take Home Assignment
 * Objectives:
 * 1. Edit the `index.js` file in this project to go to 
 * Hacker News/newest](https://news.ycombinator.com/newest)
 * and validate that EXACTLY the first 100 articles are 
 * sorted from newest to oldest.
 * 2. Explain why you want to work at QA Wolf? record a short, 
 *~2 min video that includes:
        i.  Your answer 
        ii. A walk-through demonstration of your code, showing 
            a successful execution
 */
// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

// function returns the current number of users from the Hacker News API 
async function maximumUsers(){
  try{
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Get the maximum number of users from the Hacker News API
    const response = await page.goto(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`);
    const itemDetails = await response.json();

    return itemDetails - 1; // to avoid going out of bounds 
  }catch(error){
    console.log(`Error listed as: ${error}`);
  }
}

// main runner via. start of execution
(async () => {
  try{
    const maxUsers = await maximumUsers(); // Get the current total number of users
    console.log(`Current maximum users:  ${maxUsers}`)                
    await fetchHackerNewsItem(maxUsers); // extract the first 100 articles, sorted from newest to oldest
  }catch(error){
    console.log(`Error listed as: ${error}`);
  }
  
})();


// fetching the first 100 current post from the Hackers News API
async function fetchHackerNewsItem(itemIds) {
  try{
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
  
  // iterating to retrieve the first 100 current post from the Hackers news API
    for(let idx = 0; idx < 100;  idx++){
      let condition = true;
      let response = await page.goto(`https://hacker-news.firebaseio.com/v0/item/${itemIds-=idx}.json`);
      let itemDetails = await response.json();
      // check for current valid Id's
      while(condition){
        if (itemDetails.title == null || itemDetails.id == null ){
          --itemIds;
          response =  await page.goto(`https://hacker-news.firebaseio.com/v0/item/${itemIds}.json`); 
          itemDetails = await response.json();
        }
        else{
          condition = false;
        }
      }
      console.log(`${idx+1}.`); 
      displayContent(itemDetails); // print content to console
    }
    await browser.close(); // closing browser via. conformation
    console.log("Browser closed...");
  }catch(error){
    console.log(`Error listed as: ${error}`);
  }
}

// helper function to display retrieved items to the console
function displayContent(items){
  console.log(`Title: ${items.title}`);
  if (items.score <= 1){
    console.log(`${items.score} point by Author: ${items.by}`); 
  }else{
    console.log(`${items.score} points by Author: ${items.by}`);
  }
  console.log(`Number of comments: ${items.descendants}`);
  console.log(`Link: ${items.url}`);
  console.log(`Date of post: ${new Date(items.time * 1000).toLocaleString()}`);
  console.log("------------------------------------------------------------------------");
}