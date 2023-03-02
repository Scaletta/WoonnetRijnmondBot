import React, {useEffect, useState} from 'react';
import 'keen-slider/keen-slider.min.css'
import {Container, Grid, Loading, Text} from '@nextui-org/react';
import WoningCard from "./components/WoningCard";
import getConfig from "next/config";
import {Box} from "../../components/styles/box";
import {Flex} from "../../components/styles/flex";
import {LatestWoning} from "./components/LatestWoning";
import dynamic from "next/dynamic";
import {Counter} from "./components/Counter";
import Head from "next/head";


const {publicRuntimeConfig} = getConfig()
const Chart = dynamic(
    () => import('../../components/charts/WoningPrijzen').then((mod) => mod.WoningPrijzen),
    {
        ssr: false,
    }
);
export default function Home(props) {
    const [latestWoningen, setLatestWoningen] = useState([]);
    const [woningPrijzen, setWoningPrijzen] = useState([]);
    const [gemiddeldeReageerpositie, setGemiddeldeReageerpositie] = useState(0);
    const [gemiddeldeHuur, setGemiddeldeHuur] = useState(0);
    useEffect(() => {
        setLatestWoningen(getLatestWoningen());
        setWoningPrijzen(getWoningPrijzen());
        setGemiddeldeReageerpositie(getGemiddeldeReageerpositie());
        setGemiddeldeHuur(getGemiddeldeHuur());
    }, [props])

    function Woningen() {
        return (
            props.woningen
                .sort((a, b) => a.reageerpositie - b.reageerpositie)
                .map((item, index) => {
                    if (item.is55plus !== "1" || publicRuntimeConfig.include55plus === true) {
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
    function getLatestWoningen() {
        return props.woningen.woningen
            .map((woning) => ({
                ...woning,
                publstart: new Date(woning.publstart),
            }))
            .sort((a, b) => b.publstart - a.publstart)
            .slice(0, 3);
    }

    function getWoningPrijzen() {
        return props.woningen.woningen
            .map((woning) => ({
                ...woning,
                publstart: new Date(woning.publstart),
            }))
            .sort((a, b) => b.publstart - a.publstart)
    }
    function getGemiddeldeReageerpositie(){
        const reageerpositieArray = props.woningen.woningen
            .filter((woning) => woning.verdeelmodel !== "WoningLoting" && woning.verdeelmodel !== "Wens&Wacht")
            .map((woning) => Number(woning.reageerpositie));
        const totalReageerpositie = reageerpositieArray.reduce((total, currentValue) => total + currentValue, 0);
        return parseInt(totalReageerpositie / reageerpositieArray.length);
    }

    function getGemiddeldeHuur(){
        const reageerpositieArray = props.woningen.woningen
            .map((woning) => {
            const datapoint = !isNaN(parseInt(woning.kalehuur)) ? parseInt(woning.kalehuur) : parseInt(woning.totalehuurmin);
            return Number(datapoint);
        });
        const totalReageerpositie = reageerpositieArray.reduce((total, currentValue) => total + currentValue, 0);
        return parseInt(totalReageerpositie / reageerpositieArray.length);
    }

    //Handle the error state
    if (!props) return <Container><Loading size="xl">Loading</Loading></Container>;
    //Handle the loading state
    if (!props) return <Container alignContent={"center"} justify={"center"}><Loading
        size="xl">Loading</Loading></Container>;
    return (
        <Box css={{overflow: 'hidden', height: '100%'}}>
            <Head>
                <title>Woonnet Rijnmond Bot - Home</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
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
                <Text
                    h1
                    css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                        'mb': '$8',
                    }}
                    weight="bold"
                >
                    Woonnet Rijnmond Bot
                </Text>
            </Flex>
            <Flex
                css={{
                    'gap': '$8',
                    'pt': '$5',
                    'height': 'fit-content',
                    'flexWrap': 'wrap',
                    '@lg': {
                        flexWrap: 'nowrap',
                    },
                    '@sm': {
                        pt: '$10',
                    },
                }}
                justify={'center'}
            >
                <Flex
                    css={{
                        'px': '$12',
                        'mt': '$8',
                        '@xsMax': {px: '$10'},
                        'gap': '$12',
                    }}
                    direction={'column'}
                >
                    {/* Card Section Top */}
                    <Box>
                        <Text
                            h3
                            css={{
                                'textAlign': 'center',
                                '@sm': {
                                    textAlign: 'inherit',
                                },
                            }}
                        >
                            Laatst toegevoegde woningen
                        </Text>
                        <Flex
                            css={{
                                'gap': '$10',
                                'flexWrap': 'wrap',
                                'justifyContent': 'center',
                                '@sm': {
                                    flexWrap: 'nowrap',
                                },
                            }}
                            direction={'row'}
                        >
                            <LatestWoning woning={latestWoningen[0]} />
                            <LatestWoning woning={latestWoningen[1]}/>
                            <LatestWoning woning={latestWoningen[2]}/>
                        </Flex>
                    </Box>

                    {/* Chart */}
                    <Box>
                        <Text
                            h3
                            css={{
                                'textAlign': 'center',
                                '@lg': {
                                    textAlign: 'inherit',
                                },
                            }}
                        >
                            Huurprijzen met reageerpositie
                        </Text>
                        <Box
                            css={{
                                width: '100%',
                                backgroundColor: '$accents0',
                                boxShadow: '$lg',
                                borderRadius: '$2xl',
                                px: '$10',
                                py: '$10',
                            }}
                        >
                            <Chart woningen={woningPrijzen} />
                        </Box>
                    </Box>
                </Flex>

                {/* Left Section */}
                <Box
                    css={{
                        'px': '$12',
                        'mt': '$8',
                        '@xsMax': {px: '$10'},
                        'gap': '$6',
                        'overflow': 'hidden',
                    }}
                >
                    <Text
                        h3
                        css={{
                            'textAlign': 'center',
                            '@lg': {
                                textAlign: 'inherit',
                            },
                        }}
                    >
                        Gemiddelde reageerpositie
                    </Text>
                    <Flex
                        direction={'column'}
                        justify={'center'}
                        css={{
                            'gap': '$8',
                            'mt': '$8',
                            'flexDirection': 'row',
                            'flexWrap': 'wrap',
                            '@sm': {
                                flexWrap: 'nowrap',
                            },
                            '@lg': {
                                flexWrap: 'nowrap',
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <Counter value={gemiddeldeReageerpositie} type={'reageerpositie'} />
                    </Flex>
                    <Flex
                        direction={'column'}
                        justify={'center'}
                        css={{
                            'gap': '$8',
                            'mt': '$8',
                            'flexDirection': 'row',
                            'flexWrap': 'wrap',
                            '@sm': {
                                flexWrap: 'nowrap',
                            },
                            '@lg': {
                                flexWrap: 'nowrap',
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <Text
                            h3
                            css={{
                                'textAlign': 'center',
                                '@lg': {
                                    textAlign: 'inherit',
                                },
                            }}
                        >
                            Gemiddelde huurprijs
                        </Text>
                        <Counter value={gemiddeldeHuur} type={'huur'} />
                    </Flex>
                </Box>
            </Flex>

            {/* Table Latest Users */}
            <Flex
                direction={'column'}
                justify={'center'}
                css={{
                    'width': '100%',
                    'py': '$10',
                    'px': '$10',
                    'mt': '$8',
                    '@sm': {px: '$20'},
                }}
            >
                <Flex justify={'between'} wrap={'wrap'}>
                    <Text
                        h3
                        css={{
                            'textAlign': 'center',
                            '@lg': {
                                textAlign: 'inherit',
                            },
                        }}
                    >
                        {/*Latest Users*/}
                    </Text>

                </Flex>
            </Flex>
        </Box>
    );
}
