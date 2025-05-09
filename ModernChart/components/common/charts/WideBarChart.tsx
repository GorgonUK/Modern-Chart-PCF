import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";
import dayjs from "dayjs";

import {
  ChartContainer,
  ChartConfig,
} from ".././shadcn/ui/chart";
import { ChartOptions } from "@/ModernChart/types/chartOptions";

type Props = {
  data: any[];
  chartConfig: ChartConfig;
  chartOptions: ChartOptions;
};

export function WideBarChart({ data, chartConfig, chartOptions }: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full"
      style={{ height: `${chartOptions.chartHeight ?? 250}px` }}
    >
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(v) => dayjs(v).format("MMM D")}
        />
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          formatter={(value, name, props) => {
            const config = chartConfig[name];
            const type = config?.dataType;
            const label = props.payload?.[`__label__${name}`] ?? config?.label ?? name;
            const formattedValue = props.payload?.[`__formatted__${name}`];

            let display = value;
            if (type === "Currency" && typeof formattedValue === "string") {
              display = formattedValue;
            } else if (type === "Decimal") {
              display = Number(value).toFixed(2);
            } else if (type?.includes("Whole")) {
              display = Number(value).toLocaleString();
            }

            return [display, label];
          }}
          labelFormatter={(label) => {
            const date = label instanceof Date ? label : new Date(label);
            return isNaN(date.getTime()) ? "Invalid date" : dayjs(date).format("MMM D, YYYY");
          }}
        />

        {Object.keys(chartConfig).map((k) => (
          <Bar
            key={k}
            dataKey={k}
            fill={`var(--color-${k})`}
            {...(chartOptions.smoothBars ? { radius: [4, 4, 0, 0] } : {})}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
