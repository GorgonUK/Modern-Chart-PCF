import React from "react";
import {
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    ChartContainer,
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from ".././shadcn/ui/chart";
import { ChartOptions } from "@/ModernChart/common/types/chartOptions";

type Props = {
    data: any[];
    chartConfig: ChartConfig;
    chartOptions: ChartOptions;
};

export function PieChartComponent({ data, chartConfig, chartOptions }: Props) {
    // Aggregate data for the pie chart
    const pieData = Object.keys(chartConfig).map((key) => {
        const total = data.reduce((sum, row) => sum + (row[key] ?? 0), 0);
        const formatter = chartConfig[key].formatter;
        const formatted = formatter?.format(total);

        return {
            name: key,
            label: chartConfig[key].label ?? key,
            value: total,
            formatted,
            fill: chartConfig[key].color ?? `var(--color-${key})`,
        };
    });
    console.log(pieData)

    const textColor = typeof chartOptions.textColor === "string" ? chartOptions.textColor : undefined;
    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: `${chartOptions.chartHeight ?? 250}px` }}
        >
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => {
                                console.log(value, name)
                                const formatter = chartConfig[name]?.formatter;
                                return formatter ? formatter.format(Number(value)) : value;
                            }}
                        />
                    }
                    cursor={false}
                />

                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 [&>*]:min-w-[120px] [&>*]:justify-center"
                    style={{ color: textColor }}
                />
            </PieChart>
        </ChartContainer>
    );
}
