import {Dropdown, Text} from '@nextui-org/react';
import React, {useState} from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';
import {FaHome} from "react-icons/fa";

export const CompaniesDropdown = () => {
    return (
        <Box>
            <Flex align={'center'} css={{gap: '$7'}}>
                <FaHome size={50}/>
                <Box>
                    <Text
                        h3
                        size={'$xl'}
                        weight={'medium'}
                        css={{
                            m: 0,
                            color: '$accents9',
                            lineHeight: '$lg',
                            mb: '-$5',
                        }}
                    >
                        Woonnet Rijnmond Bot
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};