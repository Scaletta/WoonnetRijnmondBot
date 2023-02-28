import {Col, Row, User, Text, Tooltip, Popover} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './table.styled';
import getConfig from "next/config";
import Link from "next/link";
import {WoningSlider} from "../woning/WoningSlider";

const {publicRuntimeConfig} = getConfig();
export const RenderCell = ({woning, columnKey}) => {
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
    }, []);
    const cellValue = woning[columnKey];
    let avatarImage;
    if(woning.media[0].mainfoto !== null && woning.media[0].mainfoto !== ""){
        avatarImage = "https:" + woning.media[0].mainfoto;
    }
    else{
        avatarImage = "https:" + woning.media[0].presentation;
    }
    switch (columnKey) {
        case 'straat':
            return (
                <Popover placement={"top-right"}>
                    <Popover.Trigger>
                        <User squared src={avatarImage} name={cellValue + ' ' + woning.huisnummer}  css={{p: 0}}>
                            {woning.plaats} - {woning.wijk}
                        </User>
                    </Popover.Trigger>
                    <Popover.Content>
                        {woning.media.length > 1 ? <WoningSlider woning={woning} /> : null}
                    </Popover.Content>
                </Popover>
            );
        case 'totalehuur':
            return (
                <Col>
                    <Row>
                        <Text b size={14} css={{tt: 'capitalize'}}>
                            € {cellValue}
                        </Text>
                    </Row>
                    <Row>
                        <Text
                            b
                            size={13}
                            css={{tt: 'capitalize', color: '$accents7'}}
                        >
                            Kaal: € {woning.kalehuur}
                        </Text>
                    </Row>
                </Col>
            );
        case 'name':
            return (
                <Col>
                    <Row>
                        <Text b size={14} css={{tt: 'capitalize'}}>
                            {cellValue}
                        </Text>
                    </Row>
                    <Row>
                        <Text
                            b
                            size={13}
                            css={{tt: 'capitalize', color: '$accents7'}}
                        >
                            {woning.huisnummer}
                        </Text>
                    </Row>
                </Col>
            );
        case 'reageerpositie':
            let positie_type = 'low';
            if(woning.reageerpositie < publicRuntimeConfig.minReageerPositie){
                positie_type = 'low';
            }
            else if(woning.reageerpositie < 100){
                positie_type = 'medium';
            }
            else{
                positie_type = 'high';
            }
            return (
                // @ts-ignore
                <StyledBadge type={String(positie_type)}>{parseInt(cellValue)}</StyledBadge>
            );
        case 'aantalreacties':
            let aantalreacties_type = 'low';
            if(woning.aantalreacties < 50){
                aantalreacties_type = 'low';
            }
            else if(woning.aantalreacties < 100){
                aantalreacties_type = 'medium';
            }
            else{
                aantalreacties_type = 'high';
            }
            return (
                // @ts-ignore
                <StyledBadge type={String(aantalreacties_type)}>{cellValue}</StyledBadge>
            );
        case 'actions':
            return (
                <Row
                    justify="center"
                    align="center"
                    css={{'gap': '$8', '@md': {gap: 0}}}
                >
                    <Col css={{d: 'flex'}}>
                        <Link href={'/woning/'+ woning.id}>
                            <Tooltip content="Details">
                                <IconButton
                                    onClick={() => console.log('View user', woning.id)}
                                >
                                    <EyeIcon size={20} fill="#979797" />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </Col>
                </Row>
            );
        case 'totaleoppervlakte':
            return (
                <Col>
                    <Row>
                        <Text b size={14}>
                            {cellValue} m²
                        </Text>
                    </Row>
                </Col>
            );
        case 'publstop':
            if(woning.verdeelmodel === "Wens&Wacht"){
                return (
                    <StyledBadge type={"low"}>N.V.T.</StyledBadge>
                )
            }
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            let style = "medium"
            let text = days.toString().padStart(1, '0') + "dag " + hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
            if(days >= 3){
                style = "low";
            }
            else if(days > 0){
                style = "medium";
            }
            else {
                style = "high";
                text = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
            }
            return (
                <StyledBadge type={style}>{text}</StyledBadge>
            );
        default:
            return (
                <Col>
                    <Row>
                        <Text b size={14} css={{tt: 'capitalize'}}>
                            {cellValue}
                        </Text>
                    </Row>
                </Col>
            );
    }
};
