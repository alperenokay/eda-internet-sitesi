export function getDaysUntilMainDeadline(): number {
  const deadline = new Date("2026-08-12T00:00:00+03:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const msLeft = deadline.getTime() - today.getTime();
  return msLeft > 0 ? Math.ceil(msLeft / (1000 * 60 * 60 * 24)) : 0;
}
