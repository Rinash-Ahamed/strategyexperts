export async function submitEnquiry(data: Record<string, unknown>) {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(40000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "We couldn't send your enquiry. Please try again or contact us directly.");
}
