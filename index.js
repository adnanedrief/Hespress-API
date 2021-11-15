const express = require("express");
const cheerio = require("cheerio");
const cloudscraper = require('cloudscraper');
const pretty = require("pretty");

const PORT = 3000;
const app = express();
const TargetURL = "https://en.hespress.com/";

app.listen(PORT, () => console.log("Server running on PORT : " + PORT));

async function ScrapeData() {
    try {
        let numberOfDataNeeded = 1;
        while (numberOfDataNeeded < 10) {
            numberOfDataNeeded++;
            let response = await cloudscraper.get(TargetURL + `?action=ajax_listing&paged=${i}`); // return String 
            const $ = await cheerio.load(response);
            const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.

            $('.cover', prettyMe).each(function() {
                console.log($(this).find('.date-card').text());
                console.log($(this).find('.cat').text()); // category
                console.log($(this).find('.card-title').text());
                console.log($(this).find('.card-img-top').find('a').attr('href'));
            });
        }
    } catch (error) {
        console.log(error);
    }
}
ScrapeData();