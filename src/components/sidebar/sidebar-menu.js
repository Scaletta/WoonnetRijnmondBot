import {Text} from '@nextui-org/react';
import React from 'react';
import {Flex} from '../styles/flex';

export const SidebarMenu = ({title, children}) => {
    return (
        <Flex css={{gap: '$4'}} direction={'column'}>
            <Text
                span
                size={'$xs'}
                weight={'normal'}
                css={{
                    letterSpacing: '0.04em',
                    lineHeight: '$xs',
                }}
            >
                {title}
            </Text>
            {children}
        </Flex>
    );
};