/** İletişim mesajı CRM durumları. */
export const APPLICATION_STATUSES = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "İletişime geçildi" },
  { value: "appointment_set", label: "Randevu verildi" },
  { value: "in_progress", label: "Dosya takibi" },
  { value: "closed", label: "Kapatıldı" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

const STATUS_SET = new Set<string>(APPLICATION_STATUSES.map((s) => s.value));

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return STATUS_SET.has(value);
}

export function applicationStatusLabel(status: string): string {
  return APPLICATION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function applicationStatusIndex(status: string): number {
  return APPLICATION_STATUSES.findIndex((s) => s.value === status);
}
