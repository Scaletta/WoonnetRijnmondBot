import {Dropdown, Input, Navbar, Text} from "@nextui-org/react";
import {AcmeLogo} from "./AcmeLogo";
import {SearchIcon} from "./SearchIcon";
import React from "react";

export const Layout = ({children, text, searchbar}) => (
    <>
        <Navbar isBordered variant="sticky" css={{zIndex: "500"}}>
            <Navbar.Brand css={{mr: "$4"}}>
                <AcmeLogo/>
                <Text b color="inherit" css={{mr: "$11"}} hideIn="xs">
                    Woonnet Rijnmond Bot
                </Text>
                <Navbar.Content hideIn="xs" variant="highlight">
                    <Navbar.Link isActive href={process.env.PUBLIC_URL}>
                        Home
                    </Navbar.Link>
                    {/*                            <Navbar.Link href="#">Team</Navbar.Link>
                            <Navbar.Link href="#">Activity</Navbar.Link>
                            <Navbar.Link href="#">Settings</Navbar.Link>*/}
                </Navbar.Content>
            </Navbar.Brand>
            <Navbar.Content
                css={{
                    "@xsMax": {
                        w: "100%",
                        jc: "space-between",
                    },
                }}
            >
                {searchbar ?(
                    <Navbar.Item
                        css={{
                            "@xsMax": {
                                w: "100%",
                                jc: "center",
                            },
                        }}
                    >
                        <Input
                            clearable
                            contentLeft={
                                <SearchIcon fill="var(--nextui-colors-accents6)" size={16}/>
                            }
                            contentLeftStyling={false}
                            css={{
                                w: "100%",
                                "@xsMax": {
                                    mw: "300px",
                                },
                                "& .nextui-input-content--left": {
                                    h: "100%",
                                    ml: "$4",
                                    dflex: "center",
                                },
                            }}
                            placeholder="Zoek woning..."
                        />
                    </Navbar.Item>
                ) : ''}
                <Dropdown placement="bottom-right">
                    <Text color="inherit" css={{mr: "$11"}} hideIn="xs">
                        {text}
                    </Text>
                </Dropdown>
            </Navbar.Content>
        </Navbar>
        {children}
    </>
);
