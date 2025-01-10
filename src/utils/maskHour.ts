export function maskHour(hour: string) {
  console.log(hour);
  if (hour.length > 5) return hour;
  if (!hour) return hour;

  let clearedHour = hour?.replace(/\D/g, '');

  if (clearedHour?.length > 2) {
    clearedHour = clearedHour.substring(0, 2) + ':' + clearedHour.substring(2, 4);
  }

  return clearedHour;
}