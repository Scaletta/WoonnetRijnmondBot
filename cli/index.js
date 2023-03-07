#!/usr/bin/env node
"use strict";

const fs = require("fs/promises");
const yargs = require("yargs");
const chalk = require("chalk");
const dotenv = require("dotenv");
const boxen = require("boxen");
const ora = require('ora');
const fetchCookies = require("./src/fetchCookies");
const fetchWoonWens = require("./src/woonWens");
const fetchWoonAanbod = require("./src/woonAanbod");
const fetchWoonAanbodViaIDs = require("./src/woonAanbodViaIDs");
const fetchTussenposities = require("./src/getTussenposities");
const getPastData = require("./src/getPastData");
const combineData = require("./src/combineData");
const pushNotifications = require("./src/pushNotification");

dotenv.config();

const options = yargs
    .option("debug", {alias: "d", describe: "Run with test data", type: "boolean", default: false})
    .option("noPush", {alias: "np", describe: "Run with no push notifcations", type: "boolean", default: false})
    .argv;

const config = {
    woonnetUsername: process.env.WOONNET_USERNAME,
    woonnetPassword: process.env.WOONNET_PASSWORD,
    githubPageURL: process.env.GITHUB_PAGE_URL,
    preferenceInclude55Plus: process.env.PREFERENCE_INCLUDE_55_PLUS,
    pushoverAppKey: process.env.PUSHOVER_APP_KEY,
    pushoverUserKey: process.env.PUSHOVER_USER_KEY,
};

let data = {
    woonwens: {},
    woonaanbod: {},
    nieuwaanbod: {},
    woningen: {},
    tussenposities: {},
    woningenFiltered: {},
    nieuweWoningenFiltered: {},
    pastData: {},
    pushNotifications: {},
}

function checkForNewData(data, pastData) {
    let newData = [];
    data.forEach((item) => {
        if (pastData.includes(item)) {
        } else {
            newData.push(item);
        }
    });
    return newData;
}

