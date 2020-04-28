export function formatTime(time?: number) {
  time = time ?? 0;
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  try {
    const minFormatter = new Intl.NumberFormat(undefined, {
      style: 'unit',
      unit: 'minute',
      unitDisplay: "long"
    });

    const hourFormatter = new Intl.NumberFormat(undefined, {
      style: 'unit',
      unit: 'hour',
      unitDisplay: "long"
    });

    return `${hourFormatter.format(hours)} and ${minFormatter.format(minutes)}`
  }
  catch {
    return `${time} hours`;
  }
}
