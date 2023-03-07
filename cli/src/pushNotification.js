"use strict";
const axios = require("axios");
const Pushover = require("pushover-notifications");

module.exports = (data, pushoverAppKey, pushoverUserKey, githubPageURL, noPush) => {
    if (!data) {
        throw new Error("Woonnet Rijnmond data, pushoverAppKey, pushoverUserKey & githubPageURL are required.");
    }
    const pushData = async () => {
        let result = [];
        if (data.length > !0) {
            return result;
        }
        for (const woning of data) {
            let shouldAddFile = false;
            let imageResponse;
            try {
                imageResponse = await axios("http:" + woning.media[0].mainfoto, {responseType: 'arraybuffer'});
                shouldAddFile = true;
            } catch (error) {
                //Cant fetch image of woning.
            }
            const push = new Pushover({
                token: pushoverAppKey,
                user: pushoverUserKey
            });
            const message = {
                message: `Er is een nieuwe woning toegevoegd: <b>${woning.straat} ${woning.huisnummer} in ${woning.plaats}</b>. Als je nu zou reageren dan zou je op plek <b>${parseInt(woning.reageerpositie)}</b> van de <b>${parseInt(woning.aantalreacties)}</b> staan.`,
                title: `Nieuwe woning: ${woning.straat} ${woning.huisnummer} in ${woning.plaats}`,
                sound: "magic",
                url: `${githubPageURL}woning/${woning.id}`,
                url_title: "Bekijk de woning op Woonnet Rijnmond Bot",
                html: 1
            };
            if (shouldAddFile) {
                message.file = {
                    name: `woning_${woning.id}.png`,
                    data: imageResponse.data
                };
            }
            if (!noPush) {
                push.send(message, function (err, result) {
                    if (err) {
                        throw new Error(error('Error sending push notification to Pushover. Error: ' + err));
                    }
                    result.push(result);
                })
            }
        }
        return result;
    };
    const executePushData = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const pushResponse = await pushData();
                resolve(pushResponse);
            } catch (err) {
                reject(err);
            }
        });
    };
    return {
        executePushData
    };
};
