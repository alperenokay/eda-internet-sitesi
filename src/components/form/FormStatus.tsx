import { successBoxClass, errorTextClass } from "./formStyles";
import type { FormStatus } from "./useFormSubmit";

interface FormStatusProps {
  status: FormStatus;
  error?: string;
  successMessage: string;
}

export function FormSuccess({ message }: { message: string }) {
  return (
    <div className={successBoxClass} role="status">
      {message}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p className={errorTextClass} role="alert" aria-live="polite">
      {message}
    </p>
  );
}

export default function FormStatus({ status, error, successMessage }: FormStatusProps) {
  if (status === "success") {
    return <FormSuccess message={successMessage} />;
  }
  if (status === "error" && error) {
    return <FormError message={error} />;
  }
  return null;
}
