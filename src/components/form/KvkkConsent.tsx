interface KvkkConsentProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function KvkkConsent({ checked, onChange }: KvkkConsentProps) {
  return (
    <div className="flex gap-3 items-start">
      <input
        type="checkbox"
        id="kvkk_consent"
        name="kvkk_consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-1 h-4 w-4 shrink-0 rounded border-line text-green focus:ring-green"
      />
      <label htmlFor="kvkk_consent" className="text-sm text-muted leading-snug">
        Kişisel Verilerin Korunması{" "}
        <a
          href="/kvkk"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-green-deep underline-offset-2 hover:text-green hover:underline"
        >
          Aydınlatma Metnini
        </a>{" "}
        okudum. Başvurum kapsamında kişisel verilerimin belirtilen amaçlarla işlenmesine onay
        veriyorum. <span className="text-signal">*</span>
      </label>
    </div>
  );
}
