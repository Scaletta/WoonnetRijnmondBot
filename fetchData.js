const fs = require("fs/promises")
const puppeteer = require("puppeteer")
const axios = require("axios")

axios.defaults.withCredentials = true;
let cookieNamesAndValues;
let inschrijfnummer;
let woonwens;
let woonaanbod;
let woonaanbodViaIDs;
async function fetchCookies(){
    const username = process.env.npm_config_username;
    const password = process.env.npm_config_password;
    if (typeof username === 'undefined' || typeof password === 'undefined') {
        console.error("Username or Password is not set!")
        return;
    }
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // Login
    await page.goto("https://www.woonnetrijnmond.nl/inloggeninschrijven/")
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('.inloggen-btn');
    await page.waitForNavigation();
    if(page.url() === "https://www.woonnetrijnmond.nl/mijn-account/"){
        console.debug("Login successful.");
    }
    else{
        console.error("Cant login on Woonnnet Rijnmond.");
        await browser.close()
        return;
    }
    // Get cookies
    const cookiesResponse = await page.cookies();
    const cookies = cookiesResponse.map(({name, value}) => ({name, value}));
    const cookiesJson = JSON.stringify(cookies);
    const cookieStrings = cookies.map(({name, value}) => `${name}=${value}`);
    cookieNamesAndValues = cookieStrings.join('; ');
    // Write cookies
    await fs.writeFile(__dirname + '/data/cookies.json', cookiesJson);
    console.debug("Written cookies to data.json.");
    await browser.close()
    console.info("Fetched cookies from Woonnet Rijnmond!");
}
function getWoonwens(){
    axios.default.request({
        'withCredentials': true,
        'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/Woonwensen/wsWoonwensen.asmx/GetWoonwens',
        'method': 'post',
        'headers': {
                'Content-Type': "application/json; charset=utf-8",
                'Cookie': cookieNamesAndValues.toString()
            }
        })
        .then(async response => {
            woonwens = response.data;
            const woonwensJson = JSON.stringify(woonwens);
            await fs.writeFile(__dirname + '/data/woonwens.json', woonwensJson).then(response => {
                console.info("Written woonwens to woonwens.json.");
            });
        })
        .catch(async error =>{
            console.error("Cant write woonwens to woonwens.json.")
        })
}
function getWoonaanbod(){
    axios.default.request({
        'withCredentials': true,
        'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/Woonwensen/wsWoonwensen.asmx/GetWoonwensResultatenVoorPaginaByInschrijfnummer',
        'method': 'post',
        'headers': {
            'Content-Type': "application/json; charset=utf-8",
            'Cookie': cookieNamesAndValues.toString()
        },
        'data': {
            paginaNummer: 1,
            paginaGrootte: 50,
            filterMode: "AlleenActueel"
        }
    })
        .then(async response => {
            woonaanbod = response.data;
            const woonaanbodJson = JSON.stringify(woonaanbod);
            await fs.writeFile(__dirname + '/data/woonaanbod.json', woonaanbodJson).then(response => {
                console.info("Written woonaanbod to woonaanbod.json.");
                getWoonaanbodViaIDs();
            });
        })
        .catch(async error =>{
            console.error("Cant write woonaanbod to woonaanbod.json. Error: " + error.toString())
        })
}
function getWoonaanbodViaIDs(){
    let tussenposities = [];
    inschrijfnummer = woonaanbod.d.resultaten[0].Inschrijfnummer;
    const frontendAdvertentieIds = woonaanbod.d.resultaten.map(obj => obj.FrontendAdvertentieId);
    axios.default.request({
        'withCredentials': true,
        'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/WoningenModule/Service.asmx/getAanbodViaIds',
        'method': 'post',
        'headers': {
            'Content-Type': "application/json; charset=utf-8",
            'Cookie': cookieNamesAndValues.toString()
        },
        'data': {
            "Ids": frontendAdvertentieIds.join(";"),
            "velden":"id;advertentienummer;complexid;straat;huisnummer;huisletter;huisnummertoevoeging;aanduiding;wijk;plaats;gebruik;objecttype;totaleoppervlakte;totaaloppervlaktemin;totaaloppervlaktemax;aantalslaapkamers;aantalslaapkamersmin;aantalslaapkamersmax;balkon;tuin;labels;eengezinswoning;flatmetlift;flatzonderlift;bovenwoning;maisonettewoning;benedenwoning;kalehuur;koopprijs;kalehuurmin;totalekoopprijsmin;passendheid;verdeelmodel;media;publstart;publstop;preview;criteriaurgentie;tijdelijkeverhuur;showrotterdamwet;middenhuur",
            "inschrijfnummerTekst":inschrijfnummer,
            "setKenmerkenIngelogd":false,
            "addAantalReacties":true,
            "Volgorde":"",
            "inclusiefNieuwAanbod":false
        }
    })
        .then(async response => {
            woonaanbodViaIDs = response.data;
            const woonaanbodViaIDsJson = JSON.stringify(woonaanbodViaIDs);
            await fs.writeFile(__dirname + '/data/beschikbarewoningen.json', woonaanbodViaIDsJson).then(async () => {
                console.info("Written beschikbarewoningen to beschikbarewoningen.json.");
                for (const woning of woonaanbodViaIDs.d) {
                    const advId = woning.advertentienummer;
                    const positie = await GetTussenPositie(advId);
                    const resultObject = {advId, positie};
                    tussenposities.push(resultObject);
                }
                await fs.writeFile(__dirname + '/data/tussenposities.json', JSON.stringify(tussenposities));
                console.info("Written tussenposities to tussenposities.json.");
                tussenposities.forEach((tussenpositie) => {
                    woonaanbodViaIDs.d.forEach((woning) => {
                        if (tussenpositie.advId === woning.advertentienummer) {
                            woning.reageerpositie = tussenpositie.positie;
                        }
                    });
                });
                const woonaanbodViaIDsJson = JSON.stringify(woonaanbodViaIDs);
                await fs.writeFile(__dirname + '/data/beschikbarewoningen.json', woonaanbodViaIDsJson).then(async () => {
                    console.info("Written tussenposities to beschikbarewoningen.json.");
                })
            });
        })
        .catch(async error =>{
            console.error("Cant write beschikbarewoningen to beschikbarewoningen.json. Error: " + error.toString())
        })
}
function GetTussenPositie(advId){
    return new Promise((resolve, reject) => {
        axios.default.request({
            'withCredentials': true,
            'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/WoningenModule/Service.asmx/GetTussenPositie',
            'method': 'post',
            'headers': {
                'Content-Type': "application/json; charset=utf-8",
                'Cookie': cookieNamesAndValues.toString()
            },
            'data': {
                "advId": advId,
                "inschrijfnummerTekst": inschrijfnummer,
                "heeftGereageerd": false
            }
        })
            .then(async response => {
                let tussenpositie = response.data;
                //await fs.writeFile(__dirname + '/data/tussenposities.json', tussenpositieJson);
                console.info("Fetched tussenpositie for: " + advId + "=" + tussenpositie.d);
                resolve(tussenpositie.d);
            })
            .catch(async error => {
                console.error("Cant write tussenposities to tussenposities.json. Error: " + error.toString())
                reject(error)
            })
    });
}
function start() {
    fetchCookies().then(() => {
        getWoonwens();
        getWoonaanbod();
    });
}
start();
