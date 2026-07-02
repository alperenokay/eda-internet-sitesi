import { useCallback, useEffect, useState } from "react";
import HoneypotField from "@/components/form/HoneypotField";
import { FormError, FormSuccess } from "@/components/form/FormStatus";
import { inputClass, submitButtonClass } from "@/components/form/formStyles";
import { requireEmail, requireName, requireConsent } from "@/components/form/validateClient";
import { useFormSubmit } from "@/components/form/useFormSubmit";
import KvkkConsent from "@/components/form/KvkkConsent";

export interface AnalysisFormProps {
  analyses: { slug: string; title: string }[];
  initialSlug?: string;
}

export default function AnalysisForm({ analyses, initialSlug = "" }: AnalysisFormProps) {
  const validInitial =
    initialSlug && analyses.some((a) => a.slug === initialSlug) ? initialSlug : "";

  const [analysisSlug, setAnalysisSlug] = useState(validInitial);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("analiz");
    if (slug && analyses.some((a) => a.slug === slug)) {
      setAnalysisSlug(slug);
    }
  }, [analyses]);

  const validate = useCallback(() => {
    const nameErr = requireName(fullName);
    if (nameErr) return nameErr;
    const emailErr = requireEmail(email);
    if (emailErr) return emailErr;
    return requireConsent(kvkkConsent);
  }, [fullName, email, kvkkConsent]);

  const buildPayload = useCallback(
    () => ({
      analysis_slug: analysisSlug || null,
      full_name: fullName.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
      material_type: materialType.trim() || undefined,
      message: message.trim() || undefined,
      website: website.trim() || undefined,
      kvkk_consent: kvkkConsent,
    }),
    [analysisSlug, fullName, email, company, phone, materialType, message, website, kvkkConsent]
  );

  const { status, error, successMessage, submit, isSubmitting, isSuccess } = useFormSubmit({
    endpoint: "/api/basvuru-analiz",
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
        <label htmlFor="analysis_slug" className="mb-1 block text-sm font-medium text-text">
          Analiz
        </label>
        <select
          id="analysis_slug"
          name="analysis_slug"
          className={inputClass}
          value={analysisSlug}
          onChange={(e) => setAnalysisSlug(e.target.value)}
        >
          <option value="">Genel / emin değilim</option>
          {analyses.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-text">
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
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">
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
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-text">
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
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-text">
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
        <label htmlFor="material_type" className="mb-1 block text-sm font-medium text-text">
          Ambalaj / malzeme tipi
        </label>
        <input
          type="text"
          id="material_type"
          name="material_type"
          className={inputClass}
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-text">
          Eklemek istedikleriniz
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
        {isSubmitting ? "Gönderiliyor..." : "Analiz başvurusu gönder"}
      </button>
    </form>
  );
}
