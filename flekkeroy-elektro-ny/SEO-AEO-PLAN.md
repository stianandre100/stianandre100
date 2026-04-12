# SEO & AEO Oppgraderingsplan – flekkeroy-elektro.no

Konkret plan for å optimalisere eksisterende WordPress-side for både tradisjonell SEO og AEO (Answer Engine Optimization – ChatGPT, Gemini, Google AI Overviews).

**Mål:** Rangere #1 for "elektriker Kristiansand" og bli sitert av AI-motorer når folk spør om elektriske tjenester i regionen.

---

## 📋 Innholdsfortegnelse

1. [Quick wins (gjør dette i dag)](#1-quick-wins)
2. [JSON-LD strukturert data](#2-json-ld-strukturert-data)
3. [Dedikerte tjenestesider](#3-dedikerte-tjenestesider)
4. [FAQ-optimalisering for AEO](#4-faq-optimalisering-for-aeo)
5. [Core Web Vitals & teknisk SEO](#5-core-web-vitals)
6. [Lokal SEO & Google Business Profile](#6-lokal-seo)
7. [Innholdsstrategi](#7-innholdsstrategi)
8. [Målbare KPIer](#8-kpier)

---

## 1. Quick wins

Disse kan gjøres på 1-2 timer og gir umiddelbar effekt:

- [ ] **Title tags** – bruk format: `[Primær keyword] | Flekkerøy Elektro AS`
  - Eksempel: `Elektriker Kristiansand | Flekkerøy Elektro AS`
- [ ] **Meta descriptions** – maks 155 tegn, inkluder telefonnummer
- [ ] **H1** – én per side, inneholder primær keyword
- [ ] **Alt-tekst** på alle bilder (`alt="elektriker installerer sikringsskap i Kristiansand"`)
- [ ] **Intern linking** – link fra forsiden til alle tjenestesider med beskrivende ankertekst
- [ ] **Sitemap** – generer via Yoast og send til Google Search Console
- [ ] **SSL/HTTPS** – sjekk at alt er på HTTPS
- [ ] **Mobilvennlighet** – test på https://search.google.com/test/mobile-friendly

---

## 2. JSON-LD strukturert data

### 2.1 LocalBusiness + Electrician schema (forsiden)

**Hvor:** Legg inn i `<head>` via Yoast Custom Code, Insert Headers & Footers plugin, eller theme-funksjon.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Electrician",
  "@id": "https://www.flekkeroy-elektro.no/#organization",
  "name": "Flekkerøy Elektro AS",
  "alternateName": "Flekkerøy Elektro",
  "url": "https://www.flekkeroy-elektro.no",
  "logo": "https://www.flekkeroy-elektro.no/wp-content/uploads/logo.png",
  "image": "https://www.flekkeroy-elektro.no/wp-content/uploads/hero.jpg",
  "description": "Autorisert elektroentreprenør i Kristiansand siden 2016. Installasjon, service, industri, elbil-lading, smarthus og solceller.",
  "telephone": "+47-38-10-00-38",
  "email": "post@flekkeroy-elektro.no",
  "foundingDate": "2016",
  "priceRange": "$$",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 15
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rigedalen",
    "addressLocality": "Kristiansand",
    "postalCode": "4626",
    "addressCountry": "NO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 58.1089,
    "longitude": 8.0189
  },
  "areaServed": [
    { "@type": "City", "name": "Kristiansand" },
    { "@type": "Place", "name": "Flekkerøy" },
    { "@type": "Place", "name": "Søgne" },
    { "@type": "Place", "name": "Vennesla" },
    { "@type": "Place", "name": "Lillesand" },
    { "@type": "Place", "name": "Birkeland" }
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "07:00",
    "closes": "16:00"
  }],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.96",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "48",
    "reviewCount": "48"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Elektriske tjenester",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Elektrisk installasjon" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Service og vedlikehold" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industri og offshore" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Elbil-lading" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Smarthus" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Solceller" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "El-kontroll" }}
    ]
  },
  "sameAs": [
    "https://www.facebook.com/Flekkeroyelektro/",
    "https://www.instagram.com/flekkeroy_elektro/",
    "https://www.linkedin.com/company/flekkeroy-elektro/",
    "https://www.proff.no/selskap/flekker%C3%B8y-elektro-as/"
  ]
}
</script>
```

**Valider:** https://search.google.com/test/rich-results

### 2.2 BreadcrumbList schema (alle undersider)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Hjem",
      "item": "https://www.flekkeroy-elektro.no/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tjenester",
      "item": "https://www.flekkeroy-elektro.no/tjenester/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Elbil-lading"
    }
  ]
}
</script>
```

### 2.3 Service schema (én per tjenestesid)

Eksempel for elbil-lading:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Elbil-lading installasjon",
  "provider": {
    "@type": "Electrician",
    "name": "Flekkerøy Elektro AS",
    "telephone": "+47-38-10-00-38"
  },
  "areaServed": {
    "@type": "City",
    "name": "Kristiansand"
  },
  "description": "Profesjonell installasjon av elbil-ladere for bolig, borettslag og bedrift i Kristiansand. Rådgivning, montering og lastbalansering.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "NOK",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "8000",
      "maxPrice": "25000",
      "priceCurrency": "NOK"
    }
  }
}
</script>
```

---

## 3. Dedikerte tjenestesider

**Problem:** I dag har flekkeroy-elektro.no bare noen få "samle-sider". EK-Elektro har egne sider for hver tjeneste og rangerer bedre for long-tail keywords.

**Løsning:** Lag egne, optimaliserte sider for hver tjeneste:

| URL | Primær keyword | Sekundær keywords |
|---|---|---|
| `/tjenester/elbil-lading/` | elbil lader kristiansand | ladeboks, hjemmelader, borettslag lading |
| `/tjenester/smarthus/` | smarthus kristiansand | KNX, Loxone, smart belysning |
| `/tjenester/solceller/` | solceller kristiansand | solcellepanel, Enova støtte |
| `/tjenester/el-kontroll/` | el-kontroll kristiansand | internkontroll, termografi, NEK 400 |
| `/tjenester/varmekabler/` | varmekabler kristiansand | gulvvarme, badromsvarme |
| `/tjenester/industri/` | industri elektriker kristiansand | offshore, vannkraft, automasjon |
| `/tjenester/bolig/` | elektriker bolig kristiansand | sikringsskap, stikkontakter |
| `/tjenester/naering/` | elektriker næringsbygg | kontorbygg, butikk, restaurant |

### Mal for tjenestesid-innhold (AEO-optimalisert):

```markdown
# Elbil-lading i Kristiansand | Flekkerøy Elektro AS

