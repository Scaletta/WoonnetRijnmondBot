import {Col, Row, User, Text, Tooltip, Popover} from '@nextui-org/react';
import React from 'react';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './table.styled';
import getConfig from "next/config";
import Link from "next/link";

const {publicRuntimeConfig} = getConfig();
export const RenderCell = ({woning, columnKey}) => {
    // @ts-ignore
    const cellValue = woning[columnKey];
    switch (columnKey) {
        case 'straat':
            return (
                <Popover>
                    <Popover.Trigger>
                        <User pointer={true} squared src={'https:' + woning.media[0].mobile} name={cellValue + ' ' + woning.huisnummer}  css={{p: 0}}>
                            {woning.plaats} - {woning.wijk}
                        </User>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$10" }}>This is the content of the popover.</Text>
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
                            Kalehuur: € {woning.kalehuur}
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