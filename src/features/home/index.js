import React, {useEffect, useState} from 'react';
import 'keen-slider/keen-slider.min.css'
import {Grid, Spacer} from '@nextui-org/react';
import { Container, Text, Loading } from "@nextui-org/react";
import WoningCard from "./components/WoningCard";
import Head from "next/head";
import getConfig from "next/config";
import {Box} from "../../components/styles/box";

const { publicRuntimeConfig } = getConfig()

export default function Home({woningen}) {
    const [refreshDate, setRefreshDate] = useState('');
    useEffect(() => {
        setRefreshDate('Bijgewerkt op: ' + new Date(woningen.refreshDate).toLocaleString());
    }, [woningen])
    function Woningen() {
        return (
            woningen.woningen
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
    if (!woningen) return <Container><Loading size="xl">Loading</Loading></Container>;
    //Handle the loading state
    if (!woningen) return <Container alignContent={"center"} justify={"center"}><Loading size="xl">Loading</Loading></Container>;
    return (
        <Box css={{overflow: 'hidden', height: '100%'}}>
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
            <Woningen></Woningen>
        </Box>
    );
}