Trenger du installasjon av elbil-lader i Kristiansand? Flekkerøy Elektro
installerer ladebokser for bolig, borettslag og bedrift. Vi er autorisert
elektroentreprenør med 15 fagfolk og 4.96/5 stjerner på Mittanbud.

## Hva koster det å installere elbil-lader?

**Kort svar:** Installasjon av elbil-lader i Kristiansand koster typisk
12 000–15 000 kr inkl. mva for en standard installasjon. Full prisspenn
er 8 000–25 000 kr avhengig av komplesitet.

[... detaljert forklaring ...]

## Hvilken ladeboks bør du velge?

[tabell med anbefalinger]

## Slik bestiller du

1. Ring oss på 38 10 00 38 eller fyll ut skjema
2. Vi kommer på gratis befaring innen 1 uke
3. Du får skriftlig tilbud innen 2 dager
4. Vi installerer innen 1–3 uker

[CTA: Bestill gratis befaring]
```

**Nøkkel:** Start hver seksjon med et **direkte svar** på 1-2 setninger. AI-motorer plukker opp disse direkte.

---

## 4. FAQ-optimalisering for AEO

FAQ-siden er gull verdt for AEO. Hver Q&A må:
1. Ha spørsmålet som `<h3>` eller `<h2>`
2. Starte svaret med **kort svar (1-2 setninger)** før utdyping
3. Være merket med `FAQPage` JSON-LD

### FAQPage schema (for FAQ-siden):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hva koster det å installere elbil-lader hjemme i Kristiansand?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Installasjon av elbil-lader i Kristiansand koster typisk 12 000–15 000 kr inkl. mva for en standard installasjon. Prisen kan variere fra 8 000 til 25 000 kr avhengig av avstand fra sikringsskap til ladepunkt, behov for oppgradering av inntak, og type ladeboks. Kontakt Flekkerøy Elektro på 38 10 00 38 for gratis befaring og fast pristilbud."
      }
    },
    {
      "@type": "Question",
      "name": "Er Flekkerøy Elektro autorisert?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, Flekkerøy Elektro AS er registrert elektroentreprenør hos DSB (Direktoratet for samfunnssikkerhet og beredskap) og Nemko-sertifisert for el-kontroll. Vi er også godkjent opplæringsbedrift og medlem av Norgeseliten."
      }
    },
    {
      "@type": "Question",
      "name": "Hvilke områder dekker Flekkerøy Elektro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vi betjener hele Kristiansand-regionen, inkludert Flekkerøy, Vågsbygd, Kvadraturen, Lund, Søgne, Songdalen, Vennesla, Lillesand og Birkeland. For industri- og offshore-prosjekter jobber vi i hele Sør-Norge."
      }
    }
  ]
}
</script>
```

