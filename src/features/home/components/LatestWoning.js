import {Card, Loading, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../../../components/styles/box';
import {Flex} from '../../../components/styles/flex';

export const LatestWoning = ({woning}) => {
    if(woning === undefined) return (
        <Card
            css={{
                mw: '375px',
                bg: '$linear-gradient(180deg, #1E1E1E 0%, #1E1E1E 100%)',
                borderRadius: '$xl',
                px: '$6',
            }}
        >
                <Loading size="md"></Loading>
        </Card>
    );
    return (
        <Card
            isPressable
            isHoverable
            css={{
                mw: '375px',
                minHeight: '200px',
                bg: '#a9a9a9',
                backgroundImage: `url(${woning.media[0].stamp})`,
                backgroundSize: 'fit',
                borderRadius: '$xl',
                backgroundBlendMode: 'multiply',
                px: '$6',
            }}
        >
            <Card.Body css={{py: '$10'}}>
                <Flex css={{gap: '$5'}}>

                    <Flex direction={'column'}>
                        <Text span css={{color: 'white'}}>
                            {woning.straat} {woning.huisnummer}
                        </Text>
                        <Text span css={{color: 'white'}} size={'$xs'}>
                            {woning.postcode} {woning.plaats}
                        </Text>
                    </Flex>
                    <Flex css={{marginLeft: 'auto'}} direction={'column'}>
                        <Text span css={{color: 'white'}}>
                            <span>Positie:</span> <b>{woning.reageerpositie}</b>
                        </Text>
                        <Text span css={{color: 'white'}} size={'$xs'}>
                            <span>Reacties:</span> <b>{woning.aantalreacties}</b>
                        </Text>
                    </Flex>
                </Flex>
                <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
                    <Text
                        span
                        size={'$xl'}
                        css={{color: 'white'}}
                        weight={'semibold'}
                    >
                        € {woning.totalehuur}
                    </Text>
                    <Text span css={{color: '$green600'}} size={'$xs'}>

                    </Text>
                </Flex>
                <Flex css={{gap: '$12', marginTop: 'auto'}} align={'center'}>
                    <Box>
                        <Text
                            span
                            size={'$xs'}
                            css={{color: '$green600'}}
                            weight={'semibold'}
                        >
                            {'↓ '}
                        </Text>
                        <Text span size={'$xs'} css={{color: '$white'}}>
                            {woning.publstart.toLocaleString()}
                        </Text>
                    </Box>
                    <Box>
                        <Text
                            span
                            size={'$xs'}
                            css={{color: '$red600'}}
                            weight={'semibold'}
                        >
                            {'↑ '}
                        </Text>
                        <Text span size={'$xs'} css={{color: '$white'}}>
                            {woning.uiterstereactiedatum}
                        </Text>
                    </Box>
                </Flex>
            </Card.Body>
        </Card>
    );
};