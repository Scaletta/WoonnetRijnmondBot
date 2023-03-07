"use strict";
const chalk = require( "chalk" );

const error = chalk.bold.red;

module.exports = (data, includeTussenpositie = true) => {
    if ( !data ) {
        throw new Error( "Woonnet Rijnmond data is required." );
    }
    const combineData = async () => {
        try{
            let newData = [];
            if(includeTussenpositie) {
                await Promise.all(data.woningen.map(async (woning) => {
                        data.woonaanbod.forEach((aanbod) => {
                            if (aanbod.AdvertentieId === parseInt(woning.advertentienummer)) {
                                woning.meerInformatie = aanbod;
                            }
                        });
                        data.tussenposities.forEach((tussenpositie) => {
                            if (parseInt(tussenpositie.woning) === parseInt(woning.advertentienummer)) {
                                woning.meerInformatie.reageerpositie = tussenpositie.tussenpositie;
                            }
                        });
                    newData.push(woning);
                }));
            }
            else{
                await Promise.all(data.nieuwewoningen.map(async (woning) => {
                        data.nieuwaanbod.forEach((nieuwaanbod) => {
                            if (nieuwaanbod.AdvertentieId === parseInt(woning.advertentienummer)) {
                                woning.meerInformatie = nieuwaanbod;
                            }
                        });
                    newData.push(woning);
                }));
            }
            return newData;
        }
        catch ( err ) {
            throw new Error( error( "Error while combining data: " + err ) );
        }
    };
    const executecombineData = () => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const data = await combineData();
                resolve( data );
            } catch ( err ) {
                reject( err );
            }
        } );
    };
    return {
        executecombineData
    };
};