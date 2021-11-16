const express = require("express");
const cheerio = require("cheerio");
const cloudscraper = require('cloudscraper');
const pretty = require("pretty");
const request = require('request');

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

async function ScrapeData(numberOfPagesNeeded = 1) {

    try {
        let j = 1;
        // numberOfPagesNeeded = m/nbr nbr articiles per pages
        for (let index = 1; index <= numberOfPagesNeeded; index++) {

            let response = await cloudscraper.get(TargetURL + `?action=ajax_listing&paged=${index}&all_listing=1`); // return String 
            const $ = cheerio.load(response);
            const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.

            $('.cover', prettyMe).each(async function() {
                const Article = {
                    number: 0,
                    date: "",
                    category: "",
                    title: "",
                    img: "",
                    link: "",
                    content: ""
                };

                Article.number = j;
                j++;
                Article.date = $(this).find('.date-card').text().trim();
                Article.category = $(this).find('.cat').text().trim(); // category
                Article.title = $(this).find('.card-title').text().trim();
                Article.img = $(this).find('.ratio-medium').find('img').attr('src');
                Article.link = $(this).find('.card-img-top').find('a').attr('href');

                let exractID = await Article.link.substring(
                    Article.link.lastIndexOf("/") + 1,
                    Article.link.indexOf("-")
                );
                console.log(exractID);
                await request(TargetURL + `?action=ajax_next_post&id=${exractID}`, function(error, response, body) {
                    //console.log(body);
                    const $ = cheerio.load(body);
                    const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.
                    Article.content = $('.article-content', prettyMe).find('p').text().trim();
                    console.log(Article.content);
                });
                Articles.push(Article);
            });
            console.clear();
            console.log("Waiting...." + index);
        }
        console.log(Articles);
    } catch (error) {
        console.log(error);
    }
}

app.get('/', async function(req, res) {
    await ScrapeData();
    res.send(Articles);
    Articles = [owner];
})