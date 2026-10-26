// ===== Dane ofert (fikcyjne) =====
const JOBS = [
  { id: 1, title: "Junior Front-end Developer", company: "TechNova", category: "IT", city: "Gdańsk", type: "Pełny etat", salary: "6 000 – 8 000 zł", desc: "Tworzenie interfejsów w HTML, CSS i JavaScript w małym, przyjaznym zespole." },
  { id: 2, title: "Tester oprogramowania", company: "SoftLab", category: "IT", city: "Warszawa", type: "Pełny etat", salary: "7 000 – 9 500 zł", desc: "Testy manualne aplikacji webowych, zgłaszanie błędów i współpraca z programistami." },
  { id: 3, title: "Administrator sieci", company: "NetSystem", category: "IT", city: "Poznań", type: "B2B", salary: "9 000 – 12 000 zł", desc: "Utrzymanie infrastruktury sieciowej oraz wsparcie użytkowników w firmie." },
  { id: 4, title: "Kurier rowerowy", company: "SzybkiePaczki", category: "Kurier", city: "Gdańsk", type: "Umowa zlecenie", salary: "28 – 35 zł/h", desc: "Dostawy jedzenia i paczek po mieście. Elastyczne godziny, własny rower lub rower elektryczny." },
  { id: 5, title: "Kurier samochodowy", company: "ExpressDrive", category: "Kurier", city: "Warszawa", type: "Pełny etat", salary: "5 500 – 7 000 zł", desc: "Dowóz przesyłek firmowych na stałych trasach. Wymagane prawo jazdy kat. B." },
  { id: 6, title: "Kierowca taksówki", company: "TaxiMiasto", category: "Transport", city: "Poznań", type: "Umowa zlecenie", salary: "6 000 – 9 000 zł", desc: "Przewóz pasażerów, własny samochód lub samochód firmowy. Licencja taxi mile widziana." },
  { id: 7, title: "Kierowca kat. C+E", company: "TransEuro", category: "Transport", city: "Gdynia", type: "Pełny etat", salary: "9 000 – 13 000 zł", desc: "Trasy krajowe i międzynarodowe, nowoczesne ciągniki, stały grafik." },
  { id: 8, title: "Kelner / Kelnerka", company: "Restauracja Smaki", category: "Gastronomia", city: "Gdańsk", type: "Umowa zlecenie", salary: "25 – 30 zł/h + napiwki", desc: "Obsługa gości, przyjmowanie zamówień. Idealne również dla studentów." },
  { id: 9, title: "Pizzer", company: "Pizzeria Roma", category: "Gastronomia", city: "Mogilno", type: "Pełny etat", salary: "4 800 – 6 000 zł", desc: "Przygotowywanie pizzy w piecu opalanym drewnem. Doświadczenie mile widziane." },
  { id: 10, title: "Sprzedawca w sklepie", company: "Market24", category: "Sprzedaż", city: "Poznań", type: "Pełny etat", salary: "4 500 – 5 500 zł", desc: "Obsługa klienta, kasa, wykładanie towaru. Praca na zmiany." },
  { id: 11, title: "Magazynier", company: "LogiStore", category: "Magazyn", city: "Gdańsk", type: "Pełny etat", salary: "5 000 – 6 200 zł", desc: "Kompletowanie zamówień i obsługa wózka widłowego. Szkolenie na miejscu." },
  { id: 12, title: "Fryzjer / Barber", company: "Urban Cut", category: "Usługi", city: "Gdynia", type: "B2B", salary: "6 000 – 10 000 zł", desc: "Strzyżenie i stylizacja brody w nowoczesnym barber shopie." }
];

// ===== Elementy strony =====
const jobsEl = document.getElementById("jobs");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const cityEl = document.getElementById("city");
const resetEl = document.getElementById("reset");

const modal = document.getElementById("modal");
const form = document.getElementById("form");
const formJob = document.getElementById("form-job");
const formMsg = document.getElementById("form-msg");
const submitBtn = document.getElementById("submit");
const closeBtn = document.getElementById("close");

let selectedJob = null;

// ===== Filtry: wypełnianie list =====
function fillSelect(select, values) {
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "pl")).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}
fillSelect(categoryEl, JOBS.map(j => j.category));
fillSelect(cityEl, JOBS.map(j => j.city));

// ===== Renderowanie ofert =====
function render() {
  const q = searchEl.value.trim().toLowerCase();
  const cat = categoryEl.value;
  const city = cityEl.value;

  const filtered = JOBS.filter(j => {
    const text = `${j.title} ${j.company} ${j.city} ${j.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!cat || j.category === cat) && (!city || j.city === city);
  });

  jobsEl.innerHTML = "";
  filtered.forEach(j => {
    const card = document.createElement("article");
    card.className = "job";

    const tag = document.createElement("span");
    tag.className = "job__tag";
    tag.textContent = j.category;

    const h3 = document.createElement("h3");
    h3.textContent = j.title;

    const company = document.createElement("p");
    company.className = "job__company";
    company.textContent = j.company;

    const meta = document.createElement("div");
    meta.className = "job__meta";
    meta.innerHTML = "<span>📍 </span><span>💼 </span>";
    meta.children[0].append(j.city);
    meta.children[1].append(j.type);

    const desc = document.createElement("p");
    desc.className = "job__desc";
    desc.textContent = j.desc;

    const salary = document.createElement("p");
    salary.className = "job__salary";
    salary.textContent = j.salary;

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = "Aplikuj";
    btn.addEventListener("click", () => openForm(j));

    card.append(tag, h3, company, meta, desc, salary, btn);
    jobsEl.appendChild(card);
  });

  emptyEl.hidden = filtered.length > 0;
  countEl.textContent = `Znaleziono ofert: ${filtered.length}`;
}

[searchEl, categoryEl, cityEl].forEach(el => el.addEventListener("input", render));
resetEl.addEventListener("click", () => {
  searchEl.value = "";
  categoryEl.value = "";
  cityEl.value = "";
  render();
});

// ===== Formularz =====
function openForm(job) {
  selectedJob = job;
  form.reset();
  formMsg.textContent = "";
  formMsg.className = "form__msg";
  submitBtn.disabled = false;
  formJob.textContent = `${job.title} – ${job.company}`;
  modal.showModal();
}

closeBtn.addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

function showMsg(text, ok) {
  formMsg.textContent = text;
  formMsg.className = "form__msg " + (ok ? "ok" : "err");
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");

  if (!data.firstName.trim() || !data.lastName.trim()) return showMsg("Podaj imię i nazwisko.", false);
  if (!emailOk) return showMsg("Podaj poprawny adres e-mail.", false);
  if (data.about.trim().length < 10) return showMsg("Napisz o sobie przynajmniej kilka słów.", false);

  submitBtn.disabled = true;
  showMsg("Wysyłanie...", true);

  try {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        about: data.about.trim(),
        website: data.website,
        job: `${selectedJob.title} – ${selectedJob.company}`
      })
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(json.error || "Coś poszło nie tak.");

    showMsg("Dziękujemy! Sprawdź skrzynkę e-mail – wysłaliśmy potwierdzenie.", true);
    form.reset();
    setTimeout(() => modal.close(), 3000);
  } catch (err) {
    showMsg(err.message || "Błąd wysyłania. Spróbuj ponownie.", false);
    submitBtn.disabled = false;
  }
});

// ===== Start =====
document.getElementById("year").textContent = new Date().getFullYear();
render();
