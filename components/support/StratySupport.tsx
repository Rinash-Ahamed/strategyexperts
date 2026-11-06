"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitEnquiry } from "@/lib/submit-enquiry";
import styles from "./StratySupport.module.css";

type Props = { email: string; services: { name: string }[] };

function revealInPanel(panel: HTMLElement | null, target: HTMLElement | null) {
  if (!panel || !target) return;
  const bounds = panel.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const delta = rect.top < bounds.top + 16 ? rect.top - bounds.top - 16 : Math.max(0, rect.bottom - bounds.bottom + 16);
  if (!delta) return;
  panel.scrollTo({ top: panel.scrollTop + delta, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

export default function StratySupport({ email, services }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [service, setService] = useState("");
  const [choosing, setChoosing] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const sending = useRef(false);
  const needs = useRef<HTMLTextAreaElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const sendButton = useRef<HTMLButtonElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const compact = Boolean(service) && !choosing;

  function updateConsent(checked: boolean) {
    setConsent(checked);
    if (!checked) return;
    requestAnimationFrame(() => revealInPanel(content.current, sendButton.current));
  }

  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    const frame = requestAnimationFrame(() => {
      revealInPanel(content.current, feedback.current);
      if (dialog.current?.open) feedback.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [status]);

  function chooseService(name: string) {
    setService(name);
    setChoosing(false);
    requestAnimationFrame(() => {
      content.current?.scrollTo({ top: 0 });
      needs.current?.focus({ preventScroll: true });
    });
  }

  function changeService() {
    setChoosing(true);
    requestAnimationFrame(() => {
      content.current?.scrollTo({ top: 0 });
      dialog.current?.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.focus({ preventScroll: true });
    });
  }

  async function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || !service || choosing || sending.current) return;
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    sending.current = true;
    setStatus("sending");
    try {
      await submitEnquiry({ name: value("name"), email: value("email"), business: value("business"), service, message: value("needs"), website: value("website"), consent, source: "straty" });
      setStatus("sent");
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Sending timed out. Please contact us directly before retrying.");
      setStatus("error");
    } finally { sending.current = false; }
  }

  return (
    <>
      <button type="button" className={styles.launcher} aria-haspopup="dialog" aria-controls="straty-support" onClick={() => dialog.current?.showModal()}>
        <Image src="/straty-chat.webp" width={64} height={64} alt="" unoptimized />
        <span>Ask Straty<span className={styles.launcherNote}>Let’s talk growth</span></span>
      </button>
      <dialog ref={dialog} id="straty-support" className={`${styles.dialog}${compact ? ` ${styles.compact}` : ""}`} aria-labelledby="straty-title" aria-describedby={compact ? "straty-selection" : "straty-intro"} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
        <div className={styles.sheet}>
          <header className={styles.header}>
            <Image src="/straty-chat.webp" width={64} height={64} alt="" unoptimized />
            <div><h2 id="straty-title">Meet Straty</h2><p>Your business support buddy</p></div>
            <button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close Straty support">×</button>
          </header>
          {compact && <div className={styles.selection}>
            <p id="straty-selection"><span>Selected service</span>{service}</p>
            <button type="button" onClick={changeService} disabled={status === "sending"}>Change</button>
          </div>}
          <div className={styles.content} ref={content}>
            <p id="straty-intro" className={styles.greeting} hidden={compact}>Hi, I’m Straty. New here? Tell me what your business needs, and I’ll help you put together an enquiry for our team.</p>
            <form onSubmit={sendEmail} className={styles.form} onChange={() => { if (!sending.current) setStatus("idle"); }} aria-busy={status === "sending"}>
              <div className={styles.honeypot} aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <fieldset className={styles.services} hidden={compact}>
                <legend>What can we help you with?</legend>
                {[...services.map((item) => item.name), "Help me choose"].map((name) => (
                  <label key={name} className={styles.choice}>
                    <input type="radio" name="service" value={name} checked={service === name} onChange={() => chooseService(name)} onClick={() => { if (service === name && choosing) chooseService(name); }} required disabled={status === "sending"} />
                    <span>{name}</span>
                  </label>
                ))}
              </fieldset>
              {service && <div className={styles.details} hidden={choosing}>
                <label>What would you like to improve?<textarea ref={needs} name="needs" required minLength={10} maxLength={1500} rows={3} placeholder="Tell us about your business, challenges and goals." /></label>
                <div className={styles.row}>
                  <label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label>
                  <label>Business name<input name="business" autoComplete="organization" maxLength={120} placeholder="Optional" /></label>
                </div>
                <label>Your email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
                <label className={styles.consent}><input type="checkbox" checked={consent} onChange={(event) => updateConsent(event.target.checked)} required /><span>I agree to be contacted by Strategy Experts about this enquiry.</span></label>
                <button ref={sendButton} type="submit" className={styles.send} disabled={!consent || status === "sending" || status === "sent"}>{status === "sending" ? "Sending…" : status === "sent" ? "Enquiry sent" : "Send enquiry"} <span aria-hidden="true">→</span></button>
              </div>}
              {status === "sent" && <p ref={feedback} tabIndex={-1} role="status" className={styles.status}>Thanks! Your enquiry has been sent to Strategy Experts. Our team will contact you using the email you provided.</p>}
              {status === "error" && <p ref={feedback} tabIndex={-1} role="alert" className={styles.status}>{error} You can also <a href={`mailto:${email}`}>email our team directly</a>.</p>}
            </form>
            <a href="/contact" className={styles.contact}>Prefer to contact the team directly? →</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
