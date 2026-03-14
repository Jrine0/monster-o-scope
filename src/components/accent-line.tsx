/* ── Static accent line ── */
export default function AccentLine() {
  return (
    <div
      className="h-px mt-2 w-16"
      style={{
        background: "linear-gradient(to right, orange, transparent)",
      }}
    />
  );
}