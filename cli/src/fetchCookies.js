"use strict";
const chalk = require( "chalk" );
const puppeteer = require("puppeteer");

const error = chalk.bold.red;

module.exports = ( { woonnetUsername, woonnetPassword } ) => {
    if ( !woonnetUsername || !woonnetPassword ) {
        throw new Error( "Woonnet Rijnmond Username and password are required." );
    }

    const getCookies = async () => {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            // Login
            await page.goto("https://www.woonnetrijnmond.nl/inloggeninschrijven/")
            await page.type('#username', woonnetUsername);
            await page.type('#password', woonnetPassword);
            await page.click('.inloggen-btn');
            await page.waitForNavigation();
            if (page.url() !== "https://www.woonnetrijnmond.nl/mijn-account/") {
                await browser.close()
            }
            // Get cookies
            const cookiesResponse = await page.cookies();
            const cookies = cookiesResponse.map(({name, value}) => ({name, value}));
            const cookieStrings = cookies.map(({name, value}) => `${name}=${value}`);
            const cookieNamesAndValues = cookieStrings.join('; ');
            //  Write cookies
            //  await writeToFile('cookies', JSON.stringify(cookies));
            await browser.close();
            return cookieNamesAndValues;
        } catch ( err ) {
            console.error(error("Error getting cookies: "), err);
            throw err;
        }
    };
    const executeAuthFlow = () => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const cookies = await getCookies();
                resolve( cookies );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executeAuthFlow
    };
};