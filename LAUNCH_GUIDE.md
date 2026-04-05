# AIPGBD — Build to Launch Guide

## What you have

A complete React application with:
- Animated hero with live stat counters
- Services section with expandable package cards
- Capability, Process, Niches sections
- Working contact form with validation
- FAQ accordion
- Custom cursor, scroll animations, mobile menu
- All content editable from one file: `src/data/content.js`

---

## Step 1 — Install Node.js (one time only)

Go to https://nodejs.org and download the **LTS version** (e.g. 20.x).

Verify it worked:
```bash
node --version   # should print v20.x.x
npm --version    # should print 10.x.x
```

---

## Step 2 — Set up the project on your computer

1. Copy the entire `aipgbd` folder to your computer (e.g. Desktop)
2. Open Terminal (Mac/Linux) or Command Prompt (Windows)
3. Navigate to the folder:

```bash
cd Desktop/aipgbd
```

4. Install all dependencies:

```bash
npm install
```

This downloads ~300MB of packages into a `node_modules` folder. Takes 2–3 minutes.

5. Start the development server:

```bash
npm start
```

Your browser will open at **http://localhost:3000** and you will see your live site. Every time you save a file, it updates instantly.

---

## Step 3 — Add your showreel video

1. Export your 30-second Grok showreel as **MP4, H.264, under 15MB**
2. Name it `showreel.mp4`
3. Place it inside `aipgbd/public/`
4. Open `src/sections/Hero.jsx`
5. Find this comment block:

```jsx
{/* Replace this div with: <video ref={videoRef} src="/your-showreel.mp4" autoPlay muted loop playsInline /> */}
<div className="hero__video-placeholder">
```

6. Replace the entire `<div className="hero__video-placeholder">...</div>` block with:

```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
>
  <source src="/showreel.mp4" type="video/mp4" />
</video>
```

---

## Step 4 — Edit your content

All text, prices, and links live in one file: **`src/data/content.js`**

### Change prices:
```js
// Find PACKAGES array, change the price field:
price: '৳8,000',   // ← edit this
```

### Change Facebook / YouTube links:
```js
export const SITE = {
  facebook: 'https://facebook.com/aipgbd',   // ← your actual URL
  youtube: 'https://youtube.com/@aipgbd',    // ← your actual URL
  email: 'hello@aipgbd.com',
};
```

### Add a new FAQ:
```js
export const FAQS = [
  // Add at the end:
  { q: 'Your question here?', a: 'Your answer here.' },
];
```

### Add a new niche/sector:
```js
export const NICHES = [
  // Add a new object:
  { icon: '🎬', title: 'Your Niche', pain: 'The problem they have.', roi: 'What you deliver.' },
];
```

---

## Step 5 — Connect the contact form

The form currently simulates a submission. To make it real, use **EmailJS** (free, no backend needed).

### Setup EmailJS (free tier: 200 emails/month):

1. Go to https://emailjs.com and create a free account
2. Click **Add New Service** → connect your Gmail
3. Click **Email Templates** → create a template with these variables:

```
From: {{name}} ({{email}})
Phone: {{phone}}
Sector: {{niche}}
Package: {{budget}}
Message: {{message}}
```

4. Go to **Account** → copy your **Public Key**
5. Copy your **Service ID** and **Template ID**

### Plug them in:

Open `src/sections/Contact.jsx` and replace the `handleSubmit` function:

```jsx
import emailjs from '@emailjs/browser';

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setStatus('loading');

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',    // from EmailJS dashboard
      'YOUR_TEMPLATE_ID',   // from EmailJS dashboard
      values,
      'YOUR_PUBLIC_KEY'     // from EmailJS account settings
    );
    setStatus('success');
  } catch (err) {
    console.error(err);
    setStatus('error');
  }
};
```

---

## Step 6 — Build for production

When you are ready to deploy:

```bash
npm run build
```

This creates a `build/` folder — a fully optimized, minified version of your site. This is what you upload to hosting.

---

## Step 7 — Buy your domain

Go to **Namecheap** (namecheap.com) or **Hostinger** (hostinger.com).

Search for: `aipgbd.com` or `aipg.digital` or `aiplaygroundbd.com`

Cost: ~৳1,500–2,000/year for a `.com`

---

## Step 8 — Deploy to Netlify (free, takes 3 minutes)

