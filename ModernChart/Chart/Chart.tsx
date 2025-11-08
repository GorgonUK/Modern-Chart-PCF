import * as React from "react";
import { AreaChartComponent, ChartHeader, LineChartComponent, PieChartComponent, WideBarChart } from "../components/common/charts";
import { ChartConfig } from "../components/common/shadcn/ui/chart";
import { IInputs } from "../generated/ManifestTypes";
import { getBooleanParameter, getEnumParameter, getNumberParameter, getStringParameter, inferLocaleFromSymbol } from "../lib/utils";
import { ChartOptions } from "../common/types/chartOptions";
import { Container } from "./styles";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import getSymbolFromCurrency from "currency-symbol-map";
import { getCurrency } from "locale-currency";
import { ChartType } from "../common/consts/chartType";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

dayjs.extend(customParseFormat);

interface ChartProps {
  context: ComponentFramework.Context<IInputs>;
  notifyOutputChanged: () => void;
}

export class Chart extends React.Component<ChartProps> {
  private poll?: number;
  private isLoading = () => {
    const ds = this.props.context.parameters.chartDataset as DataSet | undefined;
    return !ds || ds.loading || Object.keys(ds.records).length === 0;
  };
  private schedulePoll() {
    clearTimeout(this.poll);
    if (this.isLoading()) {
      this.poll = window.setTimeout(() => this.forceUpdate(), 500);
    }
  }
  componentDidMount() { this.schedulePoll(); }
  componentDidUpdate() { this.schedulePoll(); }
  componentWillUnmount() { clearTimeout(this.poll); }
  private buildData() {
    const catInput = getStringParameter(this.props.context, "categoryField")?.trim();
    const seriesCsv = getStringParameter(this.props.context, "seriesFields")?.trim();
    const ds = this.props.context.parameters.chartDataset as DataSet;
    const numericTypes = ["Decimal", "Double", "Integer", "Money", "BigInt"];
    const isNumeric = (c: DataSetInterfaces.Column) => numericTypes.includes(c.dataType);
    const cols = ds.columns || [];

    // Choose category column (case-insensitive) with robust fallbacks
    const categoryCol =
      cols.find(c => (catInput ? c.name?.toLowerCase() === catInput.toLowerCase() : !isNumeric(c))) ||
      cols.find(c => !isNumeric(c)) ||
      cols[0];

    // If there are no columns at all, short-circuit safely
    if (!categoryCol) {
      return { loading: false, chartData: [], chartConfig: {} as ChartConfig, categoryCol: "" };
    }

    const seriesCols = cols.filter(c =>
    (seriesCsv ? seriesCsv.split(",").map(s => s.trim()).includes(c.name)
      : isNumeric(c)));

    const paletteParam = getStringParameter(this.props.context, "paletteOverride")?.trim();
    const palette = paletteParam
      ? paletteParam.split(",").map(c => c.trim()).filter(c => /^#?[0-9A-Fa-f]{6}$/.test(c))
      : ["#2563eb", "#60a5fa", "#22d3ee", "#4ade80"];

    const chartConfig: ChartConfig = Object.fromEntries(
      seriesCols.map((c, i) => [
        c.name,
        {
          label: c.displayName,
          color: palette[i % palette.length],
          dataType: c.dataType,
        },
      ])
    ) as ChartConfig;

    const ids = ds.sortedRecordIds?.length ? ds.sortedRecordIds : Object.keys(ds.records);
    const chartData = ids.map(id => {
      const r = ds.records[id];
      const raw = r.getValue(categoryCol.name);

      let dateVal: Date;
      if (raw instanceof Date) {
        dateVal = raw;
      } else if (typeof raw === "string") {
        // Strictly parse common ISO-like inputs without relying on native Date parsing
        // 1) Date only: YYYY-MM-DD
        // 2) Naive datetime (no zone): YYYY-MM-DDTHH:mm:ss
        // 3) Datetime with timezone: YYYY-MM-DDTHH:mm:ssZ or offset
        const parsed =
          dayjs(raw, ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm:ssZ"], true);
        dateVal = parsed.isValid() ? parsed.toDate() : dayjs(String(raw)).toDate();
      } else if (typeof raw === "number") {
        dateVal = raw > 2_000_000_000
          ? new Date(raw)
          : dayjs(raw.toString(), "YYYYMMDD", true).toDate();
      } else {
        dateVal = new Date();
      }

      const row: Record<string, any> = { date: dateVal };
      seriesCols.forEach(c => {
        const rawValue = r.getValue(c.name);
        const formatted = r.getFormattedValue(c.name);

        row[c.name] = typeof rawValue === "number" ? rawValue : Number(rawValue) || 0;
        row[`__formatted__${c.name}`] = formatted;
        row[`__label__${c.name}`] = c.displayName;
      });
      return row;
    });

    return { loading: false, chartData, chartConfig, categoryCol: categoryCol.name };
  }

  render() {
    const { context } = this.props;
    const chartType = getEnumParameter(context, "chartType", ChartType);

    // Control is loading
    if (this.isLoading()) return <div>Loading…</div>;

    // Build data
    const { chartData, chartConfig } = this.buildData();

    //No data found in dataset
    if (!chartData?.length) return <div>No data</div>;

    const chartHeaderOptions: ChartOptions = {
      headerTotals: getBooleanParameter(context, "displayHeaderTotals"),
      textColor: getStringParameter(context, "textColor"),
    };
    const chartBodyOptions: ChartOptions = {
      chartHeight: getStringParameter(context, "chartHeight"),
      smoothBars: getBooleanParameter(context, "enableSmoothBars"),
      textColor: getStringParameter(context, "textColor"),
      isCanvas: getBooleanParameter(context, "isCanvas")
    };

    const totals: Record<string, { value: number; formatted?: string }> = {};
    Object.keys(chartConfig).forEach((k) => {
      const value = chartData.reduce((n, r) => n + (r[k] ?? 0), 0);
      let formatted: string | undefined;

      if (chartConfig[k].dataType === "Currency") {
        const localeOverride = getStringParameter(context, "localeOverride")?.trim();
        const locale = localeOverride || "en-GB";
        const isCanvas = getBooleanParameter(context, "isCanvas");

        let currency = "GBP"; // default fallback
        let symbol = "¤";

        if (!isCanvas) {
          const sampleRaw = chartData.find(r => r[`__formatted__${k}`])?.[`__formatted__${k}`];
          const sample = typeof sampleRaw === "string" ? sampleRaw : "";
          const match = sample.match(/^[^\d\s.,]+/)?.[0];
          symbol = match ?? symbol;
        } else {
          const inferredCurrency = getCurrency(locale);
          if (inferredCurrency) {
            currency = inferredCurrency;
            const inferredSymbol = getSymbolFromCurrency(currency);
            if (inferredSymbol) symbol = inferredSymbol;
          }
        }

        const formatter = new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          currencyDisplay: "symbol",
          maximumFractionDigits: 2,
        });

        formatted = formatter.format(value);
        // store formatter in chartConfig
        chartConfig[k].formatter = formatter;
        chartConfig[k].isCanvas = isCanvas;
      }

      totals[k] = { value, formatted };
    });


    return (
      <Container>
        {getBooleanParameter(context, "displayChartHeader") && (
          <ChartHeader
            title={getStringParameter(context, "chartTitle")}
            description={getStringParameter(context, "chartDescription")}
            totals={totals}
            chartConfig={chartConfig}
            chartOptions={chartHeaderOptions}
          />
        )}
        {{
          Bar: <WideBarChart data={chartData} chartConfig={chartConfig} chartOptions={chartBodyOptions} />,
          Line: <LineChartComponent data={chartData} chartConfig={chartConfig} chartOptions={chartBodyOptions} />,
          Area: <AreaChartComponent data={chartData} chartConfig={chartConfig} chartOptions={chartBodyOptions} />,
          Pie: <PieChartComponent data={chartData} chartConfig={chartConfig} chartOptions={chartBodyOptions} />,
        }[chartType]}
      </Container>
    );
  }
}
