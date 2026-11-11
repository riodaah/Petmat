import config from '../config.json';

// La temporada se apaga sola después de `end` (ver src/config.json → season.christmas).
const xmas = config.season?.christmas;

const atNoon = (isoDate) => new Date(`${isoDate}T12:00:00`);

export function isChristmasSeason(now = new Date()) {
  if (!xmas?.enabled) return false;
  const start = new Date(`${xmas.start}T00:00:00`);
  const end = new Date(`${xmas.end}T23:59:59`);
  return now >= start && now <= end;
}

const formatDayMonth = (isoDate) =>
  atNoon(isoDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });

/**
 * Fechas límite para recibir antes de Navidad. Devuelve null cuando la
 * temporada no está activa o cuando ambas fechas ya pasaron.
 */
export function getChristmasDeadlines(now = new Date()) {
  if (!isChristmasSeason(now)) return null;
  const stillOpen = (isoDate) => isoDate && now <= new Date(`${isoDate}T23:59:59`);
  const rm = stillOpen(xmas.lastOrderDateRM) ? formatDayMonth(xmas.lastOrderDateRM) : null;
  const regions = stillOpen(xmas.lastOrderDateRegions) ? formatDayMonth(xmas.lastOrderDateRegions) : null;
  if (!rm && !regions) return null;
  return { rm, regions };
}
