/** Başvuru CRM durumları (sıralı pipeline). */
export const APPLICATION_STATUSES = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "İletişime geçildi" },
  { value: "quoted", label: "Fiyat verildi" },
  { value: "quote_accepted", label: "Fiyat kabul edildi" },
  { value: "sample_received", label: "Numune teslim alındı" },
  { value: "payment_received", label: "Ödeme alındı" },
  { value: "sample_in_transit", label: "Numune navlungoda" },
  { value: "sample_at_fcc", label: "Numune FCC'de" },
  { value: "results_ready", label: "Sonuç çıktı" },
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
