import {Button, Card, Col, Grid, Loading, Row, Text} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {Flex} from '../../components/styles/flex';
import Head from "next/head";
import {WoningSlider} from "../../components/woning/WoningSlider";
import {StyledBadge} from "../../components/woning/woning.styled";
import Link from "next/link";

export const Woning = ({woning}) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
    function calculateTimeRemaining() {
        const now = new Date();
        const startDate = new Date(woning.publstart);
        const endDate = new Date(woning.publstop);

        if (now < startDate) {
            return startDate - now;
        } else if (now > endDate) {
            return 0;
        } else {
            return endDate - now;
        }
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [woning]);
    const Financieel = () => {
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
                                    <Text b>€ {woning.totalehuur}</Text>
                                    <Text>€ {woning.kalehuur}</Text>
                                    <Text>€ {woning.huurvoorhuurtoeslag}</Text>
                                    <Text>€ {woning.servicekosten}</Text>
                                    <Text>€ {woning.stookkosteninservicekosten}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    const Reageerkans = () => {
        if(!woning.reageerpositie){
            return (
                <Card variant="bordered"><Loading></Loading></Card>
            )
        }
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
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        let textReageren = days.toString().padStart(1, '0') + "dag " + hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
        let styleReageren;
        if(days >= 3){
            styleReageren = "low";
        }
        else if(days > 0){
            styleReageren = "medium";
        }
        else {
            styleReageren = "high";
            textReageren = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
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
                                    <Text>Reageerpositie:</Text>
                                    <Text>Reacties:</Text>
                                    <Text>Beschikbaar:</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Col>
                                    <Text><b>{woning.verdeelmodel}</b></Text>
                                    <Text><StyledBadge type={styleReageerPositie}>{parseInt(woning.reageerpositie)}</StyledBadge></Text>
                                    <Text><StyledBadge type={styleReacties}>{parseInt(woning.aantalreacties)}</StyledBadge></Text>
                                    <Text><StyledBadge type={styleReageren}>{textReageren}</StyledBadge></Text>
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
    const Woningomschrijving = () => {
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Omschrijving</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col>
                            <Text dangerouslySetInnerHTML={{__html: woning.omschrijving}}></Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    const WoningInformatie = () => {
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Informatie</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col css={{textAlign: "center"}}>
                            <Text>{woning.objecttype}</Text>
                            <Text>{woning.verdieping}</Text>
                            <Text>{woning.portiekgalerij}</Text>
                            <Text>{woning.aantalslaapkamers} slaapkamers</Text>
                            <Text>{woning.verwarming}</Text>
                            <Text>Bouwjaar: {woning.bouwjaar}</Text>
                            <Text>Energielabel: {woning.energielabel}</Text>
                            <Text>Balkon: {woning.balkon}</Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    const Woningoppervlakte = () => {
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Oppervlakte</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col css={{textAlign: "center"}}>
                            <Text h5>Totaal: <b>{woning.totaleoppervlakte} m2</b></Text>
                            {woning.oppervlaktewoonkamer1 !== "0" &&
                                <Text>Woonkamer 1: <b>{woning.oppervlaktewoonkamer1} m2</b></Text>
                            }
                            {woning.oppervlaktewoonkamer2 !== "0" &&
                                <Text>Woonkamer 2: <b>{woning.oppervlaktewoonkamer2} m2</b></Text>
                            }
                            {woning.oppervlaktewoonslaapkamer !== "0" &&
                                <Text>Woonkamer/slaapkamer: <b>{woning.oppervlaktewoonslaapkamer} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer1 !== "0" &&
                                <Text>Slaapkamer 1: <b>{woning.oppervlakteslaapkamer1} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer2 !== "0" &&
                                <Text>Slaapkamer 2: <b>{woning.oppervlakteslaapkamer2} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer3 !== "0" &&
                                <Text>Slaapkamer 3: <b>{woning.oppervlakteslaapkamer3} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer4 !== "0" &&
                                <Text>Slaapkamer 4: <b>{woning.oppervlakteslaapkamer4} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer5 !== "0" &&
                                <Text>Slaapkamer 5: <b>{woning.oppervlakteslaapkamer5} m2</b></Text>
                            }
                            {woning.oppervlakteslaapkamer6 !== "0" &&
                                <Text>Slaapkamer 6: <b>{woning.oppervlakteslaapkamer6} m2</b></Text>
                            }
                            {woning.oppervlaktekeuken !== "0" &&
                                <Text>Keuken: <b>{woning.oppervlaktekeuken} m2</b></Text>
                            }
                            {woning.oppervlaktebadkamer !== "0" &&
                                <Text>Badkamer: <b>{woning.oppervlaktebadkamer} m2</b></Text>
                            }
                            {woning.oppervlaktehobbykamer !== "0" &&
                                <Text>Hobbykamer: <b>{woning.oppervlaktehobbykamer} m2</b></Text>
                            }
                            {woning.oppervlaktezolder !== "0" &&
                                <Text>Zolder: <b>{woning.oppervlaktezolder} m2</b></Text>
                            }
                            {woning.oppervlaktehal !== "0" &&
                                <Text>Hal: <b>{woning.oppervlaktehal} m2</b></Text>
                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    const Woningvoorwaarden = () => {
        if(!woning.adv_info_voorwaarden){
            return (
                <Card><Loading></Loading></Card>
            )
        }
        const voorwaarden = JSON.parse(woning.adv_info_voorwaarden);
        return (
            <Card variant="bordered">
                <Card.Header>
                    <Text h2 css={{
                        textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    }}>Voorwaarden</Text>
                </Card.Header>
                <Card.Divider/>
                <Card.Body>
                    <Row>
                        <Col>
                            <ul>
                            {voorwaarden.map((voorwaarden, index) => (
                                <li key={index}>
                                <Text dangerouslySetInnerHTML={{__html: voorwaarden}}>
                                </Text>
                                </li>
                            ))}
                            </ul>
                        </Col>
                    </Row>
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
                    <Financieel></Financieel>
                </Grid>
                <Grid xs={12} md={3}>
                    <Reageerkans/>
                </Grid>
                <Grid xs={12} md={3}>
                    <Woningomschrijving/>
                </Grid>
                <Grid xs={12} md={3}>
                    <WoningInformatie/>
                </Grid>
                <Grid xs={12} md={3}>
                    <Woningoppervlakte/>
                </Grid>
                <Grid xs={12} md={3}>
                    <Woningvoorwaarden/>
                </Grid>
            </Grid.Container>
        </Flex>
    )
}

export default Woning
