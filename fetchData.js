const fs = require("fs/promises")
const puppeteer = require("puppeteer")
const axios = require("axios")

axios.defaults.withCredentials = true;
let config;
let cookieNamesAndValues;
let inschrijfnummer;
let woonwens;
let woonaanbod;
let woonaanbodViaIDs;
let data = {
    woningen: [],
    refreshDate: Date.now()
};
let oldData;
let newData;

const debug = process.env.npm_config_debug || process.env.DEBUG;
const username = process.env.npm_config_username || process.env.USERNAME;
const password = process.env.npm_config_password || process.env.PASSWORD;
if (typeof username === 'undefined' || typeof password === 'undefined') {
    console.error("Username or Password is not set!")
    return;
}

async function writeToFile(name, data, folder = '/', force = false) {
    if (debug || force) {
        await fs.writeFile(__dirname + '/data' + folder + name + '.json', data).then(() => {
            console.info("Written " + name + " to " + folder + name + ".json.");
        }).catch((error) => {
            console.error("Cant write " + name + " to " + folder + name + ".json. --- Error: " + error.toString());
        });
    }
}

async function fetchCookies() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // Login
    await page.goto("https://www.woonnetrijnmond.nl/inloggeninschrijven/")
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('.inloggen-btn');
    await page.waitForNavigation();
    if (page.url() === "https://www.woonnetrijnmond.nl/mijn-account/") {
        console.debug("Login successful.");
    } else {
        console.error("Cant login on Woonnnet Rijnmond.");
        await browser.close()
        return;
    }
    // Get cookies
    const cookiesResponse = await page.cookies();
    const cookies = cookiesResponse.map(({name, value}) => ({name, value}));
    const cookieStrings = cookies.map(({name, value}) => `${name}=${value}`);
    cookieNamesAndValues = cookieStrings.join('; ');
    // Write cookies
    await writeToFile('cookies', JSON.stringify(cookies));
    await browser.close();
    console.info("Fetched cookies from Woonnet Rijnmond!");
}

function getWoonwens() {
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
            await writeToFile('woonwens', JSON.stringify(woonwens));
            console.info("Fetched woonwens successfully.");
        })
        .catch(async error => {
            console.error("Cant fetch woonwens. --- Error: " + error.toString())
        })
}

function getWoonaanbod() {
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
            console.info("Fetched woonaanbod successfully");
            await writeToFile('woonaanbod', JSON.stringify(woonaanbod))
            getWoonaanbodViaIDs();
        })
        .catch(async error => {
            console.error("Cant fetch woonaanbod. --- Error: " + error.toString())
        })
}

function getWoonaanbodViaIDs() {
    let tussenposities = [];
    let aanbodinformatie = [];
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
            "velden": "id;advertentienummer;complexid;straat;huisnummer;huisletter;huisnummertoevoeging;aanduiding;wijk;plaats;gebruik;objecttype;totaleoppervlakte;totaaloppervlaktemin;totaaloppervlaktemax;aantalslaapkamers;aantalslaapkamersmin;aantalslaapkamersmax;balkon;tuin;labels;eengezinswoning;flatmetlift;flatzonderlift;bovenwoning;maisonettewoning;benedenwoning;kalehuur;koopprijs;kalehuurmin;totalekoopprijsmin;passendheid;verdeelmodel;media;publstart;publstop;preview;criteriaurgentie;tijdelijkeverhuur;showrotterdamwet;middenhuur",
            "inschrijfnummerTekst": inschrijfnummer,
            "setKenmerkenIngelogd": true,
            "addAantalReacties": true,
            "Volgorde": "",
            "inclusiefNieuwAanbod": true
        }
    })
        .then(async response => {
            woonaanbodViaIDs = response.data;
            await writeToFile('data', JSON.stringify(woonaanbodViaIDs));
            console.info("Fetched woonaanbodViaIDs successfully.");
            for (const woning of woonaanbodViaIDs.d) {
                const advNummer = woning.advertentienummer;
                const advId = woning.id;
                const positie = await GetTussenPositie(advNummer);
                const resultObject = {advNummer, positie};
                tussenposities.push(resultObject);
                const aanbodinformatieJson = await GetAanbodInformatie(advId);
                aanbodinformatie.push(aanbodinformatieJson);
            }
            await writeToFile('tussenposities', JSON.stringify(tussenposities));
            woonaanbodViaIDs.d.forEach((woning) => {
                aanbodinformatie.forEach((aanbod) => {
                    if (aanbod.Aanbod.advid === woning.advertentienummer) {
                        woning.meerInformatie = aanbod.Aanbod;
                    }
                });
                tussenposities.forEach((tussenpositie) => {
                    if (tussenpositie.advNummer === woning.advertentienummer) {
                        woning.meerInformatie.reageerpositie = tussenpositie.positie;
                    }
                });
                data.woningen.push(woning.meerInformatie);
            });
/*            if(oldData !== undefined) {
                const newData = data.woningen.filter((item1) => !oldData.woningen.some((item2) => item1.id === item2.id));
            }*/
            await writeToFile('data', JSON.stringify(data), '/', true).then(async () => {
                console.info("Written tussenposities to data.json.");
                console.info("Data from Woonnet Rijnmond is ready!")
            });
        })
        .catch(async error => {
            console.error("Cant fetch beschikbarewoningen. --- Error: " + error.toString())
        })
}