Netlify hosts React apps for free with automatic HTTPS.

### Option A — Drag and drop (simplest):

1. Run `npm run build` in your terminal
2. Go to https://netlify.com → sign up free
3. Drag the `build/` folder onto the Netlify dashboard
4. Your site is live instantly at a random URL like `happy-einstein-123.netlify.app`

### Option B — Connect GitHub (recommended for ongoing updates):

1. Push your code to a GitHub repository
2. In Netlify: **New site from Git** → connect your repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Click Deploy

Every time you push code to GitHub, Netlify rebuilds automatically.

### Connect your custom domain:

1. In Netlify: **Domain settings** → Add custom domain → enter `aipgbd.com`
2. Netlify will show you nameserver addresses (e.g. `dns1.p01.nsone.net`)
3. In Namecheap/Hostinger: find **Nameservers** → switch to Custom → paste Netlify's nameservers
4. Wait 15–30 minutes for DNS to propagate
5. Netlify adds HTTPS/SSL automatically — no extra cost

---

## Step 9 — Verify everything before going live

Work through this checklist:

```
[ ] Video plays on the hero section (autoplay, muted, looping)
[ ] All 3 package prices are correct
[ ] Facebook and YouTube links open the right pages
[ ] Contact form sends an email to your inbox
[ ] Form shows success state after submission
[ ] Mobile menu opens and closes correctly
[ ] Site loads on your phone (open the Netlify URL on mobile)
[ ] All section scroll links work (navbar buttons)
[ ] HTTPS padlock shows in browser bar
```

---

## Step 10 — Post-launch (Month 1 actions)

### Add Google Analytics (free):

1. Go to analytics.google.com → create a property
2. Copy your **Measurement ID** (e.g. `G-XXXXXXXXXX`)
3. In `public/index.html`, paste before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Add Meta Pixel (for your ad retargeting):

1. Go to Facebook Business Manager → Events Manager → Add Pixel
2. Copy your Pixel ID
3. Paste the pixel code in `public/index.html` before `</head>`

### Update meta tags for social sharing:

In `public/index.html`, update:

```html
<meta property="og:title" content="AI Playground BD — Cinematic AI Production" />
<meta property="og:description" content="30-second unbroken cinematic shots from a single image. Dhaka's premium AI creative agency." />
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
<meta property="og:url" content="https://yourdomain.com" />
```

Create an `og-image.jpg` (1200×630px) — a still frame from your showreel — and place it in `public/`.

---

## File structure reference

```
aipgbd/
├── public/
│   ├── index.html          ← Meta tags, fonts, OG tags
│   └── showreel.mp4        ← Your video goes here
├── src/
│   ├── data/
│   │   └── content.js      ← ALL editable content lives here
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── sections/
│   │   ├── Hero.jsx / .css
│   │   ├── Services.jsx / .css
│   │   ├── Contact.jsx / .css
│   │   ├── FAQ.jsx / .css
│   │   └── Misc.jsx        ← Ticker, Process, Niches, Footer
│   ├── hooks/
│   │   └── index.js        ← useCursor, useInView, useForm, useCounter
│   ├── App.js              ← Assembles all sections
│   └── index.css           ← Design tokens and global styles
└── package.json
```

---

## Common errors and fixes

**"npm: command not found"**
→ Node.js is not installed. Go to nodejs.org and install the LTS version.

**"Module not found: Can't resolve..."**
→ Run `npm install` again. A package is missing.

**"Failed to compile"**
→ Check the terminal for the exact error line. Usually a missing comma or unclosed bracket.

**Video not showing on live site**
→ Make sure `showreel.mp4` is inside the `public/` folder, not `src/`. The `public/` folder is what gets served.

**Contact form not sending**
→ Double-check your EmailJS Service ID, Template ID, and Public Key. All three must match exactly.

**Custom domain not loading**
→ DNS changes take up to 48 hours. Check with https://dnschecker.org using your domain name.

---

## Cost summary

| Item | Cost |
|---|---|
| Domain (.com, 1 year) | ~৳1,500 |
| Netlify hosting | Free |
| EmailJS (200 emails/month) | Free |
| Google Analytics | Free |
| Meta Pixel | Free |
| **Total infrastructure** | **~৳1,500/year** |

Everything else — the code, the React app, the animations — costs nothing to run.
