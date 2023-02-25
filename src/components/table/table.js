import {Table, useAsyncList, useCollator} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {columns} from './data';
import {RenderCell} from './render-cell';

export const TableWrapper = ({data}) => {
    const collator = useCollator({ numeric: true });
    async function load() {
        return {
            items: data,
        };
    }
    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];
                let cmp = collator.compare(first, second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }),
        };
    }
    const list = useAsyncList({ load, sort });
    return (
        <Box
            css={{
                '& .nextui-table-container': {
                    boxShadow: 'none',
                },
            }}
        >
            <Table
                aria-label="Example table with custom cells"
                css={{
                    height: 'auto',
                    minWidth: '100%',
                    boxShadow: 'none',
                    width: '100%',
                    px: 0,
                }}
                selectionMode="multiple"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column
                            key={column.uid}
                            hideHeader={column.uid === 'actions'}
                            allowsSorting
                            align={column.uid === 'actions' ? 'center' : 'start'}
                        >
                            {column.name}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={list.items}>
                    {(item) => (
                        <Table.Row>
                            {(columnKey) => (
                                <Table.Cell>
                                    {RenderCell({woning: item, columnKey: columnKey})}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={15}
                    onPageChange={(page) => console.log({page})}
                />
            </Table>
        </Box>
    );
};