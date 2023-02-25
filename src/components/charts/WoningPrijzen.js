import React from 'react';
import {Box} from '../styles/box';
import Chart from 'react-apexcharts';

export const WoningPrijzen = ({woningen}) => {
    const options = {
        chart: {
            type: 'line',
            animations: {
                easing: 'linear',
                speed: 300,
            },
            id: 'basic-bar',
            fontFamily: 'Inter, sans-serif',
            foreColor: 'var(--nextui-colors-accents9)',
        },
        xaxis: {
            categories: woningen.map((woning) => woning.straat + " " + woning.huisnummer + " " + woning.plaats),
            labels: {
                show: true,
                style: {
                    colors: 'var(--nextui-colors-accents8)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                },
            },
            axisBorder: {
                color: 'var(--nextui-colors-border)',
            },
            axisTicks: {
                color: 'var(--nextui-colors-border)',
            },
        },
        yaxis: {
            title: {
                text: 'Huur',
            },
            labels: {
                style: {
                    colors: 'var(--nextui-colors-accents8)',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: {
                fontFamily: 'Inter, sans-serif',
            },
        },
        grid: {
            show: true,
            borderColor: 'var(--nextui-colors-border)',
            strokeDashArray: 0,
            position: 'back',
        },
        stroke: {
            width: [0, 4],
        },
        dataLabels: {
            enabled: false,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#000']
            }
        },
        markers: true,
    };
    const state = [
        {
            name: "Huur",
            type: "column",
            data: woningen.map((woning) => {
                const huur = woning.kalehuur ? woning.kalehuur : woning.totalehuurmin;
                return Number(parseInt(huur));
            }),
            tooltip: {
                x: {
                    formatter: function (val) {
                        const woning = woningen[val];
                        return "Woning " + woning.id;
                    },
                },
                y: {
                    formatter: function (val) {
                        return "Huur: " + val;
                    },
                },
            },
        },
        {
            name: "Reageerpositie",
            type: "line",
            data: woningen.map((woning) => Number(parseInt(woning.reageerpositie))),
            tooltip: {
                x: {
                    formatter: function (val) {
                        const woning = woningen[val];
                        return "Woning:" + woning.id;
                    },
                },
                y: {
                    formatter: function (val) {
                        return "Reageerpositie: " + val;
                    },
                },
            },
        },
    ];
    return (
        <>
            <Box
                css={{
                    width: '100%',
                    zIndex: 5,
                }}
            >
                <div id="chart">
                    <Chart
                        categories={woningen.map((woning) => woning.postcode)}
                        options={options}
                        series={state}
                        type="line"
                        height={425}
                    />
                </div>
            </Box>
        </>
    );
};