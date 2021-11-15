const express = require("express");
const cheerio = require("cheerio");
const cloudscraper = require('cloudscraper');
const pretty = require("pretty");

const PORT = 3000;
const app = express();
const TargetURL = "https://en.hespress.com/";

app.listen(PORT, () => console.log("Server running on PORT : " + PORT));

let Articles = [];
let i = 1;
async function ScrapeData() {
    try {
        let numberOfPagesNeeded = 1;
        // let Articles = [];
        let Article = {
            number: "",
            date: "",
            category: "",
            title: "",
            link: ""
        };

        while (numberOfPagesNeeded < 500) {
            i++;
            numberOfPagesNeeded++;
            let response = await cloudscraper.get(TargetURL + `?action=ajax_listing&paged=${numberOfPagesNeeded}`); // return String 
            const $ = await cheerio.load(response);
            const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.

            $('.cover', prettyMe).each(function() {
                console.log(i); // to fix this counter later
                i++;
                Article.number = i;
                Article.date = $(this).find('.date-card').text().trim();
                Article.category = $(this).find('.cat').text().trim(); // category
                Article.title = $(this).find('.card-title').text().trim();
                Article.link = $(this).find('.card-img-top').find('a').attr('href');
                Articles.push(Article);
            });
            // console.clear(); // to add clear last line in console and not all console
            console.log("Waiting...." + i);


        }
        console.log(Articles);
    } catch (error) {
        console.log(error);
    }
    app.get('/', function(req, res) {
        res.send(Articles);
    })
}
ScrapeData();