import React, {useState} from 'react'
import 'keen-slider/keen-slider.min.css'
import {useKeenSlider} from 'keen-slider/react'
import {Button, Card, Col, Row, Text} from "@nextui-org/react";
import Link from "next/link";
import Iframe from "react-iframe";

function Arrow(props) {
    const disabeld = props.disabled ? " arrow--disabled" : ""
    return (
        <svg
            onClick={props.onClick}
            className={`arrow ${
                props.left ? "arrow--left" : "arrow--right"
            } ${disabeld}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            {props.left && (
                <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
            )}
            {!props.left && (
                <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/>
            )}
        </svg>
    )
}

export const WoningSlider = ({woning, header = false}) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        },
    })
    return (
        <Card>
            {header && loaded ?
                <Card.Header
                    isBlurred
                    css={{
                        justifyItems: "flex-start",
                        position: "absolute",
                        bgBlur: "#0f111466",
                        borderTop: "$borderWeights$light solid $gray800",
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <Col>
                        <Row wrap="wrap" justify="space-between" align="center" css={{marginBottom: 10}}>
                            <Text b color={'#fff'}>{woning.straat} {woning.huisnummer} - {woning.plaats}</Text>
                            <Text b color={'#fff'}>Huur: € {woning.totalehuur}</Text>
                        </Row>
                        <Row wrap="wrap" justify="space-between" align="center">
                            <Link href={'/woning/' + woning.id}>
                                <Button size="sm" css={{color: "$accents1", fontWeight: "$semibold", fontSize: "$sm"}}>
                                    Bekijk woning
                                </Button>
                            </Link>
                            <Text b color={'#fff'}>Type: {woning.verdeelmethode}</Text>
                        </Row>
                    </Col>
                </Card.Header>
                : null}
            <Card.Body css={{p: 0}}>
                <div ref={sliderRef} className="keen-slider" style={{height: '100%', width: 400}}>
                    {woning.media.map((image, index) => (
                        image.mainfoto !== null && image.mainfoto !== "" && !image.mainfoto.includes('.pdf') ? (
                            <div className="keen-slider__slide" key={index++}>
                                <Card.Image
                                    alt={image.omschrijving}
                                    key={index}
                                    src={`https:${image.mainfoto}`}
                                    objectFit="cover"
                                    width="100%"
                                    height="100%"
                                    style={{borderRadius: 5}}
                                />
                            </div>
                        ) : image.original.includes('.pdf') ? (
                            <div className="keen-slider__slide" key={index++}>
                                <Iframe url={`https:${image.original}`}
                                        width="400px"
                                        height="100%%"
                                />
                            </div>
                        ) : (
                            <div className="keen-slider__slide" key={index++}>
                                <Card.Image
                                    alt={image.omschrijving}
                                    key={index}
                                    src={`https:${image.original}`}
                                    objectFit="cover"
                                    width="100%"
                                    height="100%"
                                    style={{borderRadius: 5}}
                                />
                            </div>
                        )
                    ))}
                </div>
                {loaded && instanceRef.current && (
                    <>
                        <Arrow
                            left
                            onClick={(e) =>
                                e.stopPropagation() || instanceRef.current?.prev()
                            }
                            disabled={currentSlide === 0}
                        />

                        <Arrow
                            onClick={(e) =>
                                e.stopPropagation() || instanceRef.current?.next()
                            }
                            disabled={
                                currentSlide ===
                                instanceRef.current.track.details.slides.length - 1
                            }
                        />
                    </>
                )}
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
                {loaded && instanceRef.current && (
                    <div className="dots">
                        {[
                            ...Array(instanceRef.current.track.details.slides.length).keys(),
                        ].map((idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        instanceRef.current?.moveToIdx(idx)
                                    }}
                                    className={"dot" + (currentSlide === idx ? " active" : "")}
                                ></button>
                            )
                        })}
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
}
