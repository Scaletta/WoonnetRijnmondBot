"use strict";
const chalk = require( "chalk" );
const axios = require("axios");

const error = chalk.bold.red;

module.exports = (cookies, data) => {
    if ( !cookies || !data )
        throw new Error( "Woonnet Rijnmond cookies, inschrijfnummer & data are required." );
    const getWoonaanbodViaIDs = async () => {
        let inschrijfnummer;
        let frontendAdvertentieIds;
        try{
            inschrijfnummer = data[0].Inschrijfnummer;
            frontendAdvertentieIds = data.map(obj => obj.FrontendAdvertentieId);
        }
        catch ( err ) {
            throw new Error( error( "Error while reading data in woonaanbodviaids: " + err ) );
        }
        try {
            const response = await axios.default.request({
                'withCredentials': true,
                'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/WoningenModule/Service.asmx/getAanbodViaIds',
                'method': 'post',
                'headers': {
                    'Content-Type': "application/json; charset=utf-8",
                    'Cookie': cookies.toString()
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
            });

            return response.data;
        }
        catch ( err ) {
            throw new Error( error( "Error while fetching woonaanbod via id's: " + err ) );
        }
    };
    const executeWoonaanbodViaIDs = () => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const woonaanbodviaids = await getWoonaanbodViaIDs();
                resolve( woonaanbodviaids.d );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executeWoonaanbodViaIDs
    };
};