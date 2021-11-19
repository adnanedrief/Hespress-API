# Hespress-API
# Description

Hespress-API using Nodejs,ExpressJS,Cheerio,Request that can give you latest news data from Hespress

## Endpoints

Every page contains 10 articles so if you need 40 articles you should pass in the Endpoint 4 (that means 4 pages needed)

### Home Page
`yourdomaine.com/`
### English Data
`yourdomaine.com/english/nbrOfPageNeeded`

##### Exemple : 

If you  need data of 4 pages : `yourdomaine.com/english/4`

### French Data
`yourdomaine.com/french/nbrOfPageNeeded`

##### Exemple : 
If you  need data of 10 pages : `yourdomaine.com/french/10`

### Arabic Data
`yourdomaine.com/arabic/nbrOfPageNeeded`

##### Exemple : 
If you  need data of 2 pages : `yourdomaine.com/arabic/2`
# Installation

```javascript
npm i express cheerio cloudscraper request pretty nodemon
```
##  Usage

```javascript
nodemon index.js
```

#  Demo
### English Data

# Licence
Feel free to use this project, but don't claim it at yourself and mention credits.