function GetTussenPositie(advId) {
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
                let tussenpositie = response.data.d;
                await writeToFile('tussenposities', JSON.stringify(tussenpositie));
                console.info("Fetched tussenpositie for: " + advId + "=" + tussenpositie);
                resolve(tussenpositie);
            })
            .catch(async error => {
                console.error("Cant fetch tussenpositie. --- Error: " + error.toString())
                reject(error)
            })
    });
}

function GetAanbodInformatie(advId) {
    return new Promise((resolve, reject) => {
        axios.default.request({
            'withCredentials': true,
            'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/WoningenModule/Service.asmx/getAanbodEnVolgendeViaId',
            'method': 'post',
            'headers': {
                'Content-Type': "application/json; charset=utf-8",
                'Cookie': cookieNamesAndValues.toString()
            },
            'data': {
                "Id": advId,
                "VolgendeId": "-1",
                "Filters": "gebruik!=Complex",
                "inschrijfnummerTekst": inschrijfnummer,
                "Volgorde": "",
                "hash": ""
            }
        })
            .then(async response => {
                let aanbodinformatie = response.data;
                console.info("Fetched aanbodinformatie for: " + advId);
                await writeToFile(advId, JSON.stringify(aanbodinformatie.d), '/huizen/');
                resolve(aanbodinformatie.d);
            })
            .catch(async error => {
                console.error("Cant check aanbodinformatie. Error: " + error.toString())
                reject(error)
            })
    });
}
async function readJsonFile(filePath) {
    try {
        const jsonData = await fs.readFile(filePath, { encoding: 'utf-8' });
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(error);
    }
}
async function getJsonData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
//Get data from GitHub repo and put in a variables
async function getPastData() {
    return new Promise((resolve) => {
        readJsonFile(__dirname + '/config.json')
            .then((data) => {
                config = data;
                getJsonData(config.GitHubPageURL + 'data/data.json')
                    .then((data) => {
                        oldData = data;
                        console.info("Fetched old data from GitHub.");
                        resolve();
                    })
                    .catch(() => {
                        console.error("Could not find old data.");
                        resolve();
                    });
            })
            .catch((error) => console.error(error));
    });
}

function createNewDataTest(){
    readJsonFile(__dirname +'/data/data.json').then(async (data) => {
        if (oldData !== undefined) {
            newData = data.woningen.filter((item1) => !oldData.woningen.some((item2) => item1.id === item2.id));
            if(!config.include55plus){
                newData = newData.filter((woning) => woning.is55plus === '0');
            }
            if(newData.length > 0){
                console.info("New data found compared to old data.");
                await writeToFile('newData', JSON.stringify(newData), '/', true).then(async () => {
                    for(let newWoning of newData){
                        console.info("Nieuwe woning: " + newWoning.id);
                    }
                });
            }
        }
    });
}

function start() {
    console.info("Starting script...");
    getPastData().then(r => {
        //createNewDataTest();
        fetchCookies().then(() => {
            getWoonwens();
            getWoonaanbod();
        });
    });
}

start();
