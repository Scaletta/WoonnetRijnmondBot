"use strict";
const chalk = require( "chalk" );
const axios = require("axios");

const error = chalk.bold.red;

module.exports = (cookies, filter = "AlleenActueel") => {
    if ( !cookies ) {
        throw new Error( "Woonnet Rijnmond cookies are required." );
    }
    const getWoonaanbod = async () => {
        try {
            const response = await axios.default.request({
                'withCredentials': true,
                'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/Woonwensen/wsWoonwensen.asmx/GetWoonwensResultatenVoorPaginaByInschrijfnummer',
                'method': 'post',
                'headers': {
                    'Content-Type': "application/json; charset=utf-8",
                    'Cookie': cookies.toString()
                },
                'data': {
                    paginaNummer: 1,
                    paginaGrootte: 50,
                    filterMode: filter
                }
            });

            return response.data;
        }
        catch ( err ) {
            throw new Error( error( "Error while fetching woonaanbod: " + err ) );
        }
    };
    const executeWoonaanbod = () => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const woonaanbod = await getWoonaanbod();
                resolve( woonaanbod.d.resultaten );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executeWoonaanbod
    };
};