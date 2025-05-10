import React, { useState } from "react";

import {
  CardHeader as ShadCardHeader,
  CardTitle,
  CardDescription,
} from "../../shadcn/ui/card";
import type { ChartConfig } from "../../shadcn/ui/chart";
import { ChartOptions } from "@/ModernChart/common/types/chartOptions";
type Props = {
  title: string;
  description: string;
  chartConfig: ChartConfig;
  totals: Record<string, { value: number; formatted?: string }>;
  chartOptions: ChartOptions
};

function CardHeader({ title,
  description,
  chartConfig,
  totals,
  chartOptions
}: Props) {
  const textColor = typeof chartOptions.textColor === "string" ? chartOptions.textColor : undefined;
  return (
    <ShadCardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center items-start gap-1 px-6 py-5 sm:py-6">
        <div className="flex items-center gap-1.5">
          <CardTitle style={{ color: textColor }}>
            {title}
          </CardTitle>
        </div>
        <CardDescription style={{ color: textColor }}>
          {description}
        </CardDescription>
      </div>
      {chartOptions.headerTotals === true && (
        <div className="flex">

          {Object.keys(chartConfig).map((k) => (
            <div
              key={k}
              className="cursor-default relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            >
              <span
                className="text-xs text-muted-foreground"
                style={{ color: textColor }}
              >
                {chartConfig[k].label}
              </span>
              <span
                className="text-lg font-bold leading-none sm:text-3xl"
                style={{ color: textColor }}
              >
                {totals[k]?.formatted ?? totals[k]?.value.toLocaleString()}
              </span>

            </div>
          ))}
        </div>)}
    </ShadCardHeader>
  );
}

export default CardHeader;
