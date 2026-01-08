/**
 * Formatea números de forma consistente entre servidor y cliente
 * Evita errores de hidratación usando locale fijo
 *
 * @param value - Número a formatear
 * @param options - Opciones de formato (mismo que Intl.NumberFormat)
 * @returns String formateado
 *
 * @example
 * formatNumber(4682) // "4,682"
 * formatNumber(1234.56, { minimumFractionDigits: 2 }) // "1,234.56"
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", options).format(value)
}

/**
 * Formatea porcentajes de forma consistente
 *
 * @param value - Porcentaje a formatear (ej: 12.5 para 12.5%)
 * @param options - Opciones adicionales
 * @returns String formateado con símbolo %
 *
 * @example
 * formatPercentage(12.5) // "12.5%"
 */
export function formatPercentage(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return formatNumber(value, {
    ...options,
    style: "decimal",
    minimumFractionDigits: options?.minimumFractionDigits ?? 1,
    maximumFractionDigits: options?.maximumFractionDigits ?? 1,
  }) + "%"
}

/**
 * Formatea moneda de forma consistente
 *
 * @param value - Monto a formatear
 * @param currency - Código de moneda (default: "USD")
 * @returns String formateado con símbolo de moneda
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, "EUR") // "€1,234.56"
 */
export function formatCurrency(
  value: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value)
}