### Anbefalte FAQ-spørsmål (AEO gull):

Lag FAQ som besvarer det folk faktisk spør ChatGPT om:

- Hva koster det å installere elbil-lader hjemme?
- Hva er forskjellen på 1-fase og 3-fase lader?
- Hvor ofte bør man ha el-kontroll?
- Hvor mye sparer jeg med solceller i Kristiansand?
- Hvor mye kan man få i Enova-støtte for solceller?
- Hva koster en el-sjekk?
- Hvordan velger jeg riktig ladeboks?
- Kan jeg installere ladeboks i leilighet/borettslag?
- Hvor lang tid tar det å installere et sikringsskap?
- Trenger jeg elektriker for å bytte stikkontakt?

---

## 5. Core Web Vitals

WordPress er tregt ut av boksen. Fiks dette:

### 5.1 Caching-plugin
**Anbefaling:** WP Rocket (premium) eller LiteSpeed Cache (gratis)

### 5.2 Bilder
- Bruk **WebP** format (konverter via ShortPixel eller Imagify)
- **Lazy loading** på alle bilder under fold
- **Riktig dimensjon** – ikke bruk 4000x3000 bilder som vises i 800x600
- **Alt-tekst** på alle bilder (SEO + a11y)

### 5.3 Minifiser CSS/JS
Bruk Autoptimize eller innebygd i WP Rocket.

### 5.4 Fjern unødvendige plugins
Hver plugin = mer JavaScript. Fjern alt dere ikke bruker.

### 5.5 Bruk et raskt tema
Astra, GeneratePress eller Kadence – unngå bloated multipurpose-temaer.

### 5.6 CDN
Cloudflare (gratis plan holder) gir raskere lasting globalt.

### 5.7 Test ytelse
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- Mål: **90+ score på mobil**, LCP < 2.5s, CLS < 0.1

---

## 6. Lokal SEO

### 6.1 Google Business Profile (viktigst!)
- [ ] Bekreft GBP-oppføringen
- [ ] Last opp 20+ bilder (team, biler, prosjekter, lokaler)
- [ ] Legg til alle tjenester som separate "services"
- [ ] Skriv 750+ tegn "From the business"
- [ ] Legg ut **minst én post per uke** (nyheter, prosjekter, tips)
- [ ] **Svar på ALLE anmeldelser** (både positive og negative)
- [ ] Sett opp Q&A – svar på typiske spørsmål
- [ ] Legg til åpningstider for helligdager

### 6.2 NAP-konsistens
Navn, Adresse, Telefon må være **100% identisk** overalt:
- Nettsted
- Google Business Profile
- Facebook
- Instagram
- 1881, Proff, Gulesider, 180.no
- Mittanbud
- Norgeseliten

