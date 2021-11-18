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
let ArticlesIDs = [];
let ArticlesContent = [];
async function ScrapeData(numberOfPagesNeeded = 2, query = `?action=ajax_listing&paged=`) {

    try {
        let j = 1;
        // numberOfPagesNeeded = m/nbr nbr articiles per pages
        for (let index = 1; index <= numberOfPagesNeeded; index++) {

            let response = await cloudscraper.get(TargetURL + query + index); // return String 
            const $ = cheerio.load(response);
            const prettyMe = pretty($.html()); // The html() method sets or returns the content of the selected elements.

            $('.cover', prettyMe).each(function() {
                const Article = {
                    number: 0,
                    date: "",
                    category: "",
                    title: "",
                    id: "",
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

                let exractID = Article.link.substring(
                    Article.link.lastIndexOf("/") + 1,
                    Article.link.indexOf("-")
                );
                Article.id = exractID;

                Articles.push(Article);
            });
            console.clear();
            console.log("Waiting...." + index);
        }
        //console.log(Articles); // uncomment this if you want see logs in console 
    } catch (error) {
        console.log(error);
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fillID() {
    Articles.slice(1).forEach((Article) => ArticlesIDs.push(Article.id));
    // console.log(ArticlesIDs);
}

var fillthecontent; // used the global scoope cuz the request isn't a promise that can return me a promise to be handle
async function requester(id, query = "?action=ajax_next_post&id=") {

    request(TargetURL + query + id, function(error, response, body) {
        console.log("============\n");
        console.log('statusCode:', response.statusCode);
        const prettyMe = pretty(body);
        const $ = cheerio.load(prettyMe);
        const content = $('.article-content', prettyMe).text().trim().replace(/\s+/g, ' ');
        fillthecontent = content;
        ArticlesContent.push(fillthecontent);
        //console.log("============\n" + fillthecontent); // uncomment this if you want see logs in console 
    });
}

async function slowedForLoop() {
    for (let j = 0; j < ArticlesIDs.length; j++) {
        requester(ArticlesIDs[j]);
        await timeout(Math.random() * 100 + 500); // Wait random amount of time between [0.51, 0.59] seconds
        // await this.timeout(Math.random() * 100 + 500) 
    }
}
async function fillContent() {
    let i = 0;
    Articles.slice(1).forEach((Article) => {
        Article.content = ArticlesContent[i];
        i++
    })
}
async function resetData() {
    Articles = [owner];
    ArticlesIDs = [];
    fillthecontent = '';
}
app.get('/:nbr', async function(req, res) {
    await ScrapeData(req.params.nbr);
    await fillID();
    await slowedForLoop();
    await fillContent();
    res.send(Articles);
    await resetData();
})