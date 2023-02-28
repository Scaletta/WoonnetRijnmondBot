import {Button, Card, Col, Row, Text} from "@nextui-org/react";
import getConfig from "next/config";
import {useKeenSlider} from "keen-slider/react";
import React from "react";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig()
export default function WoningCard({index, data}) {
    const mainFotoCount = data.media.filter(image => image.mainfoto !== null && image.mainfoto !== undefined).length;
    const animation = { duration: 20000, easing: (t) => t }
    const [sliderRef] = useKeenSlider({
        loop: mainFotoCount > 1,
        renderMode: "performance",
        slides: {
            perView: 1,
            spacing: 5,
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
    });
    const header = data.plaats + ' - ' + data.wijk;
    const subheader = data.straat + ' ' + data.huisnummer + data.huisletter + data.huisnummertoevoeging;
    const positieColor = (() => {
        const reageerpositie = parseInt(data.reageerpositie);
        if (reageerpositie > 100) {
            return "error";
        } else if (reageerpositie > 60) {
            return "warning";
        } else if (reageerpositie <= publicRuntimeConfig.minReageerPositie) {
            return "success";
        } else {
            return "warning";
        }
    })();
    const reactiesColor = (() => {
        const aantalreacties = parseInt(data.aantalreacties);
        if (aantalreacties > 100) {
            return "error";
        } else if (aantalreacties > 60) {
            return "warning";
        } else if (aantalreacties <= 30) {
            return "success";
        } else {
            return "default";
        }
    })();
    return (
        <Card key={index++}

              css={{ w: "100%", h: "530px" }}>
            <Card.Header css={{ position: "absolute", backdropFilter: "saturate(180%) blur(10px)", background: "rgba(15, 17, 20, 0.4)", borderBottom: "var(--nextui-borderWeights-light) solid var(--nextui-colors-gray800)", top: "0px", zIndex: 1 }} >
                <Row gap={1} justify="flex-start" align="flex-start">
                    <Col>
                        <Text size={12} weight="bold" transform="uppercase" color="#e2e2e2">
                            {subheader}
                        </Text>
                        <Text h4 color="white">
                            {header}
                        </Text>
                    </Col>
                </Row>
                <Row gap={1} justify="flex-end" align="flex-end">
                    <Text blockquote color={`${parseInt(data.totalehuur) > parseInt(publicRuntimeConfig.maxHuur) ? 'warning' : 'success'}`}>
                        € {parseInt(data.totalehuur)},-
                    </Text>
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <div ref={sliderRef} className="keen-slider" style={{height: 400, width: 'auto'}}>
                    {data.media.map((image, index2) => (
                        image.mainfoto && (
                            <div className="keen-slider__slide" key={index2++}>
                                <Card.Image
                                    alt={image.omschrijving}
                                    key={index2++}
                                    src={`https:${image.mainfoto}`}
                                    objectFit="cover"
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        )
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
                            <Col span={10}>
                                <Text>Reageerpositie:</Text>
                                <Text weight={'extrabold'} color={positieColor}>{parseInt(data.reageerpositie)} &nbsp;</Text>
                            </Col>
                            <Col span={6}>
                                <Text>Aantal reacties:</Text>
                                <Text weight={'bold'} color={reactiesColor}>{data.aantalreacties} &nbsp;</Text>
                            </Col>
                            <Col>
                                <Row justify="flex-end">
                                    <Link
                                        href={{
                                            pathname: '/woning/[slug]',
                                            query: { slug: data.id },
                                        }}>
                                        <Button
                                            flat
                                            auto
                                            rounded
                                            color="primary"
                                        >
                                            <Text
                                                css={{ color: "inherit" }}
                                                size={12}
                                                weight="bold"
                                                transform="uppercase"
                                            >
                                                Bekijk woning
                                            </Text>
                                        </Button>
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};
