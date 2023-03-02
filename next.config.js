const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    modifyURLPrefix: {
        '_offline': process.env.BASEPATH ? '/' + process.env.BASEPATH.split('/').pop() + '_offline' : '_offline',
    },
    cacheOnFrontEndNav: true,
    scope: process.env.BASEPATH ? '/' + process.env.BASEPATH.split('/').pop() : '',
});
module.exports =
    withPWA({
        basePath: process.env.BASEPATH ? '/' + process.env.BASEPATH.split('/').pop() : '',
        trailingSlash: true,
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
