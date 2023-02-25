import React from 'react';
import {Box} from '../styles/box';
import {Sidebar} from './sidebar.styles';
import {Tooltip} from '@nextui-org/react';
import {Flex} from '../styles/flex';
import {CompaniesDropdown} from './companies-dropdown';
import {HomeIcon} from '../icons/sidebar/home-icon';
import { FaHome, FaMapMarkedAlt, FaBug } from "react-icons/fa";
import {SidebarItem} from './sidebar-item';
import {SidebarMenu} from './sidebar-menu';
import {FaGithub} from 'react-icons/fa';
import {useSidebarContext} from '../layout/layout-context';
import {useRouter} from 'next/router';
import Link from "next/link";

export const SidebarWrapper = () => {
    const router = useRouter();
    const {collapsed, setCollapsed} = useSidebarContext();

    return (
        <Box
            as="aside"
            css={{
                height: '100vh',
                zIndex: 202,
                position: 'sticky',
                top: '0',
            }}
        >
            {collapsed ? <Sidebar.Overlay onClick={setCollapsed}/> : null}

            <Sidebar collapsed={collapsed}>
                <Sidebar.Header>
                    <CompaniesDropdown/>
                </Sidebar.Header>
                <Flex
                    direction={'column'}
                    justify={'between'}
                    css={{height: '100%'}}
                >
                    <Sidebar.Body className="body sidebar">
                        <SidebarItem
                            title="Home"
                            icon={<HomeIcon/>}
                            isActive={router.pathname === '/'}
                            href="/"
                        />
                        <SidebarMenu title="Woningen">
                            <SidebarItem
                                isActive={router.pathname === '/woningen'}
                                title="Woninglijst"
                                icon={<FaHome/>}
                                href="#"
                            />
                            <SidebarItem
                                isActive={router.pathname === '/map'}
                                title="Woningmap"
                                icon={<FaMapMarkedAlt/>}
                                href="/map"
                            />
{/*                            <CollapseItems
                                icon={<HomeIcon/>}
                                items={['Banks Accounts', 'Credit Cards', 'Loans']}
                                title="Balances"
                            />*/}
                        </SidebarMenu>

                        <SidebarMenu title="Debug">
                            <SidebarItem
                                isActive={router.pathname === '/debug'}
                                title="Debug"
                                icon={<FaBug/>}
                                href="#"
                            />
                        </SidebarMenu>
                    </Sidebar.Body>
                    <Sidebar.Footer>
                        <Tooltip content={'Ga naar GitHub'} rounded color="primary">
                            <Link href="https://github.com/Scaletta/WoonnetRijnmondBot">
                                <FaGithub size={25}/>
                            </Link>
                        </Tooltip>
                    </Sidebar.Footer>
                </Flex>
            </Sidebar>
        </Box>
    );
};