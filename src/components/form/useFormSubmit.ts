import { useCallback, useState, type FormEvent } from "react";

export type FormStatus = "idle" | "submitting" | "success" | "error";

interface ApiResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

interface UseFormSubmitOptions<T> {
  endpoint: string;
  validate: () => string | null;
  buildPayload: () => T;
  honeypotValue: string;
  successMessage: string;
  fallbackError?: string;
}

export function useFormSubmit<T extends Record<string, unknown>>({
  endpoint,
  validate,
  buildPayload,
  honeypotValue,
  successMessage,
  fallbackError = "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin.",
}: UseFormSubmitOptions<T>) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (honeypotValue) {
        setStatus("success");
        return;
      }

      const validationError = validate();
      if (validationError) {
        setError(validationError);
        setStatus("error");
        return;
      }

      setStatus("submitting");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });

        const data = (await res.json()) as ApiResponse;

        if (data.ok) {
          setStatus("success");
          return;
        }

        setError(data.error || fallbackError);
        setStatus("error");
      } catch {
        setError("Bağlantı sorunu oluştu. Lütfen tekrar deneyin.");
        setStatus("error");
      }
    },
    [honeypotValue, validate, buildPayload, endpoint, fallbackError]
  );

  return {
    status,
    error,
    successMessage,
    submit,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
  };
}