### 6.3 Lokale kataloger
Opprett/oppdater profil på:
- [ ] 1881.no
- [ ] Proff.no
- [ ] Gulesider.no
- [ ] 180.no
- [ ] Mittanbud.no
- [ ] Finn Oppdrag
- [ ] Bestilleelektriker.no
- [ ] Kristiansand Næringsforening

### 6.4 Anmeldelser
- Send automatisk SMS/epost-forespørsel etter hvert oppdrag
- Mål: 2-5 nye anmeldelser per måned
- Ikke kjøp anmeldelser – Google vil straffe deg

---

## 7. Innholdsstrategi

### 7.1 Bloggartikler (2-4 per måned)
AEO-optimaliserte artikler som besvarer spørsmål:

| Artikkel | Primær keyword |
|---|---|
| "Elbil-lader hjemme: Komplett guide 2026" | elbil lader guide |
| "Solceller i Kristiansand: Lønnsomhet og Enova-støtte" | solceller kristiansand lønnsomhet |
| "Hva koster en elektriker i Kristiansand?" | elektriker pris kristiansand |
| "NEK 400: Dette må du vite om el-anlegg" | nek 400 bolig |
| "Smarthus Kristiansand: KNX vs Loxone vs Hue" | smarthus system sammenligning |
| "Slik velger du riktig sikringsskap" | sikringsskap bolig |
| "Varmekabler i bad: Pris og installasjon" | varmekabler bad pris |
| "El-kontroll ved boligsalg: Komplett guide" | el kontroll boligsalg |

### 7.2 Case-studies (1 per måned)
Vis faktiske prosjekter:
- Før/etter bilder
- Problemstilling
- Løsning
- Resultat
- Kundesitat
- Kostnad (gjerne spenn)

### 7.3 Video
- Korte video på TikTok/Instagram/YouTube Shorts
- "Hvordan vi..." serier
- Eksempel: "Slik monterer vi en ladeboks på 30 sekunder"

---

## 8. KPIer

Mål fremgang månedlig i Google Search Console og GA4:

| KPI | Start | 3 mnd | 6 mnd | 12 mnd |
|---|---|---|---|---|
| Organic søk per mnd | X | +50% | +100% | +200% |
| Rangering for "elektriker kristiansand" | ? | Topp 10 | Topp 5 | #1-3 |
| Antall rangerte keywords | ? | +50 | +150 | +300 |
| Backlinks | ? | +10 | +30 | +60 |
| GBP-visninger per mnd | ? | +30% | +75% | +150% |
| GBP-anrop per mnd | ? | +20% | +50% | +100% |
| Kjerneweb-vitaler (grønn) | ? | 75% | 90% | 100% |

---

## 📊 Prioritering

**Uke 1–2 (høyest ROI):**
1. Legg inn LocalBusiness JSON-LD
2. Optimaliser Google Business Profile
3. Fiks title tags og meta descriptions
4. Installer caching-plugin

**Måned 1:**
1. Lag 8 dedikerte tjenestesider med Service schema
2. Legg til FAQPage schema
3. Fiks Core Web Vitals
4. Start blogging (2 artikler)

**Måned 2–3:**
1. Bygg ut FAQ med 20+ spørsmål
2. Publiser 2-4 artikler/mnd
3. Bygg backlinks (gjestinnlegg, lokale kataloger)
4. Sett opp anmeldelse-automatisering

**Måned 4–12:**
1. Konsistent blogging
2. GBP-poster ukentlig
3. Case-studies månedlig
4. Video-innhold
5. Lokal PR og sponsing

---

## 🔗 Nyttige verktøy

- **Google Search Console** – https://search.google.com/search-console
- **Google Business Profile** – https://business.google.com
- **Rich Results Test** – https://search.google.com/test/rich-results
- **PageSpeed Insights** – https://pagespeed.web.dev
- **Ubersuggest** (keyword research) – https://neilpatel.com/ubersuggest
- **Screaming Frog** (site audit) – https://screamingfrog.co.uk
- **Ahrefs / SEMrush** (konkurrent-analyse)

---

*Sist oppdatert: 2026*
