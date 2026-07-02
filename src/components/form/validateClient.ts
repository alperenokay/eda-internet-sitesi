export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function requireName(name: string): string | null {
  if (!name.trim()) return "Lütfen ad soyad girin.";
  return null;
}

export function requireEmail(email: string): string | null {
  if (!isValidEmail(email.trim())) return "Geçerli bir e-posta adresi girin.";
  return null;
}

export function requireMessage(message: string): string | null {
  if (!message.trim()) return "Lütfen mesajınızı yazın.";
  return null;
}

export function requireConsent(accepted: boolean): string | null {
  if (!accepted) return "Devam etmek için aydınlatma metnini okuyup onay vermeniz gerekiyor.";
  return null;
}
