import {Card, Spacer, Text} from "@nextui-org/react";
import Head from "next/head";
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic";
import {Box} from "../../components/styles/box";

const OpenStreetMap = dynamic(() => import('./components/OpenStreetMap'), {
    ssr: false,
})

export default function Home({woningen}) {
    return (
        <Box css={{overflow: 'hidden', height: '100%'}}>
                    <Head>
                        <title>Woonnet Rijnmond Bot - Map</title>
                        <link rel="icon" href="/favicon.ico"/>
                    </Head>
                    <Text
                        h1
                        size={60}
                        css={{
                            textGradient: "45deg, $pink600 -20%, $blue600 50%",
                            textAlign: "center"
                        }}
                        weight="bold"
                    >
                        Woningmap
                    </Text>
                    <Spacer y={1}/>
                    <Card>
                    <OpenStreetMap woningen={woningen}/>
                    </Card>
                </Box>
    )
}
