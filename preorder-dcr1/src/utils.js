export const formatNumber = (n, fractionDigits = 0) =>
  n.toLocaleString(n, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: true,
  })

export const formatDollars = n => '$' + formatNumber(n)

export const formatBTC = n => formatNumber(n, 3)
