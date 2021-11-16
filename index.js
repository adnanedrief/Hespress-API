const express = require("express");
const cheerio = require("cheerio");
const cloudscraper = require('cloudscraper');
const pretty = require("pretty");

const PORT = 3000;
const app = express();
const TargetURL = "https://en.hespress.com/";

app.listen(PORT, () => console.log("Server running on PORT : " + PORT));
let owner = {
    Author: "Adnane Drief",
    link: "github.com",
    description: "For fun"
};
let Articles = [owner];

async function ScrapeData(numberOfPagesNeeded = 2) {
    //res.render("Waiting...");
    // let numberOfPagesNeeded = 3;
    try {
        let j = 1;
        for (let index = 1; index <= numberOfPagesNeeded; index++) {

            let response = await cloudscraper.get(TargetURL + `?action=ajax_listing&paged=${index}&all_listing=1`); // return String 
            const $ = await cheerio.load(response);
            const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.

            $('.cover', prettyMe).each(function() {
                const Article = {
                    number: 0,
                    date: "",
                    category: "",
                    title: "",
                    link: ""
                };

                Article.number = j;
                j++;
                Article.date = $(this).find('.date-card').text().trim();
                Article.category = $(this).find('.cat').text().trim(); // category
                Article.title = $(this).find('.card-title').text().trim();
                Article.link = $(this).find('.card-img-top').find('a').attr('href');
                Articles.push(Article);
            });
            console.clear(); // to add clear last line in console and not all console
            console.log("Waiting...." + index);
        }
        console.log(Articles);
        // res.send(Articles);
        // Articles = []; // to clear last data send after the data received , for not having any conflict
    } catch (error) {
        console.log(error);
    }
}
app.get('/', async function(req, res) {
    // res.send("Waiting...");
    await ScrapeData();
    res.send(Articles);
    Articles = [owner]; // to clear last data send after the data received , for not having any conflict
})