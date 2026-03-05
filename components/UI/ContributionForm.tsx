"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DeepTimeZone } from "@/lib/deepTime";

type ContributionType =
  | "memory"
  | "photograph"
  | "oral_tradition"
  | "family_history"
  | "folk_tale"
  | "academic"
  | "other";

type ContributionFormData = {
  title: string;
  content: string;
  type: ContributionType;
  epochZone: DeepTimeZone;
  placeName: string;
  lat: string;
  lng: string;
  contributorName: string;
  affiliation: string;
  isAnonymous: boolean;
  consent: boolean;
};

const INITIAL_FORM: ContributionFormData = {
  title: "",
  content: "",
  type: "memory",
  epochZone: "UNFINISHED SOVEREIGN",
  placeName: "",
  lat: "",
  lng: "",
  contributorName: "",
  affiliation: "",
  isAnonymous: false,
  consent: false,
};

const CONTRIBUTION_TYPES: { value: ContributionType; label: string; description: string }[] = [
  {
    value: "memory",
    label: "Memory",
    description: "A personal or family memory tied to a place in Zambia",
  },
  {
    value: "oral_tradition",
    label: "Oral Tradition",
    description: "A story passed down through generations",
  },
  {
    value: "family_history",
    label: "Family History",
    description: "Documented family history with a Zambian connection",
  },
  {
    value: "folk_tale",
    label: "Folk Tale",
    description: "A legend, myth, or folk story from a Zambian tradition",
  },
  {
    value: "photograph",
    label: "Photograph",
    description: "A historical photograph with a Zambian connection",
  },
  {
    value: "academic",
    label: "Academic",
    description: "A researched historical claim with sources",
  },
  {
    value: "other",
    label: "Other",
    description: "Any other contribution to Zambia's living archive",
  },
];

const EPOCH_ZONES: { value: DeepTimeZone; label: string }[] = [
  { value: "ZAMBIA DEEP", label: "Zambia Deep (476K+ BC)" },
  { value: "COPPER EMPIRE", label: "Copper Empire (1000–1600)" },
  { value: "KINGDOM AGE", label: "Kingdom Age (1600–1890)" },
  { value: "COLONIAL WOUND", label: "Colonial Wound (1890–1964)" },
  { value: "UNFINISHED SOVEREIGN", label: "Unfinished Sovereign (1964–Present)" },
];

const STORAGE_KEY = "zambia-untold:community-submissions";

type ContributionFormProps = {
  onClose: () => void;
};

export function ContributionForm({ onClose }: ContributionFormProps) {
  const [form, setForm] = useState<ContributionFormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = <K extends keyof ContributionFormData>(key: K, value: ContributionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors([]);
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push("Title is required");
    if (form.title.length > 80) errs.push("Title must be under 80 characters");
    if (!form.content.trim()) errs.push("Content is required");
    if (form.content.length > 2000) errs.push("Content must be under 2,000 characters");
    if (!form.contributorName.trim() && !form.isAnonymous)
      errs.push("Name is required (or check 'Submit anonymously')");
    if (!form.consent) errs.push("You must consent to display under Creative Commons Attribution");
    return errs;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save to localStorage (Phase C will connect to Supabase)
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
      existing.push({
        ...form,
        id: `community-${Date.now()}`,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Silently fail on localStorage errors
    }

    setSubmitted(true);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: "5%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "5%", transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-hidden rounded border border-copper/35 bg-panel/98 backdrop-blur-xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-copper/20 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-copperSoft">
                Isibalo · The Living Archive
              </p>
              <h2 className="font-display text-lg text-text mt-1">
                Add Your Memory to Zambia Untold
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-copper/40 px-2 py-1 text-xs uppercase tracking-[0.16em] text-text hover:border-copper transition-colors"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-muted leading-relaxed mt-2">
            Your family stories, photographs, and oral traditions belong in the Living Archive.
            Every contribution is reviewed by our team before it appears on the globe.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-copper/50 flex items-center justify-center mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B87333"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-text mb-2">Thank You</h3>
              <p className="text-[13px] text-[#B8A58F] leading-relaxed max-w-[360px]">
                Your contribution will be reviewed within 7 days. Once approved, it will appear on
                the globe as a community pin.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded border border-copper/40 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-copperSoft hover:border-copper transition-colors"
              >
                Return to Museum
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto contribution-scroll px-6 py-5 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  Title <span className="text-copper/60">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  maxLength={80}
                  placeholder="e.g., My grandmother's memory of Independence Day"
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[13px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors"
                />
                <p className="text-[9px] text-muted mt-1">{form.title.length}/80 characters</p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  Type <span className="text-copper/60">*</span>
                </label>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {CONTRIBUTION_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("type", value)}
                      className={`rounded border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                        form.type === value
                          ? "border-copper/50 bg-copper/15 text-copper"
                          : "border-copper/15 text-muted hover:border-copper/30 hover:text-copperSoft"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Epoch Zone */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  When (approximate era) <span className="text-copper/60">*</span>
                </label>
                <select
                  value={form.epochZone}
                  onChange={(e) => update("epochZone", e.target.value as DeepTimeZone)}
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[12px] text-text focus:border-copper/50 focus:outline-none transition-colors"
                >
                  {EPOCH_ZONES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  Where (place name or coordinates)
                </label>
                <input
                  type="text"
                  value={form.placeName}
                  onChange={(e) => update("placeName", e.target.value)}
                  placeholder="e.g., Lusaka, Kabwe, Kasama"
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[13px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  Your Story <span className="text-copper/60">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  maxLength={2000}
                  rows={6}
                  placeholder="Share your memory, family story, or oral tradition. Write naturally — this is a living archive, not a textbook."
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[13px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors resize-none"
                />
                <p className="text-[9px] text-muted mt-1">{form.content.length}/2,000 characters</p>
              </div>

              {/* Contributor */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-1.5">
                  Your Name <span className="text-copper/60">*</span>
                </label>
                <input
                  type="text"
                  value={form.contributorName}
                  onChange={(e) => update("contributorName", e.target.value)}
                  disabled={form.isAnonymous}
                  placeholder="How you'd like to be credited"
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[13px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors disabled:opacity-50"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={(e) => update("isAnonymous", e.target.checked)}
                    className="rounded border-copper/40 bg-bg text-copper"
                  />
                  <span className="text-[11px] text-muted">Submit anonymously</span>
                </label>
                <input
                  type="text"
                  value={form.affiliation}
                  onChange={(e) => update("affiliation", e.target.value)}
                  placeholder="Affiliation (optional — e.g., university, community group)"
                  className="w-full rounded border border-copper/25 bg-bg/60 px-3 py-2 text-[12px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Consent */}
              <div className="rounded border border-copper/20 bg-copper/5 px-4 py-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-0.5 rounded border-copper/40 bg-bg text-copper"
                  />
                  <span className="text-[11px] text-[#C9B89A] leading-relaxed">
                    I confirm this submission is my own knowledge or family oral tradition and I
                    consent to it being displayed on ZAMBIA UNTOLD under Creative Commons
                    Attribution.
                  </span>
                </label>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="rounded border border-[#ad3f31]/40 bg-[#2c110f]/80 px-3 py-2">
                  {errors.map((err, i) => (
                    <p key={i} className="text-[11px] text-[#efb5ad]">
                      {err}
                    </p>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded border border-copper/50 bg-copper/15 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-copper hover:bg-copper/25 transition-colors font-display"
              >
                Submit for Review
              </button>

              <p className="text-[9px] text-muted/60 text-center">
                Reviewed within 7 days · Displayed under Creative Commons Attribution
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  );
}
