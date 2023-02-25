import {Card, Loading, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../../../components/styles/box';
import {Flex} from '../../../components/styles/flex';
import getConfig  from "next/config";

const {publicRuntimeConfig} = getConfig()
export const Counter = ({value, type}) => {
    if (type === undefined) return (
        <Card
            css={{
                mw: '300px',
                bg: '$accents0',
                height: '200px',
                borderRadius: '$xl',
                alignContent: 'center',
                justifyContent: 'center',
                px: '$6',
            }}
        >
            <Loading size="md"></Loading>
        </Card>
    );
    let color = "black"
    let data = value;
    if(type === 'reageerpositie') {
        const v = parseInt(value);
        if(v < publicRuntimeConfig.minReageerPositie){
            color = "green";
        }
        else if(v >= 50 && v < 100){
            color = "orange";
        }
        else{
            color = "red";
        }
    }
    else if(type === 'huur'){
        const v = parseInt(value);
        if(v < publicRuntimeConfig.maxHuur){
            color = "green";
        }
        else{
            color = "red";
        }
        data = "€ " + value + ',-';
    }
    return (
        <Card
            css={{
                mw: '300px',
                bg: '$accents0',
                height: '200px',
                borderRadius: '$xl',
                alignContent: 'center',
                justifyContent: 'center',
                px: '$6',
            }}
        >
            <Card.Body css={{py: '$10', gap: '$4'}}>
                <Flex
                    css={{
                        width: '100%',
                    }}
                    justify={'center'}
                >
                    <Flex
                        align={'center'}
                        direction={'row'}
                        justify={'center'}
                        css={{
                            width: '150px',
                            border: '2.5px dashed $border',
                            borderRadius: '$base',
                        }}
                    >
                        <Box>
                            <Flex direction={'column'}>
                                <Text h1 css={{margin: 0, color: color}}>
                                    {data}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                </Flex>
            </Card.Body>
        </Card>
    );
};