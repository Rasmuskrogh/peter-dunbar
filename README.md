# Sanity Base

En återanvändbar startpunkt för Sanity + Next.js-projekt. Tanken är att
du forkar/kopierar den här mappen för varje nytt klientprojekt istället
för att bygga upp samma sak från scratch varje gång.

Den här filen är din karta för att hitta runt i koden.

## Snabbstart för ett nytt projekt

1. Kopiera hela mappen till projektets nya plats (eller `git clone` +
   byt remote).
2. Skapa ett riktigt Sanity-projekt:
   - `npx sanity login` — OBS: att logga in på sanity.io i webbläsaren
     (t.ex. via GitHub) räcker INTE, CLI:t i det här projektet behöver
     logga in separat. Kommandot öppnar en webbläsare för att godkänna
     samma konto mot CLI:t. Kontrollera med `npx sanity debug --secrets`
     (ska visa ditt användarnamn under "User", inte "Not logged in").
   - `npx sanity init` (eller skapa projektet på sanity.io/manage) och
     hämta `projectId`. Studion är stum (evig laddningsspinner på
     `/studio`) tills ett riktigt `projectId` är ifyllt — det är inte
     ett fel, den letar bara efter ett projekt som inte finns än.
3. Fyll i `.env.local` (kopiera från `.env.local.example` om den
   saknas) med riktiga värden:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (oftast `production`)
   - `NEXT_PUBLIC_SANITY_API_VERSION` (dagens datum, `YYYY-MM-DD`)
4. `npm install`
5. `npm run dev` och gå till `http://localhost:3000/studio` — där loggar
   du in och skapar "Home Page"- och "Site Settings"-dokumenten (de
   finns inte automatiskt, du måste spara dem en gång).
6. Byt ut färger/typsnitt i `src/app/globals.css` (se kommentaren där —
   de nuvarande värdena är neutrala platshållare, INTE ett riktigt
   klientnamn).

## Hur allt hänger ihop, i stora drag

```
Sanity Studio (/studio)  →  innehåll (dokument)  →  GROQ-queries
                                                        ↓
                                              Next.js-sidor renderar det
```

Studion är inbäddad direkt i Next.js-appen på `/studio` — det är alltså
inte en separat installation eller ett separat hostat verktyg. Samma
`npm run dev` kör både webbplatsen och redigeringsgränssnittet.

### Innehållsmodellen (schemat) — `src/sanity/schemaTypes/`

- **`documents/`** — de tre dokumenttyperna:
  - `homePage.ts` — singleton (finns bara EN, går inte att skapa fler
    av). Startsidans innehåll.
  - `page.ts` — vanlig, repeterbar sida. Har en `slug` (t.ex. `about`)
    och renderas automatiskt på `/about`.
  - `siteSettings.ts` — singleton. Navigation, logga, kontaktuppgifter,
    sociala länkar, copyright-namn. Sånt som är gemensamt för hela
    sajten, inte en specifik sida.
