const withPWA = require('next-pwa')({
    dest: 'public',
});
module.exports =
    withPWA({
        basePath: process.env.BASEPATH + '/',
        publicRuntimeConfig: {
            modifiedDate: new Date().toISOString(),
            maxHuur: 800,
            minHuur: 500,
            minReageerPositie: 30,
        },
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'www.woonnetrijnmond.nl',
                    port: '',
                    pathname: '**',
                }
            ]
        }
    });
