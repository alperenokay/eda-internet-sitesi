import { useCallback, useState } from "react";
import HoneypotField from "@/components/form/HoneypotField";
import { FormError, FormSuccess } from "@/components/form/FormStatus";
import { inputClass, submitButtonClass } from "@/components/form/formStyles";
import { requireEmail, requireMessage, requireName, requireConsent } from "@/components/form/validateClient";
import { useFormSubmit } from "@/components/form/useFormSubmit";
import KvkkConsent from "@/components/form/KvkkConsent";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);

  const validate = useCallback(() => {
    const nameErr = requireName(fullName);
    if (nameErr) return nameErr;
    const emailErr = requireEmail(email);
    if (emailErr) return emailErr;
    const messageErr = requireMessage(message);
    if (messageErr) return messageErr;
    return requireConsent(kvkkConsent);
  }, [fullName, email, message, kvkkConsent]);

  const buildPayload = useCallback(
    () => ({
      full_name: fullName.trim(),
      email: email.trim(),
      subject: subject.trim() || undefined,
      message: message.trim(),
      website: website.trim() || undefined,
      kvkk_consent: kvkkConsent,
    }),
    [fullName, email, subject, message, website, kvkkConsent]
  );

  const { status, error, successMessage, submit, isSubmitting, isSuccess } = useFormSubmit({
    endpoint: "/api/iletisim",
    validate,
    buildPayload,
    honeypotValue: website,
    successMessage: "Mesajınız iletildi. Teşekkürler.",
  });

  if (isSuccess) {
    return <FormSuccess message={successMessage} />;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <HoneypotField value={website} onChange={setWebsite} />

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

      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-ink">
          Konu
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className={inputClass}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
          Mesaj <span className="text-signal">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {status === "error" && error && <FormError message={error} />}

      <KvkkConsent checked={kvkkConsent} onChange={setKvkkConsent} />

      <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
        {isSubmitting ? "Gönderiliyor..." : "Mesajı gönder"}
      </button>
    </form>
  );
}
