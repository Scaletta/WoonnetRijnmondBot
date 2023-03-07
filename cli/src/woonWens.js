"use strict";
const chalk = require( "chalk" );
const axios = require("axios");

const error = chalk.bold.red;

module.exports = (cookies) => {
    if ( !cookies ) {
        throw new Error( "Woonnet Rijnmond cookies are required." );
    }
    const getWoonwens = async () => {
        try {
            const response = await axios.default.request({
                'withCredentials': true,
                'url': 'https://www.woonnetrijnmond.nl/wsWoonnetRijnmond/Woonwensen/wsWoonwensen.asmx/GetWoonwens',
                'method': 'post',
                'headers': {
                    'Content-Type': "application/json; charset=utf-8",
                    'Cookie': cookies.toString()
                }
            });

            return response.data;
        }
        catch ( err ) {
            throw new Error( error( "Error while fetching woonwens: " + err ) );
        }
    };
    const executeWoonwens = () => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const woonwens = await getWoonwens();
                resolve( woonwens.d );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executeWoonwens
    };
};