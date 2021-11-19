/* 
    all rights reserved to : 
        Author: "Adnane Drief",
        Link: "https://github.com/adnanedrief",
*/

const express = require("express");
const cheerio = require("cheerio");
const cloudscraper = require('cloudscraper');
const pretty = require("pretty");
const request = require('request');

const PORT = 3000;
const app = express();
let TargetURL = "https://en.hespress.com/"; // this default value can be changed according to route chosen

app.listen(PORT, () => console.log("Server running on PORT : " + PORT));
let owner = {
    Author: "Adnane Drief",
    Link: "https://github.com/adnanedrief",
    Description: "Hespress-API using Nodejs,ExpressJS,Cheerio,Request that can give you latest news data from Hespress"
};
let Articles = [owner];
let ArticlesIDs = [];
let ArticlesContent = [];
/// Every page contains 10 articles so if you need 40 articles you should pass to function 4 (that means 4 pages needeed)
async function ScrapeData(numberOfPagesNeeded = 2, query = `?action=ajax_listing&paged=`) {

    try {
        let j = 1;
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
                let exractID;
                if (TargetURL == 'https://hespress.com/') {
                    exractID = Article.link.substring(
                        Article.link.lastIndexOf("-") + 1,
                        Article.link.lastIndexOf("."))
                } else {
                    exractID = Article.link.substring(
                        Article.link.lastIndexOf("/") + 1,
                        Article.link.indexOf("-"))
                }
                Article.link = decodeArabicURL(Article.link); // if the URL is in EN/FR it doesn't change
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
async function fillIDs() {
    Articles.slice(1).forEach((Article) => ArticlesIDs.push(Article.id));
    // console.log(ArticlesIDs);
}

async function requestContent(id, query = "?action=ajax_next_post&id=") {

    request(TargetURL + query + id, function(error, response, body) {
        console.log("============\n");
        console.log('statusCode:', response.statusCode);
        const prettyMe = pretty(body);
        const $ = cheerio.load(prettyMe);
        const content = $('.article-content', prettyMe).text().trim().replace(/\s+/g, ' ');
        ArticlesContent.push(content);
        //console.log("============\n" + content); // uncomment this if you want see logs in console 
    });
}

async function slowedRequest() {
    for (let j = 0; j < ArticlesIDs.length; j++) {
        requestContent(ArticlesIDs[j]);
        await timeout(Math.random() * 100 + 500); // Wait random amount of time between [0.51, 0.59] seconds
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
    ArticlesContent = [];
    TargetURL = "https://en.hespress.com/";
}

function decodeArabicURL(href) {
    return decodeURIComponent(href.toString());
}
async function callMeWithYourLanguage(nbr) {
    await ScrapeData(nbr);
    await fillIDs();
    await slowedRequest();
    await fillContent();
}
app.get('/french/:nbr', async(req, res) => {
    TargetURL = "https://fr.hespress.com/";
    await callMeWithYourLanguage(req.params.nbr);
    res.send(Articles);
    await resetData();
})
app.get('/english/:nbr', async(req, res) => {
    TargetURL = "https://en.hespress.com/";
    await callMeWithYourLanguage(req.params.nbr);
    res.send(Articles);
    await resetData();
})
app.get('/arabic/:nbr', async(req, res) => {
    TargetURL = "https://hespress.com/";
    await callMeWithYourLanguage(req.params.nbr);
    res.send(Articles);
    await resetData();
})
app.get('/', async(req, res) => {
    res.send(Object.assign({ Home: "This is the Home Page" }, (owner)));
})