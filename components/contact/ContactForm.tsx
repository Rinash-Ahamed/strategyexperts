"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { SERVICES } from "@/lib/site";

type Props = { whatsapp: string; email: string };

export default function ContactForm({ whatsapp, email }: Props) {
  const params = useSearchParams();
  const defaultService = SERVICES.find((s) => s.slug === params.get("service"))?.name ?? "";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "opened">("idle");
  const configured = Boolean(whatsapp || email);

  const compose = (fd: FormData) => {
    const get = (k: string) => String(fd.get(k) || "").trim();
    return [
      "Hello Strategy Experts,",
      "",
      `Name: ${get("name")}`,
      get("business") ? `Business: ${get("business")}` : "",
      get("service") ? `Service of interest: ${get("service")}` : "",
      "",
      get("message"),
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n");
  };

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    if (!String(fd.get("name") || "").trim()) e.name = "Please enter your name.";
    if (String(fd.get("message") || "").trim().length < 10)
      e.message = "Please tell us a little about your business and goals.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = (channel: "whatsapp" | "email") => (ev: FormEvent<HTMLButtonElement>) => {
    const form = ev.currentTarget.form;
    if (!form) return;
    const fd = new FormData(form);
    if (!validate(fd)) return;
    const text = compose(fd);
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent("Enquiry via website")}&body=${encodeURIComponent(text)}`;
    }
    setStatus("opened");
  };

  return (
    <form className="form" noValidate onSubmit={(e) => e.preventDefault()} aria-describedby="form-note">
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
          {errors.name && <span className="err" id="err-name" role="alert">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="business">Business name</label>
          <input id="business" name="business" autoComplete="organization" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="service">What would you like to discuss?</label>
        <select id="service" name="service" defaultValue={defaultService}>
          <option value="">Not sure yet</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Where is your business today?</label>
        <textarea id="message" name="message" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} placeholder="Tell us about your business, the platforms you sell on and what you’d like to improve." />
        {errors.message && <span className="err" id="err-message" role="alert">{errors.message}</span>}
      </div>

      {configured ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {whatsapp && (
            <button type="button" className="btn btn-primary" onClick={send("whatsapp")}>
              Send on WhatsApp <span className="arr" aria-hidden="true">→</span>
            </button>
          )}
          {email && (
            <button type="button" className={`btn ${whatsapp ? "btn-ghost" : "btn-primary"}`} onClick={send("email")}>
              Send by email <span className="arr" aria-hidden="true">→</span>
            </button>
          )}
        </div>
      ) : (
        <div className="notice warn" role="status">
          <b>Contact channel not configured yet.</b> Add a WhatsApp number or email address in the site configuration to enable sending.
        </div>
      )}

      <p id="form-note" className="note" aria-live="polite">
        {status === "opened"
          ? "Your message is ready in the app you chose. Press send there to complete it."
          : "Nothing is stored on this site. Your message opens in WhatsApp or your email app for you to review and send."}
      </p>
    </form>
  );
}
