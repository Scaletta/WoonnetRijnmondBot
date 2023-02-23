import React, {createContext, useEffect, useState} from 'react';
import 'keen-slider/keen-slider.min.css'
import {Grid, Spacer} from '@nextui-org/react';
import { Container, Text, Loading } from "@nextui-org/react";
import fsPromises from 'fs/promises';
import path from 'path'
import {Layout} from "../components/Layout.js";
import {Box} from "../components/Box";
import WoningCard from "../components/WoningCard";
import Head from "next/head";
import getConfig from "next/config";

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    const woningen = JSON.parse(jsonData);
    return {
        props: woningen
    }
}
export const DataContext = createContext(undefined);
const { publicRuntimeConfig } = getConfig()

export default function Home(props) {
    const data = props;
    const [refreshDate, setRefreshDate] = useState('');
    useEffect(() => {
        setRefreshDate('Bijgewerkt op: ' + new Date(data.refreshDate).toLocaleString());
    }, [data])
    function Woningen() {
        return (
            data.woningen
                .sort((a, b) => a.reageerpositie - b.reageerpositie)
                .map((item, index) => {
                    if (item.is55plus !== "1" || publicRuntimeConfig.include55plus === true)  {
                        return (
                            <Grid xs={12} sm={4} key={index}>
                                <WoningCard index={index} data={item}></WoningCard>
                            </Grid>
                        )
                    } else {
                        return null;
                    }
                })
        )
    }
    //Handle the error state
    if (data.error) return <Container><Loading size="xl">Loading</Loading></Container>;
    //Handle the loading state
    if (!data) return <Container alignContent={"center"} justify={"center"}><Loading size="xl">Loading</Loading></Container>;
    return (
        <DataContext.Provider value={data}>
            <Layout text={refreshDate} searchbar="true">
            <Box css={{px: "$12", mt: "$8", "@xsMax": {px: "$10"}}}>
                <Head>
                    <title>Woonnet Rijnmond Bot - Home</title>
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
                    Woonnet Rijnmond Bot
                </Text>
                <Spacer y={1} />
                <Grid.Container gap={2} justify="center">
                    <Woningen></Woningen>
                </Grid.Container>
            </Box>
            </Layout>
        </DataContext.Provider>
    );
}
