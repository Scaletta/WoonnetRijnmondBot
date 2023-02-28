module.exports = {
    basePath: process.env.BASE_PATH || process.env.NODE_ENV === 'production' ? '' : '',
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
}
