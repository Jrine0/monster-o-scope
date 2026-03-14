import { motion } from "motion/react";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { fadeUpProps, ease, duration } from "@/lib/animation";
import { useUIStore } from "@/stores/useUIStore";

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${8 + i * 14}%`,
  delay: i * 0.8,
  duration: 7 + Math.random() * 3,
  size: 2 + Math.random() * 1.5,
}));

/* ── Shared input class with focus glow ── */
const INPUT_CLASS =
  "w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated py-2.5 pl-10 pr-4 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]";

const INPUT_CLASS_PR10 =
  "w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated py-2.5 pl-10 pr-10 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]";

const INPUT_CLASS_PLACEHOLDER =
  "w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated py-2.5 pl-10 pr-4 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]";

const INPUT_ERROR_CLASS =
  "w-full rounded-[var(--radius-md)] border border-red-500 bg-bg-elevated py-2.5 pl-10 pr-4 text-body-md text-text-primary outline-none transition-all focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.08)]";

const INPUT_ERROR_CLASS_PR10 =
  "w-full rounded-[var(--radius-md)] border border-red-500 bg-bg-elevated py-2.5 pl-10 pr-10 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.08)]";

const INPUT_ERROR_CLASS_PLACEHOLDER =
  "w-full rounded-[var(--radius-md)] border border-red-500 bg-bg-elevated py-2.5 pl-10 pr-4 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.08)]";

interface ProfileErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function TeacherProfile() {
  const [name, setName] = useState("Priya Sharma");
  const [email, setEmail] = useState("priya.sharma@dpsnoida.edu.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const addToast = useUIStore((s) => s.addToast);

  /* ── Profile validation ── */
  function handleSaveProfile() {
    const errors: ProfileErrors = {};

    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!phone.trim()) errors.phone = "Phone is required";

    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) {
      addToast("Please fill in all fields", "error");
      return;
    }

    addToast("Profile updated successfully", "success");
  }

  /* ── Password validation ── */
  function handleUpdatePassword() {
    const errors: PasswordErrors = {};

    if (!currentPassword) {
      errors.currentPassword = "Please enter your current password";
    }
    if (newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Show the first error as a toast
      const firstError = errors.currentPassword || errors.newPassword || errors.confirmPassword;
      if (firstError) addToast(firstError, "error");
      return;
    }

    addToast("Password updated successfully", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
  }

  return (
    <div className="relative space-y-8 max-w-2xl">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient blob */}
        <motion.div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-48 -left-32 h-[400px] w-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #f27410 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-orange-400"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: "-4px",
            }}
            animate={{
              y: [0, -700],
              opacity: [0, 0.5, 0.35, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Animated header accent line ── */}
      <motion.div
        className="h-px bg-gradient-to-r from-orange-500/60 via-orange-400/20 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "8rem", opacity: 1 }}
        transition={{ duration: duration.slow, delay: 0.15, ease: ease.gentle }}
      />

      {/* Profile card */}
      <motion.div
        {...fadeUpProps(16)}
        whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.06)" }}
        transition={{ duration: 0.25, ease: ease.gentle }}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6"
      >
        {/* Gradient glow overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.01]" />
        <div className="relative flex items-center gap-5">
          {/* Avatar with breathing animation */}
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-500/15"
          >
            <span className="font-display text-[28px] text-orange-400">PS</span>
          </motion.div>
          <div>
            <h1 className="text-display-sm text-text-primary">Priya Sharma</h1>
            <p className="mt-0.5 text-body-md text-text-secondary">priya.sharma@dpsnoida.edu.in</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-body-sm text-text-muted">
              <Building2 size={14} strokeWidth={1.5} />
              <span>Delhi Public School, Noida</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit profile */}
      <motion.div
        {...fadeUpProps(16, 0.1)}
        whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.06)" }}
        transition={{ duration: 0.25, ease: ease.gentle }}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6 space-y-6"
      >
        {/* Gradient glow overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.015] via-transparent to-transparent" />
        <h2 className="relative text-heading-2 text-text-primary">Edit Profile</h2>

        {/* Name */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (profileErrors.name) setProfileErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={profileErrors.name ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
          </div>
          {profileErrors.name && (
            <p className="text-body-sm text-red-500">{profileErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (profileErrors.email) setProfileErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={profileErrors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
          </div>
          {profileErrors.email && (
            <p className="text-body-sm text-red-500">{profileErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">Phone Number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (profileErrors.phone) setProfileErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={profileErrors.phone ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
          </div>
          {profileErrors.phone && (
            <p className="text-body-sm text-red-500">{profileErrors.phone}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveProfile}
          className="relative inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-orange-500 px-5 py-2.5 text-body-md font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange"
        >
          <Save size={18} strokeWidth={1.5} />
          Save Changes
        </motion.button>
      </motion.div>

      {/* Change password */}
      <motion.div
        {...fadeUpProps(16, 0.2)}
        whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.06)" }}
        transition={{ duration: 0.25, ease: ease.gentle }}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6 space-y-6"
      >
        {/* Gradient glow overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.015] via-transparent to-transparent" />
        <div className="relative flex items-center gap-2">
          {/* Rotating lock icon */}
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock size={18} strokeWidth={1.5} className="text-text-muted" />
          </motion.div>
          <h2 className="text-heading-2 text-text-primary">Change Password</h2>
        </div>

        {/* Current password */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">Current Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (passwordErrors.currentPassword) setPasswordErrors((prev) => ({ ...prev, currentPassword: undefined }));
              }}
              placeholder="Enter current password"
              className={passwordErrors.currentPassword ? INPUT_ERROR_CLASS_PR10 : INPUT_CLASS_PR10}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordErrors.currentPassword && (
            <p className="text-body-sm text-red-500">{passwordErrors.currentPassword}</p>
          )}
        </div>

        {/* New password */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              placeholder="Enter new password"
              className={passwordErrors.newPassword ? INPUT_ERROR_CLASS_PLACEHOLDER : INPUT_CLASS_PLACEHOLDER}
            />
          </div>
          {passwordErrors.newPassword && (
            <p className="text-body-sm text-red-500">{passwordErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="relative space-y-2">
          <label className="text-body-sm font-medium text-text-primary">Confirm New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Confirm new password"
              className={passwordErrors.confirmPassword ? INPUT_ERROR_CLASS_PLACEHOLDER : INPUT_CLASS_PLACEHOLDER}
            />
          </div>
          {passwordErrors.confirmPassword && (
            <p className="text-body-sm text-red-500">{passwordErrors.confirmPassword}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpdatePassword}
          className="relative inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-5 py-2.5 text-body-md font-medium text-text-primary transition-colors duration-200 hover:bg-bg-muted"
        >
          <Lock size={18} strokeWidth={1.5} />
          Update Password
        </motion.button>
      </motion.div>
    </div>
  );
}
