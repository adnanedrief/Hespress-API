# Hespress-API
# Description

Hespress-API using Nodejs,ExpressJS,Cheerio,Request that can give you latest news data from Hespress in arabic,french and english

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
#  Usage

```javascript
nodemon index.js
```

#  Demo
## Home

![home](https://raw.githubusercontent.com/adnanedrief/Hespress-API/main/Demo/home.png?token=ASH4O3WM5P2A6ZEQ3UU2BY3BVKL5I "home")

## English News Data

![](https://raw.githubusercontent.com/adnanedrief/Hespress-API/main/Demo/eng.png?token=ASH4O3V3SMTSVLDXTAFQS53BVKLRO)

## French News Data

![](https://raw.githubusercontent.com/adnanedrief/Hespress-API/main/Demo/fr.png?token=ASH4O3RPHSCRVFMU7KIJOX3BVKLRS)

## Arabic News Data

![](https://raw.githubusercontent.com/adnanedrief/Hespress-API/main/Demo/ar.png?token=ASH4O3WZU2MMC2DN2ABXKTDBVKLRK)

# Licence
*> **Feel free to use this project, but don't claim it at yourself and mention credits.***
