import path from "path";
import fsPromises from "fs/promises";
import {Card, Spacer, Text} from "@nextui-org/react";
import {Layout} from "../components/Layout";
import {Box} from "../components/Box";
import Head from "next/head";
import {DataContext} from "./index";
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic";

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);
    return {
        props: woningen
    }
}
const OpenStreetMap = dynamic(() => import('../components/OpenStreetMap'), {
    ssr: false,
})

const Map = (woningen) => {
    return (
        <DataContext.Provider value={woningen}>
            <Layout text="">
                <Box css={{px: "$12", mt: "$8", "@xsMax": {px: "$10"}}}>
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
                    <OpenStreetMap data={woningen}/>
                    </Card>
                </Box>
            </Layout>
        </DataContext.Provider>
    )
}

export default Map
