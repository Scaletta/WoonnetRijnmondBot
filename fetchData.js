const fs = require("fs/promises")
const puppeteer = require("puppeteer")
const axios = require("axios")
const Pushover = require("pushover-notifications");

//Data
axios.defaults.withCredentials = true;
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

//ENV VARS
const debug = process.env.npm_config_debug || process.env.DEBUG;
const nopush = process.env.npm_config_nopush || process.env.NOPUSH;
const username = process.env.npm_config_username || process.env.USERNAME;
const password = process.env.npm_config_password || process.env.PASSWORD;
const GitHubPageURL = process.env.npm_config_githubpageurl || process.env.GITHUBPAGEURL;
let include55plus = process.env.npm_config_include55plus || process.env.INCLUDE55PLUS;
const pushover_app_key = process.env.npm_config_pushoverappkey || process.env.PUSHOVERAPPKEY;
const pushover_user_key = process.env.npm_config_pushoveruserkey || process.env.PUSHOVERUSERKEY;
if (typeof username === 'undefined' || typeof password === 'undefined') {
    console.error("Username or Password is not set!")
    return;
}
if (typeof pushover_app_key === 'undefined' || typeof pushover_user_key === 'undefined') {
    console.error("Pushover credentials are not set!\nPushnotifications are off.")
}
if (typeof GitHubPageURL === 'undefined') {
    console.error("GitHubPageURL is not set!")
    return;
}
if (typeof include55plus === 'undefined') {
    console.error("include55plus is not set, falling back to False")
    include55plus = false;
}
else{
    include55plus = JSON.parse(include55plus);
}

// SCRIPT
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
            console.info("Fetching tussenposities for each house now...");
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
            data.woningen = data.woningen.filter((woning) => woning.redengeenvoorrang === "");
            if(!include55plus) {
                data.woningen = data.woningen.filter((woning) => woning.is55plus !== "1" && woning.minleeftijd !== "55" && woning.verdeelmodel !== "Wens&Wacht");
            }
            await pushNewData().then(async () => {
                await writeToFile('data', JSON.stringify(data), '/', true).then(async () => {
                    console.info("Written tussenposities to data.json.");
                    console.info("Data from Woonnet Rijnmond is ready!")
                });
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
                //console.info("Fetched tussenpositie for: " + advId + "=" + tussenpositie);
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
                //console.info("Fetched aanbodinformatie for: " + advId);
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
        const jsonData = await fs.readFile(filePath, {encoding: 'utf-8'});
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
        if (debug) {
            readJsonFile(__dirname + '/data/oldData.json')
                .then((data) => {
                    oldData = data;
                    console.info("Fetched old data from GitHub.");
                    resolve();
                })
                .catch(() => {
                    console.error("Could not find old data.");
                    resolve();
                });
        } else {
            getJsonData(GitHubPageURL + 'data/data.json')
                .then((data) => {
                    oldData = data;
                    console.info("Fetched old data from GitHub.");
                    resolve();
                })
                .catch(() => {
                    console.error("Could not find old data.");
                    resolve();
                });
        }
    })
}

async function pushNewData() {
    if (oldData !== undefined) {
        newData = data.woningen.filter((item1) => !oldData.woningen.some((item2) => item1.id === item2.id));
        if (!include55plus) {
            newData = newData.filter((woning) => woning.is55plus !== "1" && woning.minleeftijd !== "55" && woning.verdeelmodel !== "Wens&Wacht");
        }
        if (newData.length > 0) {
            console.info("New data found compared to old data.");
            await writeToFile('newData', JSON.stringify(newData), '/', true).then(async () => {
                for (const newWoning of newData) {
                    const i = newData.indexOf(newWoning);
                    let shouldAddFile = false;
                    let imageResponse;
                    try {
                        imageResponse = await axios("http:" + newWoning.media[0].mainfoto, {responseType: 'arraybuffer'});
                        shouldAddFile = true;
                    } catch (error) {
                        //Cant fetch image of woning.
                    }
                    if(typeof pushover_app_key !== 'undefined' || typeof pushover_user_key !== 'undefined') {
                        const push = new Pushover({
                            token: pushover_app_key,
                            user: pushover_user_key
                        });
                        const message = {
                            message: `Er is een nieuwe woning toegevoegd: <b>${newWoning.straat} ${newWoning.huisnummer} in ${newWoning.plaats}</b>. Als je nu zou reageren dan zou je op plek <b>${parseInt(newWoning.reageerpositie)}</b> van de <b>${parseInt(newWoning.aantalreacties)}</b> staan.`,
                            title: `Nieuwe woning: ${newWoning.straat} ${newWoning.huisnummer} in ${newWoning.plaats}`,
                            sound: "magic",
                            url: `${GitHubPageURL}woning/${newWoning.id}`,
                            url_title: "Bekijk de woning op Woonnet Rijnmond Bot",
                            html: 1
                        };
                        if (shouldAddFile) {
                            message.file = {
                                name: `woning_${newWoning.id}.png`,
                                data: imageResponse.data
                            };
                        }
                        if(!nopush) {
                            push.send(message, function (error, result) {
                                if (error) {
                                    //throw err
                                    console.error('Error sending push notification to Pushover. Error: ' + error)
                                }

                                console.info('Sent push notifcation: ' + result.request)
                            })
                        }
                    }
                    console.info("New woning %i: %s", i + 1, newWoning.id);
                }
            });
            console.info('%s woningen added to newData.json', newData.length);
            data = {
                woningen: data.woningen.map((item) => {
                    const isNew = newData.find((x) => x.id === item.id);
                    if (isNew) {
                        return {...item, isNew: true};
                    } else {
                        return {...item, isNew: false};
                    }
                })
            };
            await writeToFile('newDataTest', JSON.stringify(data), '/', false);
        } else {
            console.info("No new data found.")
        }
    } else {
        console.info("No new data found.")
    }
}

function start() {
    console.info("Starting script...");
    getPastData().then(() => {
        fetchCookies().then(() => {
            getWoonwens();
            getWoonaanbod();
        });
    });
}

start();
