import {Button, Input, Text} from '@nextui-org/react';
import React, {useState} from 'react';
import {Flex} from '../../components/styles/flex';
import {TableWrapper} from '../../components/table/table';
import Head from "next/head";

export const Woningen = ({woningen}) => {
    const [searchQuery, setSearchQuery] = useState('');
    function handleSearchInputChange(event) {
        setSearchQuery(event.target.value);
    }
    function sortedWoningen(searchQuery = '') {
        return woningen.woningen
            .filter((woning) =>
                Object.values(woning).some((value) =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            .map((woning) => {
                if (woning.id === 123) { // replace 123 with the ID of the item to update
                    return {
                        ...woning,
                        propertyName: newValue // replace propertyName and newValue with the actual property name and value to update
                    };
                } else {
                    return {
                        ...woning,
                        publstart: new Date(woning.publstart)
                    };
                }
            })
            .sort((a, b) => b.publstart - a.publstart);
    }
    return (
        <Flex
            css={{
                'mt': '$5',
                'px': '$6',
                '@sm': {
                    mt: '$10',
                    px: '$16',
                },
            }}
            justify={'center'}
            direction={'column'}
        >
            <Head>
                <title>Woonnet Rijnmond Bot - Woningen</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Text
                h1
                css={{
                    textGradient: "45deg, $pink600 -20%, $blue600 50%",
                    'mb': '$8',
                }}
                weight="bold"
            >
                Woningen
            </Text>
            <Flex
                css={{gap: '$8'}}
                align={'center'}
                justify={'between'}
                wrap={'wrap'}
            >
                <Flex
                    css={{
                        'gap': '$6',
                        'flexWrap': 'wrap',
                        '@sm': {flexWrap: 'nowrap'},
                    }}
                    align={'center'}
                >
                    <Input
                        aria-label="Zoek woningen"
                        css={{width: '100%', maxW: '410px'}}
                        placeholder="Zoek woningen"
                        value={searchQuery} onChange={handleSearchInputChange}
                    />
                </Flex>
                <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>

                    <Button auto /*iconRight={<ExportIcon />}*/>
                        Export to CSV
                    </Button>
                </Flex>
            </Flex>

            <TableWrapper data={sortedWoningen()} />
        </Flex>
    );
};