const main = async () => {
    const spinner = ora({spinner: "aesthetic"});
    console.log(boxen(chalk.bold.bgMagentaBright("Woonnet Rijnmond Bot"), {
        padding: 2,
        margin: 1,
        borderStyle: 'double',
        align: 'center'
    }));
    const error = chalk.bold.red;
    const success = chalk.bold.green;
    const debug = chalk.italic.yellow;
    try {
        if (options.debug) {
            console.log(debug("Running with test data..."));
        }

        // Fetch Cookies
        spinner.text = chalk.italic("Fetching cookies from Woonnet Rijnmond...");
        spinner.start();
        const auth = fetchCookies(config);
        const cookies = await auth.executeAuthFlow();
        spinner.succeed(success("Cookies fetched successfully"));

        // Fetch Woonwens
        spinner.text = chalk.italic("Starting to fetch Woonwens...");
        spinner.start();
        const woonWens = fetchWoonWens(cookies);
        data.woonwens = await woonWens.executeWoonwens();
        spinner.succeed(success("Woonwens fetched successfully"));

        // Get Past Data
        spinner.text = chalk.italic("Starting to fetch past data...");
        spinner.start();
        const past = getPastData(options.debug, config.githubPageURL);
        data.pastData = await past.executePastData();
        spinner.succeed(success("Past data fetched successfully"));

        // Fetch Woonaanbod
        spinner.text = chalk.italic("Starting to fetch Woonaanbod...");
        spinner.start();
        const woonAanbod = fetchWoonAanbod(cookies);
        data.woonaanbod = await woonAanbod.executeWoonaanbod();
        spinner.succeed(success("Woonaanbod fetched successfully : " + data.woonaanbod.length));

        // Fetch Nieuw Woonaanbod
        spinner.text = chalk.italic("Starting to fetch Nieuw Woonaanbod...");
        spinner.start();
        const nieuwWoonAanbod = fetchWoonAanbod(cookies, "AlleenNieuwVandaag");
        data.nieuwaanbod = await nieuwWoonAanbod.executeWoonaanbod();
        spinner.succeed(success("Nieuw woonaanbod fetched successfully : " + data.nieuwaanbod.length));

        // Fetch Woonaanbod via ID's
        // Woningen
        spinner.text = chalk.italic("Starting to fetch Woonaanbod via ID's...");
        spinner.start();
        const woonAanbodViaIDs = fetchWoonAanbodViaIDs(cookies, data.woonaanbod);
        data.woningen = await woonAanbodViaIDs.executeWoonaanbodViaIDs();

        // Nieuwe woningen
        if (data.nieuwaanbod.length > 0) {
            const nieuwWoonAanbodViaIDs = fetchWoonAanbodViaIDs(cookies, data.nieuwaanbod);
            data.nieuwewoningen = await nieuwWoonAanbodViaIDs.executeWoonaanbodViaIDs();
            spinner.succeed(success("Woonaanbod via ID's fetched successfully"));
        }
        //

        // Fetch Tussenposities
        spinner.text = chalk.italic("Starting to fetch Tussenposities");
        spinner.start();
        const tussenposities = fetchTussenposities(cookies, data.woningen, data.woonaanbod[0].Inschrijfnummer);
        data.tussenposities = await tussenposities.executeTussenposities();
        spinner.succeed(success("Tussenposities fetched successfully"));
        //

        // Combine data
        // Woningen
        spinner.text = chalk.italic("Combining woningen data...");
        spinner.start();
        const combinedDataWoningen = combineData(data);
        data.woningenFiltered = await combinedDataWoningen.executecombineData();
        spinner.succeed(success("Combining woningen data successfully"));

        // Nieuwe woningen
        if (data.nieuwaanbod.length > 0) {
            spinner.text = chalk.italic("Combining nieuwe woningen data...");
            spinner.start();
            const combinedDataNieuweWoningen = combineData(data, false);
            data.nieuweWoningenFiltered = await combinedDataNieuweWoningen.executecombineData();
            spinner.succeed(success("Combining nieuwe woningen successfully"));
        }
        //

        // Filter data
        // Woningen
        spinner.text = chalk.italic("Filtering woningen data...");
        spinner.start();
        data.woningenFiltered = data.woningenFiltered.filter((woning) => woning.meerInformatie.Redengeenvoorrang === "");
        if (!config.preferenceInclude55Plus) {
            data.woningenFiltered = data.woningenFiltered.filter((woning) => woning.is55plus !== "1" && woning.minleeftijd !== "55" && woning.verdeelmodel !== "Wens&Wacht");
        }
        spinner.succeed(success("Filtering woningen data successfully. Amount of filtered woningen: " + data.woningenFiltered.length));

        //Nieuwe woningen
        if (data.nieuwaanbod.length > 0) {
            spinner.text = chalk.italic("Filtering nieuwe woningen data...");
            spinner.start();
            data.nieuweWoningenFiltered = data.nieuweWoningenFiltered.filter((woning) => woning.meerInformatie.Redengeenvoorrang === "");
            if (!config.preferenceInclude55Plus) {
                data.nieuweWoningenFiltered = data.nieuweWoningenFiltered.filter((woning) => woning.is55plus !== "1" && woning.minleeftijd !== "55" && woning.verdeelmodel !== "Wens&Wacht");
            }
            spinner.succeed(success("Filtering nieuwe woningen data successfully. Amount of filtered nieuwe woningen: " + data.nieuweWoningenFiltered.length));
        }
        //

        // Write data to file
        spinner.text = chalk.italic("Saving data...");
        spinner.start();
        await writeToFile("data", JSON.stringify({
            woningen: data.woningenFiltered,
            nieuweWoningen: data.nieuweWoningenFiltered
        }), "/", true);
        spinner.succeed(success("Data saved successfully!"));
        //

        // Check for new data
        spinner.text = chalk.italic("Checking for new data...");
        spinner.start();
        const newData = checkForNewData(data.woningenFiltered, data.pastData.woningen);
        spinner.succeed(success("Checked for new data successfully"));
        //

        // Send Pushover notification
        spinner.text = chalk.italic("Sending push notifcations...");
        spinner.start();
        const sendPushNotifcations = pushNotifications(newData, config.pushoverAppKey, config.pushoverUserKey, config.githubPageURL, options.noPush);
        data.pushNotifications = await sendPushNotifcations.executePushData();
        spinner.succeed(success("PushNotifications send successfully : " + data.pushNotifications.length));

    } catch (err) {
        spinner.fail();
        console.error(error(err));
    }
};

async function writeToFile(name, data, folder = '/', force = false) {
    if (options.debug || force) {
        await fs.writeFile(__dirname + '/data' + folder + name + '.json', data).then(() => {
            //console.info("Written " + name + " to " + folder + name + ".json.");
        }).catch((error) => {
            throw error;
        });
    }
}

main().then(() => {
    console.log(boxen(chalk.bold.green("Woonnet Rijnmond Bot Ready!"), {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        align: 'center'
    }));
});