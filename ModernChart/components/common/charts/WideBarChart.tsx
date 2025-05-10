import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import dayjs from "dayjs";

import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from ".././shadcn/ui/chart";
import { ChartOptions } from "@/ModernChart/common/types/chartOptions";

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
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-white text-black border border-gray-200 shadow-md"
              indicator="dot"
              hideIndicator={false}
              nameKey=""
              labelKey="date"
              formatter={(value, name, props) => {
                const config = chartConfig[name];
                const type = config?.dataType;
                const label = props?.payload?.[`__label__${name}`] ?? config?.label ?? name;
                const formattedValue = props?.payload?.[`__formatted__${name}`];
                let display = value;

                if (chartOptions.isCanvas && config?.formatter) {
                  try {
                    display = config.formatter.format(Number(value));
                  } catch (err) {
                    console.warn("Formatter error:", err);
                  }
                } else {
                  if (type === "Currency" && typeof formattedValue === "string") {
                    display = formattedValue;
                  } else if (type === "Decimal") {
                    if (chartOptions.isCanvas) {
                      display = Number(value)
                    } else {
                      display = Number(value).toFixed(2);
                    }

                  } else if (type?.includes("Whole")) {
                    display = Number(value).toLocaleString();
                  }
                }

                return (
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: props?.color ?? "var(--muted)" }}
                      />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                    <span className="font-medium text-foreground text-right">{display}</span>
                  </div>
                );
              }}


              labelFormatter={(_, payload) => {
                const raw = payload?.[0]?.payload?.date;
                const date = raw instanceof Date ? raw : new Date(raw);
                return isNaN(date.getTime())
                  ? "Invalid date"
                  : dayjs(date).format("MMM D, YYYY");
              }}

            />
          }
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
