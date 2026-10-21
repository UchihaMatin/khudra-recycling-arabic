# خضرة | Khudra — Recycling Marketplace (Arabic UI)

<div dir="rtl">

**خضرة** واجهة أمامية كاملة باللغة العربية (RTL) لمنصة بيع وشراء المواد القابلة لإعادة التدوير، مصممة للسوق السعودي: أسعار بالريال السعودي لكل كيلوغرام، أرقام جوال تبدأ بـ 05، رقم هوية وطنية، آيبان سعودي، وسجل تجاري.

> مشروع عرض (Portfolio) — كل البيانات تجريبية ولا يوجد خادم خلفي.

</div>

## Pages

| Area | Pages |
| --- | --- |
| Public site | `index` (landing), `about-us`, `articles`, `article-detail` |
| Sign-in / sign-up | `login` (OTP), `login-multi-step` (city → phone → account type → details → OTP), `register-recyclable` (recycling-center application with map), `pre-registration`, `awaiting-confirmation` |
| User web app (mobile-first) | `home-user-calculator`, `home-user-wastes` (search + categories), `home-user-waste-detail?m=copper`, `home-user-location` (5-step pickup wizard), `home-user-purchase-request`, `home-user-wallet`, `home-user-wallet-add`, `home-user-wallet-change`, `home-user-wallet-withdrawal`, `home-user-profile` |
| Business | `recycling-center-dashboard` (stats, filterable requests table, inventory, drivers, price editor; responsive off-canvas sidebar) |

## Highlights

- Full Arabic copy, RTL layout, Gregorian date picker with Arabic month names.
- Saudi-specific validation: mobile `05XXXXXXXX`, national ID / Iqama (10 digits starting with 1 or 2), IBAN `SA` + 22 digits, 5-digit postal code, 10-digit CR number.
- Interactive flows in vanilla JS: OTP inputs with paste support and resend timer, multi-step forms with progress bar, live price calculator, weight slider, search with Arabic normalisation, wallet withdrawal and card management, pickup wizard.
- Accessibility touches: `inert` on hidden steps, ARIA on custom selects, alert regions, alt text.
- All text inside images is Arabic (logos and banners are SVG with outlined text).

## Tech

- HTML5, SCSS (compiled to `assets/css/style.min.css`), Bootstrap 5 RTL (grid/utilities), vanilla JavaScript — no framework and no build step needed to serve.
- Font: Arad (bundled in `assets/font`).

## Run locally

```bash
npx serve .
```

Any static server works (`python -m http.server` too).

To change styles, edit `assets/scss/style.scss` and rebuild:

```bash
npm install
npm run build:css
```

## Deploy to Vercel

The repo is a static site. `vercel.json` skips install/build, serves the root directory and enables clean URLs.

1. In Vercel choose **Add New → Project** and import this GitHub repository.
2. Keep the defaults (Framework preset: *Other*) and deploy.

## Credits

Arabic adaptation of an original Persian UI template, rewritten for the Saudi market: copy, validation rules, JavaScript behaviour, images containing text, and a new recycling-center dashboard.
