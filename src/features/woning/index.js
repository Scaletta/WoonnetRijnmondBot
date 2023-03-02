import {Button, Card, Col, Grid, Input, Row, Text} from '@nextui-org/react';
import React, {useState} from 'react';
import {Flex} from '../../components/styles/flex';
import {TableWrapper} from '../../components/table/table';
import Head from "next/head";
import {WoningSlider} from "../../components/woning/WoningSlider";
import {StyledBadge} from "../../components/woning/woning.styled";
import Link from "next/link";

export const Woning = ({woning}) => {
    const Informatie = () => {
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Financieel</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col>
                                    <Text>Totale huur:</Text>
                                    <Text>Kale huur:</Text>
                                    <Text>Huur voor huurtoeslag:</Text>
                                    <Text>Servicekosten:</Text>
                                    <Text>Voorschot warmtelevering:</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Text u b>€ {woning.totalehuur}</Text>
                                    <Text u>€ {woning.kalehuur}</Text>
                                    <Text u>€ {woning.huurvoorhuurtoeslag}</Text>
                                    <Text u>€ {woning.servicekosten}</Text>
                                    <Text u>€ {woning.stookkosteninservicekosten}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    const Reageerkans = () => {
        let styleReageerPositie;
        if(parseInt(woning.reageerpositie) > 50){
            styleReageerPositie = "high"
        }
        else if(parseInt(woning.reageerpositie) > 30){
            styleReageerPositie = "medium"
        }
        else{
            styleReageerPositie = "low"
        }
        let styleReacties;
        if(parseInt(woning.aantalreacties) > 50){
            styleReacties = "high"
        }
        else if(parseInt(woning.aantalreacties) > 30){
            styleReacties = "medium"
        }
        else{
            styleReacties = "low"
        }
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Reageerkans</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col span={20}>
                            <Row>
                                <Col>
                                    <Text>Verdeelmodel:</Text>
                                    <Text>Reacties:</Text>
                                    <Text>Reageerpositie:</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Col>
                                    <Text><b>{woning.verdeelmodel}</b></Text>
                                    <Text><StyledBadge type={styleReageerPositie}>{parseInt(woning.reageerpositie)}</StyledBadge></Text>
                                    <Text><StyledBadge type={styleReacties}>{parseInt(woning.aantalreacties)}</StyledBadge></Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <Row justify="center">
                        <Link target={"_blank"} href={`https://www.woonnetrijnmond.nl/detail/${woning.id}`}>
                        <Button size="lg" shadow color="gradient">
                            Reageer op Woonnet Rijnmond
                        </Button>
                        </Link>
                    </Row>
                </Card.Footer>
            </Card>
        );
    };
    const MockItem = ({text}) => {
        return (
            <Card variant="bordered" css={{h: "$24"}}>
                <Card.Body>
                    <Text h6 size={15} css={{mt: 0}}>
                        {text}
                    </Text>
                </Card.Body>
            </Card>
        );
    };
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
                <title>Woonnet Rijnmond Bot - {woning.straat} {woning.huisnummer}</title>
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
                {woning.straat} {woning.huisnummer} - {woning.plaats}
            </Text>
            <Grid.Container gap={2} justify="center">
                <Grid xs={12} md={3.5}>
                    <WoningSlider woning={woning} width={'100%'}/>
                </Grid>
                <Grid xs={12} md={5.5}>
                    <Informatie text={"1"}></Informatie>
                </Grid>
                <Grid xs={12} md={3}>
                    <Reageerkans/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="2 of 3"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="3 of 3"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="1 of 4"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="2 of 4"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="3 of 4"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="4 of 4"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="1 of 3"/>
                </Grid>
                <Grid xs={6}>
                    <MockItem text="2 of 3"/>
                </Grid>
                <Grid xs={3}>
                    <MockItem text="3 of 3"/>
                </Grid>
            </Grid.Container>
        </Flex>
    )
}

export default Woning
