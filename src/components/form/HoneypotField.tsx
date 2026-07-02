interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
      aria-hidden="true"
    >
      <label htmlFor="website">Web sitesi</label>
      <input
        type="text"
        id="website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
