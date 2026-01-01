export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatMiles(miles: number | string): string {
  const m = typeof miles === "string" ? parseFloat(miles) : miles;
  return m.toFixed(1);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}
