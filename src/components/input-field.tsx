import { motion } from "motion/react";
import { Input } from "./ui/input";

function InputField({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
  disabled = false,
  hasError = false,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  hasError?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <motion.span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.span>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex h-12 w-full rounded-md border bg-background pl-10 pr-4 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError
              ? "border-destructive focus-visible:ring-destructive/30"
              : "border-input focus-visible:border-orange-500"
          }`}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = hasError
              ? "0 0 24px rgba(239,68,68,0.15)"
              : "0 0 24px rgba(242,116,13,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}

export default InputField;