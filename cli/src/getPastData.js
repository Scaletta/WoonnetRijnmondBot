"use strict";
const chalk = require( "chalk" );
const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");

const error = chalk.bold.red;

module.exports = (debug, gitHubPageUrl) => {

    const getJsonData = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            throw new Error( error( "Cant get past data: " + err ) );
        }
    }
    const readJsonFile = async (filePath) => {
        try {
            const jsonData = await fs.readFile(filePath, {encoding: 'utf-8'});
            return JSON.parse(jsonData);
        } catch (err) {
            throw new Error( error( "Cant read past data JSON: " + err ) );
        }
    }
    const executePastData = () => {
        return new Promise((resolve) => {
            if (debug) {
                let reqPath = path.join(__dirname, '..', 'data', 'oldData.json')
                readJsonFile(reqPath)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        throw new Error( error( "Could not find old data. :" + err) );
                    });
            } else {
                getJsonData(gitHubPageUrl + 'data/data.json')
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        throw new Error( error( "Could not find old data. :" + err ) );
                    });
            }
        })
    };
    return {
        executePastData
    };
};