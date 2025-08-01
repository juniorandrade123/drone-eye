import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'dashboard-performance',
    imports: [NgApexchartsModule],
    templateUrl: './performance.component.html',
    styles: ``,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerformanceComponent {
    performanceChart: Partial<ChartOptions> = {
        series: [
            {
                name: "Sucesso",
                type: "bar",
                data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
            },
            {
                name: 'Com Erro',
                type: 'bar',
                data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
            },
            {
                name: "Sem Imagem",
                type: "bar",
                data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
            }
        ],
        chart: {
            height: 320,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            dashArray: [0, 0, 0],
            width: [0, 0, 0],
            curve: 'smooth'
        },
        fill: {
            opacity: [1, 1],
            type: ['solid', 'solid'],
            gradient: {
                type: "vertical",
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90]
            },
        },
        markers: {
            size: [0, 0, 0],
            strokeWidth: 2,
            hover: {
                size: 4,
            },
        },
        xaxis: {
            categories: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Aug",
                "Set",
                "Out",
                "Nov",
                "Dez",
            ],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            min: 0,
            axisBorder: {
                show: false,
            }
        },
        grid: {
            show: true,
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 0,
                left: 10,
            },
        },
        legend: {
            show: true,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: 5,

            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "35%",
                barHeight: "80%",
                borderRadius: 5,
            },
        },
        colors: ["#04CB47", "#C92B19", "#0155F4"],
        tooltip: {
            shared: true,
        },
    }
}