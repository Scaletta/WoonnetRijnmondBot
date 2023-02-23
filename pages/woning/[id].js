import {useRouter} from 'next/router'
import path from "path";
import fsPromises from "fs/promises";
import {Grid, Spacer, Text} from "@nextui-org/react";
import {Layout} from "../../components/Layout";
import {Box} from "../../components/Box";
import Head from "next/head";
import {DataContext} from "../index";

export async function getStaticPaths() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);

    // Get the paths we want to pre-render based on posts
    const paths = woningen.woningen.map((woning) => ({
        params: {id: woning.id},
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return {paths, fallback: false}
}

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);
    return {
        props: woningen
    }
}

const Woning = ({woningen}) => {
    const router = useRouter()
    const {id} = router.query
    const woning = woningen.find((woning) => woning.id === id)
    return (
        <DataContext.Provider value={woning}>
            <Layout text={'Available: ' + woning.publstart + ' - ' + woning.publstop}>
                <Box css={{px: "$12", mt: "$8", "@xsMax": {px: "$10"}}}>
                    <Head>
                        <title>Woonnet Rijnmond Bot - {woning.id}</title>
                        <link rel="icon" href="/favicon.ico"/>
                    </Head>
                    <Text
                        h1
                        size={60}
                        css={{
                            textGradient: "45deg, $blue600 -20%, $pink600 50%",
                            textAlign: "center"
                        }}
                        weight="bold"
                    >
                        Woonnet Rijnmond Bot
                    </Text>
                    <Spacer y={1}/>
                    <Grid.Container gap={2} justify="center">

                    </Grid.Container>
                </Box>
            </Layout>
        </DataContext.Provider>
    )
}

export default Woning
