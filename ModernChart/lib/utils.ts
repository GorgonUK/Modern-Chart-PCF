import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IInputs } from "../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import getSymbolFromCurrency from "currency-symbol-map";
import { getLocales, getCurrency } from "locale-currency";
import { locales } from "./locales";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getParameterValue<T = any>(
  context: ComponentFramework.Context<IInputs>,
  parameter: keyof IInputs
): T | undefined {
  const param = context.parameters[parameter];
  
  if (
    typeof param === "object" &&
    "raw" in param
  ) {
    return param.raw === "val" ? undefined : (param.raw as T);
  }

  return undefined;
}

export function getBooleanParameter(context: ComponentFramework.Context<IInputs>, parameter: keyof IInputs): boolean {
  return getParameterValue<boolean>(context, parameter) === true;
}

export function getStringParameter(context: ComponentFramework.Context<IInputs>, parameter: keyof IInputs): string {
  return getParameterValue<string>(context, parameter) ?? "";
}

export function getNumberParameter(context: ComponentFramework.Context<IInputs>, parameter: keyof IInputs): number {
  return Number(getParameterValue<number>(context, parameter)) || 0;
}

export const numericTypes = ["Decimal", "Double", "Integer", "Money", "BigInt"];

export const isNumeric = (c: DataSetInterfaces.Column) => numericTypes.includes(c.dataType);

const symbolPreferredLocales: Record<string, string[]> = {
  "£": ["en-GB"],
  "$": ["en-US", "en-CA", "en-AU"],
  "€": ["fr-FR", "de-DE", "es-ES"],
  "¥": ["ja-JP", "zh-CN"],
  "₹": ["en-IN"],
  "₩": ["ko-KR"],
};

export function inferLocaleFromSymbol(symbol: string): string {
  const matchingLocales: string[] = [];

  for (const locale of locales) {
    const currency = getCurrency(locale);
    if (!currency) continue;

    const foundSymbol = getSymbolFromCurrency(currency);
    if (foundSymbol === symbol) {
      matchingLocales.push(locale);
    }
  }

  const preferred = symbolPreferredLocales[symbol];
  if (preferred) {
    const found = preferred.find(p => matchingLocales.includes(p));
    if (found) return found;
  }

  return matchingLocales[0] || "en-GB";
}