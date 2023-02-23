module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        maxHuur: 800,
        minHuur: 500,
        minReageerPositie: 30,
        include55plus: false
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.woonnetrijnmond.nl',
                port: '',
                pathname: '**',
            },
        ],
    },
}
