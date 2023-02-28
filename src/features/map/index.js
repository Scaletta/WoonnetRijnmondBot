import {Card, Spacer, Text} from "@nextui-org/react";
import Head from "next/head";
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic";
import React from "react";
import {Flex} from "../../components/styles/flex";

const OpenStreetMap = dynamic(() => import('./components/OpenStreetMap'), {
    ssr: false,
})

export default function Map({woningen}) {
    return (
        <Flex
            css={{
                'mt': '$5',
                'px': '$6',
                '@sm': {
                    mt: '$10',
                    px: '$16',
                },
            }}
            justify={'center'}
            direction={'column'}
        >
                    <Head>
                        <title>Woonnet Rijnmond Bot - Map</title>
                        <link rel="icon" href="/favicon.ico"/>
                    </Head>
            <Text
                h1
                css={{
                    textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    'mb': '$8',
                }}
                weight="bold"
            >
                Woningmap
            </Text>
                    <Spacer y={1}/>
                    <Card>
                    <OpenStreetMap woningen={woningen}/>
                    </Card>
        </Flex>
    )
}
