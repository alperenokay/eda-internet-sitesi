import { useCallback, useState } from "react";
import HoneypotField from "@/components/form/HoneypotField";
import { FormError, FormSuccess } from "@/components/form/FormStatus";
import { inputClass, submitButtonClass } from "@/components/form/formStyles";
import { requireEmail, requireName, requireConsent } from "@/components/form/validateClient";
import { useFormSubmit } from "@/components/form/useFormSubmit";
import KvkkConsent from "@/components/form/KvkkConsent";

const TOPICS = [
  { value: "", label: "Genel / emin değilim" },
  { value: "PPWR uyumu", label: "PPWR uyumu" },
  { value: "CSRD raporlama", label: "CSRD raporlama" },
  { value: "Green Claims", label: "Green Claims" },
  { value: "CBAM", label: "CBAM" },
] as const;

export default function ConsultancyForm() {
  const [topic, setTopic] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);

  const validate = useCallback(() => {
    const nameErr = requireName(fullName);
    if (nameErr) return nameErr;
    const emailErr = requireEmail(email);
    if (emailErr) return emailErr;
    return requireConsent(kvkkConsent);
  }, [fullName, email, kvkkConsent]);

  const buildPayload = useCallback(
    () => ({
      topic: topic || undefined,
      full_name: fullName.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
      message: message.trim() || undefined,
      website: website.trim() || undefined,
      kvkk_consent: kvkkConsent,
    }),
    [topic, fullName, email, company, phone, message, website, kvkkConsent]
  );

  const { status, error, successMessage, submit, isSubmitting, isSuccess } = useFormSubmit({
    endpoint: "/api/basvuru-danismanlik",
    validate,
    buildPayload,
    honeypotValue: website,
    successMessage: "Başvurunuz alındı. En kısa sürede dönüş yapacağız.",
  });

  if (isSuccess) {
    return <FormSuccess message={successMessage} />;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <HoneypotField value={website} onChange={setWebsite} />

      <div>
        <label htmlFor="topic" className="mb-1 block text-sm font-medium text-ink">
          Konu
        </label>
        <select
          id="topic"
          name="topic"
          className={inputClass}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          {TOPICS.map((item) => (
            <option key={item.value || "genel"} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-ink">
          Ad soyad <span className="text-signal">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          autoComplete="name"
          className={inputClass}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
          E-posta <span className="text-signal">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-ink">
            Firma
          </label>
          <input
            type="text"
            id="company"
            name="company"
            autoComplete="organization"
            className={inputClass}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
          Kısaca ihtiyacınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {status === "error" && error && <FormError message={error} />}

      <KvkkConsent checked={kvkkConsent} onChange={setKvkkConsent} />

      <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
        {isSubmitting ? "Gönderiliyor..." : "Danışmanlık başvurusu gönder"}
      </button>
    </form>
  );
}
