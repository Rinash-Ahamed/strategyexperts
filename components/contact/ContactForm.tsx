"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitEnquiry } from "@/lib/submit-enquiry";
import styles from "./ContactForm.module.css";

type Props = { whatsapp: string; email: string; services: { slug: string; name: string }[] };

export default function ContactForm({ whatsapp, email, services }: Props) {
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  // Keep the complete form in the static HTML. Reading this optional query on
  // mount avoids useSearchParams' client-rendering fallback and layout shift.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("service");
    const service = services.find((s) => s.slug === slug);
    if (serviceRef.current && service) serviceRef.current.value = service.name;
    const plan = params.get("plan");
    if (plan && ["starter", "pro", "custom"].includes(plan) && messageRef.current && !messageRef.current.value) {
      const name = plan.charAt(0).toUpperCase() + plan.slice(1);
      messageRef.current.value = `I'm interested in the ${name} plan. Please help me get started.`;
    }
  }, [services]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "opened" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState("");
  const sendingRef = useRef(false);
  const [consented, setConsented] = useState(false);
  const configured = Boolean(whatsapp || email);

  const compose = (fd: FormData) => {
    const get = (k: string) => String(fd.get(k) || "").trim();
    return [
      "Hello Strategy Experts,",
      "",
      `Name: ${get("name")}`,
      get("email") ? `Reply email: ${get("email")}` : "",
      get("business") ? `Business: ${get("business")}` : "",
      get("service") ? `Service of interest: ${get("service")}` : "",
      "",
      get("message"),
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n");
  };

  const validate = (fd: FormData, form: HTMLFormElement, requireEmail: boolean) => {
    const e: Record<string, string> = {};
    if (!String(fd.get("name") || "").trim()) e.name = "Please enter your name.";
    if (requireEmail && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(fd.get("email") || "").trim())) e.email = "Please enter a valid email address.";
    if (String(fd.get("message") || "").trim().length < 10)
      e.message = "Please tell us a little about your business and goals.";
    setErrors(e);
    const invalid = form.elements.namedItem(Object.keys(e)[0] ?? "");
    if (invalid instanceof HTMLElement) invalid.focus();
    return Object.keys(e).length === 0;
  };

  const send = (channel: "whatsapp" | "email") => async (ev: FormEvent<HTMLButtonElement>) => {
    const form = ev.currentTarget.form;
    if (!form || !consented || sendingRef.current) return;
    const fd = new FormData(form);
    if (!validate(fd, form, channel === "email")) return;
    const text = compose(fd);
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      setStatus("opened");
    } else {
      sendingRef.current = true;
      setStatus("sending");
      try {
        await submitEnquiry({ name: fd.get("name"), email: fd.get("email"), business: fd.get("business"), service: fd.get("service"), message: fd.get("message"), website: fd.get("website"), consent: consented, source: "contact" });
        setStatus("sent");
      } catch (cause) {
        setSendError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Sending timed out. Please contact us directly before retrying.");
        setStatus("error");
      } finally { sendingRef.current = false; }
    }
  };

  return (
    <form className="form" noValidate onSubmit={(e) => e.preventDefault()} aria-busy={status === "sending"} onChange={() => { if (!sendingRef.current) setStatus("idle"); }} aria-describedby={status === "opened" ? "form-note" : undefined}>
      <div className={styles.honeypot} aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
          {errors.name && <span className="err" id="err-name" role="alert">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="business">Business name</label>
          <input id="business" name="business" autoComplete="organization" maxLength={120} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-email">Your email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} />
        {errors.email && <span className="err" id="err-email" role="alert">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="service">What would you like to discuss?</label>
        <select id="service" name="service" ref={serviceRef} defaultValue="">
          <option value="">Not sure yet</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Where is your business today?</label>
        <textarea ref={messageRef} id="message" name="message" required maxLength={3000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} placeholder="Tell us about your business, the platforms you sell on and what you’d like to improve." />
        {errors.message && <span className="err" id="err-message" role="alert">{errors.message}</span>}
      </div>

      {configured ? (
        <>
        <label className={styles.consent}>
          <input type="checkbox" name="consent" required checked={consented} onChange={event => setConsented(event.target.checked)} />
          <span>I agree to be contacted by Strategy Experts about my enquiry.</span>
        </label>
        <div className={styles.actions}>
          {whatsapp && (
            <button type="button" className="btn btn-primary" onClick={send("whatsapp")} disabled={!consented || status === "sending"}>
              Send on WhatsApp <span className="arr" aria-hidden="true">→</span>
            </button>
          )}
          {email && (
            <button type="button" className={`btn ${whatsapp ? "btn-ghost" : "btn-primary"}`} onClick={send("email")} disabled={!consented || status === "sending" || status === "sent"}>
              {status === "sending" ? "Sending…" : status === "sent" ? "Enquiry sent" : "Send by email"} <span className="arr" aria-hidden="true">→</span>
            </button>
          )}
        </div>
        </>
      ) : (
        <div className="notice warn" role="status">
          <b>Contact channel not configured yet.</b> Add a WhatsApp number or email address in the site configuration to enable sending.
        </div>
      )}

      {status === "opened" && (
        <p id="form-note" className="note" role="status">
          Your message is ready in the app you chose. Press send there to complete it.
        </p>
      )}
      {status === "sent" && <p className="note" role="status">Thanks! Your enquiry has been sent to Strategy Experts. We&apos;ll reply to the email you provided.</p>}
      {status === "error" && <p className="note" role="alert">{sendError} <a href={`mailto:${email}`}>Email us directly</a>.</p>}
    </form>
  );
}
