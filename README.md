# PracaTeraz – школьный проект

Сайт с вакансиями (HTML + CSS + JS), поиск и фильтры, форма отклика, письмо-подтверждение через Brevo, деплой на Vercel.

## Структура

```
index.html      – страница
style.css       – стили
script.js       – вакансии, поиск/фильтры, форма
api/apply.js    – serverless-функция (отправка письма через Brevo)
.env.example    – какие переменные нужны
```

## 1. Brevo (бесплатно, 300 писем/день)

1. Регистрация на brevo.com.
2. **SMTP & API → API Keys → Generate a new API key**. Скопируй ключ.
3. **Senders, Domains & Dedicated IPs → Senders → Add a sender**: адрес, с которого пойдут письма (пока домена нет, можно свой gmail, придёт письмо-подтверждение).
4. Когда купишь домен: **Domains → Add a domain**, Brevo покажет DNS-записи (SPF, DKIM, DMARC, Brevo code). Их нужно добавить в панели home.pl, иначе письма с адреса на твоём домене будут падать в спам.

## 2. GitHub + Vercel

1. Залей папку в новый репозиторий на GitHub.
2. На vercel.com: **Add New → Project → Import** репозиторий. Framework: **Other**, настройки не трогай.
3. **Settings → Environment Variables**, добавь:
   - `BREVO_API_KEY`: ключ из Brevo
   - `BREVO_SENDER_EMAIL`: подтверждённый адрес отправителя
   - `BREVO_SENDER_NAME`: `PracaTeraz` (необязательно)
   - `ADMIN_EMAIL`: твой email, куда придёт копия заявки (необязательно)
4. **Deployments → Redeploy** (переменные подхватываются только после нового деплоя).

## 3. Домен (home.pl → Vercel)

1. Vercel: **Settings → Domains → Add** → вписываешь свой домен (например `mojaprace.pl`).
2. Vercel покажет, какие записи нужны. Обычно:
   - `A` для `@` → `76.76.21.21`
   - `CNAME` для `www` → `cname.vercel-dns.com`
   (Vercel может показать свои актуальные значения, ориентируйся на них.)
3. В панели home.pl: **Domains → DNS / Zarządzanie DNS** → добавь эти записи (старые A/CNAME для `@` и `www` удали).
4. Ждёшь от нескольких минут до пары часов, HTTPS Vercel включит сам.

## Локальный запуск (по желанию)

```
npm i -g vercel
vercel dev
```
Создай `.env` по образцу `.env.example`. Без `vercel dev` форма работать не будет (`/api/apply` существует только там и на Vercel), а страница откроется и просто так.

## Что рассказать учителю

- Фронтенд: чистые HTML, CSS, JS (без фреймворков).
- Бэкенд: одна serverless-функция, ключ API хранится в переменных окружения, а не в коде.
- Защита: валидация на клиенте и сервере, экранирование HTML в письме, honeypot против ботов.