- **`objects/blocks/`** — de byggklossar ("slices" om du är van vid
  Prismic-språket) som redaktören kan lägga till i valfri ordning på en
  sida:
  - `heroBlock` — helskärms-hero med bakgrundsbild.
  - `textBlock` — rubrik (valfri) + brödtext (portable text) + valfri
    knapp. Har också ett valfritt `pullQuote`-fält — sätts det, byter
    blocket till en bred vänsterställd tvåkolumnslayout (brödtext +
    ett utdraget citat bredvid) istället för den centrerade CTA-looken.
  - `textWithImageBlock` — samma, plus bild vänster/höger. Två extra
    valfria fält: `facts` (kort label/value-lista under brödtexten,
    t.ex. en bio-sammanfattning) och `showContactDetails` (växlar på en
    lista med email/telefon/adress/webbplats/sociala länkar hämtade
    direkt från Site Settings — för en kontaktsidas inledande block).
  - `personGridBlock` — team/personer med foto, klickbar bio-modal.
  - `imageGalleryBlock` — klickbart lightbox-galleri. Har ett
    `layout`-fält redaktören väljer i Studio: **Grid** (jämna,
    beskurna rutor) eller **Mosaic** (justified rows — bilderna
    behåller sitt eget bildförhållande, radhöjden skalas så raden
    fyller hela bredden, ingen beskärning). Samma block, samma
    bilddata — bara en presentationsväxel, inget att koda om per
    projekt.
  - `ctaBlock` — kort, kontrastrik uppmaningsruta med en knapp.
  - `testimonialsBlock` — citat/recensioner. Har ett `limit`-fält (visa
    bara de första N) + valfri knapp, så SAMMA block täcker både en
    "3 höjdpunkter på startsidan"-teaser och en fullständig lista på en
    egen sida — istället för att ha en separat teaser-blocktyp. Ett
    `layout`-fält växlar mellan **Grid** (alla citat synliga) och
    **Carousel** (ett citat i taget, auto-roterande, pausar vid hover).
    Varje citat kan också ha `date`/`group` — sätts `group` (t.ex. ett
    projekt eller en produktion) grupperas citaten under egna rubriker,
    nyaste först, istället för ett platt rutnät.
  - `infoGridBlock` — generiskt rutnät av korta textposter (titel +
    valfri metarad + valfri brödtext, inga foton). Täcker sånt som
    "roller framförda", "priser & stipendier", "tjänster" — allt som
    är samma enkla upprepande form. Ett valfritt `columns`-fält pinnar
    ett fast antal kolumner (annars responsiv auto-fit).
  - `contactFormBlock` — kontaktformulär med alla etiketter redigerbara
    i Studio, postar till `/api/contact` (se eget avsnitt nedan).
  - `eventsBlock` — kalender. Till skillnad från övriga block har den
    inget eget innehåll: den listar automatiskt VARJE `event`-dokument
    (se nästa punkt), delar upp i kommande/tidigare, och grupperar det
    tidigare per år (klickbart/expanderbart). Lägg till events i
    Studions "Events"-lista, inte i själva blocket. Har ett `limit`-fält
    (t.ex. "nästa 2") för en startsida-teaser — då visas bara de
    kommande, ingen historik — plus en valfri knapp mot en egen
    kalender-sida.
  - `recordingsBlock` — samma princip, fast för `recording`-dokument,
    grupperade efter valfri fritext-kategori (inget fast schema — varje
    projekt sätter sina egna kategorinamn). YouTube/Vimeo/Spotify-länkar
    spelas upp direkt i en lightbox; andra URL:er länkar bara ut. Har
    ett `featured`-fält — handplocka specifika inspelningar för en
    teaser (platt lista, ingen gruppering) istället för att visa allt.

  Alla listas i `objects/blocks/index.ts` — **det är EXAKT en plats att
  lägga till en ny blocktyp på.**

- **`documents/event.ts`** och **`documents/recording.ts`** — två
  extra, repeterbara dokumenttyper (inte kopplade till en specifik
  sida) som `eventsBlock`/`recordingsBlock` frågar efter direkt i
  `queries.ts` (en GROQ-subquery inuti blockets projektion, inte ett
  extra fetch-anrop). Skapa/redigera dem från "Events"/"Recordings" i
  Studions vänstermeny.
- **`objects/pageBuilder.ts`** — själva fältet ("Page content") som
  `homePage` och `page` båda använder, byggt av listan i
  `blocks/index.ts`.
- **`objects/link.ts`** och **`objects/seo.ts`** — återanvändbara
  delfält (länk som kan peka internt eller externt; SEO-titel/beskrivning/bild).

**Så här lägger du till en ny blocktyp:**
1. Skapa `src/sanity/schemaTypes/objects/blocks/minBlock.ts` (kopiera en
   befintlig som mall, t.ex. `ctaBlock.ts` för en enkel, eller
   `personGridBlock.ts` för en med array/upprepning).
2. Lägg till den i `blocks/index.ts`.
3. Skapa motsvarande React-komponent i `src/components/PageBuilder/`
   och lägg till den i switchen i `src/components/PageBuilder/index.tsx`.
4. Om komponenten behöver data du inte redan hämtar: lägg till
   fältprojektionen i `pageBuilderFragment` i `src/lib/queries.ts` och
   TypeScript-typen i `src/lib/types.ts`.

### Studio-konfiguration

- `sanity.config.ts` (projektroten) — själva Studio-konfigurationen:
  scheman, plugins (`structureTool` för vänstermenyn,
  `visionTool` för att testa GROQ-queries direkt i Studio), och
  singleton-spärren (`document.newDocumentOptions`) som gör att
  "Home Page" och "Site Settings" inte dyker upp i "+ Create"-menyn.
- `src/sanity/structure.ts` — bygger vänstermenyn i Studio. Här listas
  singletons med fast dokument-id (så de alltid öppnar SAMMA dokument,
  aldrig ett nytt) och "Pages" som en vanlig lista.
- `src/app/studio/[[...tool]]/page.tsx` — bara en tunn inbäddning
  (`<NextStudio>`), rör inte den här filen.

**Lägga till en ny singleton** (t.ex. om du behöver en till
"finns-bara-en-gång"-typ): lägg till namnet i `SINGLETON_TYPES` i
`structure.ts` och lägg till ett listItem där, exakt samma mönster som
`homePage`/`siteSettings`.

### Frontend — `src/app/(site)/` och `src/components/`

- `src/app/(site)/layout.tsx` — Header + `<main>` + Footer, alltså
  sajtens "skal". Ligger i en route-grupp `(site)` så att `/studio`
  INTE ärver den här designen (Studio har sitt eget gränssnitt).
