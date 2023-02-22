import Head from 'next/head';
import styles from '../styles/Home.module.css';
import useSWR from 'swr';
import getConfig from 'next/config'
import React from 'react';
import Image from "next/image"
import 'keen-slider/keen-slider.min.css'
import {useKeenSlider} from 'keen-slider/react'
import {Col, createTheme} from '@nextui-org/react';
import { Grid, Container, Card, Row, Text, Button, Loading } from "@nextui-org/react";


const darkTheme = createTheme({
    type: 'dark',
});

const { publicRuntimeConfig } = getConfig()
const fetcher = (url) => fetch(url).then((res) => res.json());
const animation = { duration: 20000, easing: (t) => t }
export default function Home() {
    const [sliderRef] = useKeenSlider({
        loop: true,
        centered: true,
        renderMode: "performance",
        slides: {
            perView: 3,
            spacing: 15,
        },
        created(s) {
            s.moveToIdx(5, true, animation)
        },
        updated(s) {
            s.moveToIdx(s.track.details.abs + 5, true, animation)
        },
        animationEnded(s) {
            s.moveToIdx(s.track.details.abs + 5, true, animation)
        },
    })
    const {data, error} = useSWR('/api/staticdata', fetcher);
    function Woningen() {
        return (
            data.d.sort((a, b) => a.reageerpositie - b.reageerpositie).map((item, index) => (
                <Grid key={index++} xs={12} md={10} sm={8} lg={6} xl={4}>
                    <Woning key={index++} index={index++} data={item}></Woning>
                </Grid>
            ))
        )
    }

    const Woning = ({index, data}) => {
        let header = data.plaats + ' - ' + data.wijk;
        let subheader = data.straat + ' ' + data.huisnummer + data.huisletter + data.huisnummertoevoeging;
        return (
            <Card key={index++}
                  isHoverable
                  variant="bordered">
                <Card.Body>
                    <div className={styles.cardTitle}>{header}</div>
                    <div className={styles.cardDescription}>{subheader}</div>
                    <div className={`${styles.cardDescription} ${parseInt(data.kalehuur) > parseInt(publicRuntimeConfig.maxHuur) ? styles.red : ''}`}><b>€ {data.kalehuur}</b></div>
                <div ref={sliderRef} className="keen-slider">
                    {data.media.map((image, index2) => (
                        image.mainfoto &&
                        <div className="keen-slider__slide" key={index2++}>
                            <Image
                                alt={image.omschrijving}
                                key={index2++}
                                src={`https:${image.mainfoto}`}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    ))}
                </div>
                </Card.Body>
                <Card.Footer
                    isBlurred
                    css={{
                        position: "absolute",
                        bgBlur: "#0f111466",
                        borderTop: "$borderWeights$light solid $gray800",
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <Row>
                        <Col>
                            <Row>
                                <Col span={3}>
                                    <div>Reageerpositie: <b>{data.reageerpositie}</b></div>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Button
                                    flat
                                    auto
                                    rounded
                                    css={{ color: "#94f9f0", bg: "#94f9f026" }}
                                >
                                    <Text
                                        css={{ color: "inherit" }}
                                        size={12}
                                        weight="bold"
                                        transform="uppercase"
                                    >
                                        Reageer op deze kutwoning
                                    </Text>
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        );
    };
    //Handle the error state
    if (error) return <Container><Loading size="xl">Loading</Loading></Container>;
    //Handle the loading state
    if (!data) return <Container alignContent={"center"} justify={"center"}><Loading size="xl">Loading</Loading></Container>;
    return (
        <Container>
            <Head>
                <title>Woonnet Rijnmond Bot</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <h1 className={styles.title}>
                Woonnet Rijnmond Bot
            </h1>
        <Grid.Container gap={2} justify="center">
            <Woningen></Woningen>
        </Grid.Container>
        </Container>
    );
}
