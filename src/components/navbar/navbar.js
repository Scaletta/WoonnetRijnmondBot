import {Navbar, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';
import {BurguerButton} from './burguer-button';
import { MdUpdate } from "react-icons/md";
import {DarkModeSwitch} from "./darkmodeswitch";
import getConfig from "next/config";
import {CgDarkMode} from "react-icons/cg";

const { publicRuntimeConfig } = getConfig();
const modifiedDate = new Date(publicRuntimeConfig.modifiedDate).toLocaleString('nl-NL');
export const NavbarWrapper = ({children}) => {
    return (
        <Box
            css={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: '1  auto',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <Navbar
                isBordered
                css={{
                    'borderBottom': '1px solid $border',
                    'justifyContent': 'space-between',
                    'width': '100%',
                    '@md': {
                        justifyContent: 'space-between',
                    },

                    '& .nextui-navbar-container': {
                        'border': 'none',
                        'maxWidth': '100%',

                        'gap': '$6',
                        '@md': {
                            justifyContent: 'space-between',
                        },
                    },
                }}
            >
                <Navbar.Content showIn="md">
                    <BurguerButton />
                </Navbar.Content>
                <Navbar.Content

                    css={{
                        width: '100%',
                        paddingLeft: '25px',
                        paddingRight: '25px',
                    }}
                >
{/*                    <Input
                        clearable
                        contentLeft={
                            <SearchIcon
                                fill="var(--nextui-colors-accents6)"
                                size={16}
                            />
                        }
                        contentLeftStyling={false}
                        css={{
                            'w': '100%',
                            'transition': 'all 0.2s ease',
                            '@xsMax': {
                                w: '100%',
                                // mw: '300px',
                            },
                            '& .nextui-input-content--left': {
                                h: '100%',
                                ml: '$4',
                                dflex: 'center',
                            },
                        }}
                        placeholder="Search..."
                    />*/}
                </Navbar.Content>
                <Navbar.Content css={{paddingRight: 25}}>
                    <Navbar.Content hideIn="md">
                        <Flex align={'center'} css={{gap: '$4'}}>
                            <Text align={'center'} css={{paddingTop: 3}} span><CgDarkMode size={24}/></Text>
                            <DarkModeSwitch />
                        </Flex>
                    </Navbar.Content>
                    <Navbar.Content>

                        <Text align={'right'} css={{paddingTop: 3}} span><MdUpdate size={24}/></Text>
                        <Text align={'center'} css={{marginLeft: -20}} span> {modifiedDate}</Text>
                    </Navbar.Content>
                </Navbar.Content>
            </Navbar>
            {children}
        </Box>
    );
};