- `src/app/(site)/page.tsx` — startsidan, hämtar `homePage`-dokumentet.
- `src/app/(site)/[slug]/page.tsx` — generisk sida, hämtar `page`-
  dokumentet vars `slug` matchar URL:en. Alltså: en ny `page` i Studio
  med slug `kontakt` blir automatiskt `/kontakt`, ingen kodändring
  behövs.
- `src/components/Header.tsx` / `Footer.tsx` — läser navigation resp.
  kontaktuppgifter från `siteSettings`.
- `src/components/PageBuilder/` — en komponent per blocktyp, se ovan.

### Data — `src/lib/` och `src/sanity/lib/`

- `src/lib/queries.ts` — alla GROQ-queries på ett ställe.
  `pageBuilderFragment` listar EXPLICIT vilka fält varje blocktyp
  hämtar (medvetet inte `...` som hämtar allt) — det gör att en
  oanvänd/borttagen fältändring i Studio inte kan läcka in i frontend
  av misstag.
- `src/lib/types.ts` — TypeScript-typer, handskrivna (inte
  auto-genererade av `sanity typegen`). Medvetet val: en handskriven
  typ visar bara det du faktiskt hämtar i queryn, inte allt som
  schemat råkar tillåta.
- `src/lib/link.ts` — `hrefFor()`, gör om ett `link`-fält (internt
  eller externt) till en vanlig URL-sträng.
- `src/sanity/lib/client.ts` — Sanity-klienten (läser projectId/dataset
  från env).
- `src/sanity/lib/image.ts` — `urlFor()` för bildURL:er.
- `src/lib/embed.ts` — `embedSrcFor()`/`youtubeThumbnailFor()`. Sanity
  har inget inbyggt oEmbed-fält (till skillnad från Prismics Embed-fält
  som auto-hämtar tumnagel/HTML) — det här är en enkel URL-tolkning för
  YouTube/Vimeo/Spotify istället, ingen extern API-förfrågan. En
  okänd URL ger `null` tillbaka och `RecordingCard` länkar ut istället
  för att bädda in.

## Kontaktformuläret (`contactFormBlock`)

Postar till `src/app/api/contact/route.ts`, som skickar mejl via
nodemailer. Utan `EMAIL_USER`/`EMAIL_PASS` i `.env.local` fungerar
formuläret ändå hela vägen — det skickar bara till en engångs-testinkorg
(Ethereal) och loggar en förhandsgranskningslänk i terminalen, så du kan
verifiera hela flödet innan riktiga uppgifter finns. För riktig leverans:

- `EMAIL_USER` / `EMAIL_PASS` — ett Gmail-konto + ett
  ["app password"](https://myaccount.google.com/apppasswords) (inte
  det vanliga lösenordet).
- `CONTACT_EMAIL` — vart meddelanden skickas (annars `EMAIL_USER`
  själv).

Byt ut Gmail-blocket i `route.ts` mot en annan leverantör (Resend, SES,
egen SMTP) om ett projekt behöver det — resten av routen är
leverantörsoberoende. Har inbyggt honeypot-skydd mot spam-bottar.

## Designtokens

`src/app/globals.css` har platshållarfärger/typsnitt längst upp
(`--color-bg`, `--color-accent`, `--font-display`, osv.) med en
kommentar om att de MÅSTE bytas ut per klient. `.container`/`.section`
är delade hjälpklasser — notera att `.section` medvetet använder
`padding-top`/`padding-bottom` (inte kortformen `padding`) för att inte
krocka med `.container`s sido-padding; se kommentaren i filen för bakgrunden.

## Vanliga fällor (redan lösta här, men bra att känna till)

- **Dropdown-menyer i headern** byggs INTE med `<details>`/`<summary>`
  — webbläsare döljer stängt `<details>`-innehåll på ett sätt som
  ingen CSS kan komma runt. Se `Header.module.css`, mönstret är en
  vanlig `<ul>` som visas via `:hover`/`:focus-within`.
- **`@sanity/icons` v5** exporterar inte längre ikoner från
  rot-paketet — varje ikon importeras från sin egen subpath, t.ex.
  `import { HomeIcon } from "@sanity/icons/Home"`. Ett `import {
  UsersIcon } from "@sanity/icons"` typechecker igenom men kraschar
  runtime (Studio-sidan ger 500). Alla ikonimporter i det här projektet
  använder redan rätt mönster — kopiera det mönstret för nya ikoner.
- Om `body` är `display: flex; flex-direction: column`, behöver
  `<main>` `flex: 1 0 auto; width: 100%; display: block;` — annars kan
  `aspect-ratio`-boxar inuti få bredden beräknad FRÅN höjden istället
  för tvärtom.

## Kommandon

- `npm run dev` — startar allt (sajt + Studio) på `:3000`
- `npm run build` / `npm run start` — produktionsbygge
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typkontroll utan att bygga
