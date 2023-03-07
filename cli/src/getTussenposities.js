"use strict";
const chalk = require( "chalk" );
const axios = require("axios");

const error = chalk.bold.red;

module.exports = (cookies, data, inschrijfnummer) => {
    if ( !cookies || !data ) {
        throw new Error( "Woonnet Rijnmond cookies & data are required." );
    }
    const getTussenposities = async (advId, inschrijfnummer) => {
        try {
            const response = await axios.default.request({
                'withCredentials': true,
                'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/WoningenModule/Service.asmx/GetTussenPositie',
                'method': 'post',
                'headers': {
                    'Content-Type': "application/json; charset=utf-8",
                    'Cookie': cookies.toString()
                },
                'data': {
                    "advId": advId,
                    "inschrijfnummerTekst": inschrijfnummer,
                    "heeftGereageerd": false
                }
            });

            return response.data;
        }
        catch ( err ) {
            throw new Error( error( "Error while fetching tussenpositie: " + err ) );
        }
    };
    const executeTussenposities = async () => {
        let tussenpositieData = [];
        return new Promise( async ( resolve, reject ) => {
            try {
                for await (const woning of data) {
                    const advNummer = woning.advertentienummer;
                    const tussenposities = await getTussenposities(advNummer, inschrijfnummer);
                    tussenpositieData.push({woning: advNummer, tussenpositie: tussenposities.d});
                }
                resolve( tussenpositieData );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executeTussenposities
    };
};