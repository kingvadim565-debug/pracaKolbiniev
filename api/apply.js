// Vercel Serverless Function: POST /api/apply
// Wysyła e-mail z potwierdzeniem przez Brevo (darmowy plan: 300 maili/dzień).

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function sendBrevo(payload) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Brevo error:", res.status, text);
    throw new Error("Brevo " + res.status);
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metoda niedozwolona." });
  }

  const { firstName, lastName, email, about, job, website } = req.body || {};

  // Honeypot – boty wypełniają ukryte pole
  if (website) return res.status(200).json({ ok: true });

  // Walidacja
  const emailOk = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
  if (!firstName || !lastName || !emailOk || !about || about.length < 10 || !job) {
    return res.status(400).json({ error: "Nieprawidłowe dane formularza." });
  }
  if (firstName.length > 60 || lastName.length > 60 || about.length > 1500 || job.length > 150) {
    return res.status(400).json({ error: "Dane są zbyt długie." });
  }

  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
    console.error("Brak BREVO_API_KEY lub BREVO_SENDER_EMAIL");
    return res.status(500).json({ error: "Serwer nie jest poprawnie skonfigurowany." });
  }

  const sender = {
    name: process.env.BREVO_SENDER_NAME || "PracaTeraz",
    email: process.env.BREVO_SENDER_EMAIL
  };

  const name = escapeHtml(firstName);
  const jobSafe = escapeHtml(job);

  try {
    // 1) Potwierdzenie dla kandydata
    await sendBrevo({
      sender,
      to: [{ email, name: `${firstName} ${lastName}` }],
      subject: "Otrzymaliśmy Twoje zgłoszenie – PracaTeraz",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
          <h2 style="color:#2563eb">Dziękujemy za zgłoszenie, ${name}!</h2>
          <p>Otrzymaliśmy Twoją aplikację na stanowisko:</p>
          <p style="background:#eef2ff;padding:12px 16px;border-radius:8px"><strong>${jobSafe}</strong></p>
          <p>Twoje zgłoszenie jest obecnie <strong>w trakcie rozpatrywania</strong>.
             Odpowiedź otrzymasz w ciągu kilku dni.</p>
          <p>Pozdrawiamy,<br>Zespół PracaTeraz</p>
          <hr style="border:none;border-top:1px solid #e5e7eb">
          <small style="color:#6b7280">To wiadomość automatyczna z projektu szkolnego. Prosimy na nią nie odpowiadać.</small>
        </div>`
    });

    // 2) (opcjonalnie) kopia dla administratora
    if (process.env.ADMIN_EMAIL) {
      await sendBrevo({
        sender,
        to: [{ email: process.env.ADMIN_EMAIL }],
        subject: `Nowe zgłoszenie: ${job}`,
        htmlContent: `
          <p><strong>Stanowisko:</strong> ${jobSafe}</p>
          <p><strong>Imię i nazwisko:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>O sobie:</strong><br>${escapeHtml(about).replace(/\n/g, "<br>")}</p>`
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Nie udało się wysłać e-maila. Spróbuj ponownie później." });
  }
};
