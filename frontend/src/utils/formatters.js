export function formatNumber(value, maximumFractionDigits = 0) {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
}

export function formatCountdown(msRemaining) {
  if (!msRemaining || msRemaining <= 0) {
    return '00:00:00';
  }

  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
