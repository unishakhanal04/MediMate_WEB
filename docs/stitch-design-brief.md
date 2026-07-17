# MediMate — Design Brief for Stitch AI

This document describes every existing screen in MediMate (a healthcare/medication-management web app) exactly as it exists today — structure, content, and states — plus a single, clean, coordinated color and style system to replace the current inconsistent styling (a mix of ad-hoc inline hex colors and Tailwind utility classes with no shared palette).

Screens are listed in **the exact order a visitor moves through the site**: public landing page first, then the auth flow, then the logged-in user app in its real sidebar-nav order, then the admin app.

**How to use this with Stitch:** paste the "Global Design System" section first (or once per session as style context), then paste one "Screen" block at a time, in order. Each screen block restates the relevant tokens it needs, so Stitch can generate that screen on its own even if you only paste that one section.

---

## 1. Product Context

MediMate is a healthcare companion web app with two roles:

- **Visitor (logged out)** — lands on the public marketing page, then signs up or logs in.
- **Patient (user)** — manages their own medicines, prescriptions, appointments, reminders, health timeline, an AI health assistant, and their profile.
- **Admin** — manages the platform: user accounts, system-wide dashboard metrics, and system-wide reports.

Tone: calm, trustworthy, clinical-but-warm. Not playful, not cold/sterile. Think "modern telehealth product," not "hospital intranet from 2009."

---

## 2. Global Design System

### 2.1 Color Palette

Replace all ad-hoc hex values with this token set. One primary brand color, one neutral scale, and semantic colors reserved **only** for meaning (status), never for decoration.

**Primary — Trust Blue** (brand, navigation, primary actions, links, focus rings)
- `primary-50` `#EFF6FF`
- `primary-100` `#DBEAFE`
- `primary-500` `#3B82F6`
- `primary-600` `#2563EB` ← main brand color, primary buttons, active nav, links
- `primary-700` `#1D4ED8` ← hover state for primary buttons
- `primary-900` `#1E3A8A` ← headings on light backgrounds when extra emphasis is needed

**Neutral — Slate** (text, borders, surfaces, backgrounds)
- `slate-25 / white` `#FFFFFF` ← cards, page surfaces
- `slate-50` `#F8FAFC` ← app background, subtle section backgrounds
- `slate-100` `#F1F5F9` ← hover backgrounds, dividers-adjacent fill
- `slate-200` `#E2E8F0` ← borders, dividers
- `slate-400` `#94A3B8` ← placeholder text, disabled icons
- `slate-500` `#64748B` ← secondary/body text
- `slate-700` `#334155` ← form labels, medium-emphasis text
- `slate-900` `#0F172A` ← headings, primary text — **also used as a literal dark fill** on the landing page only (see 2.6)

**Semantic (status only — never decorative)**
- Success / Active / Taken → `#10B981` on `#ECFDF5` background, text `#047857`
- Warning / Upcoming / Refill soon → `#F59E0B` on `#FFFBEB` background, text `#B45309`
- Danger / Missed / Inactive / Delete → `#EF4444` on `#FEF2F2` background, text `#B91C1C`
- Info / Scheduled → `#0EA5E9` on `#F0F9FF` background, text `#0369A1`
- Neutral/Cancelled → `#94A3B8` on `#F1F5F9` background, text `#475569`

**Accent — AI Violet** (reserved *only* for the AI Assistant feature, to visually signal "this is the AI area" — do not use elsewhere)
- `#7C3AED` on `#F5F3FF` background, text `#5B21B6`

### 2.2 Typography

- Font family: Inter, or system UI sans-serif (`-apple-system, "Segoe UI", Roboto, sans-serif`)
- Page title (H1): 28–30px / weight 800 / `slate-900` / tight letter-spacing
- Section heading (H2): 16–18px / weight 700 / `slate-900`
- Body: 14–15px / weight 400 / `slate-500` for secondary, `slate-700` for primary
- Label/caption: 12–13px / weight 600 / uppercase / `slate-400` / letter-spacing 0.04em
- Buttons: 14px / weight 600

### 2.3 Shape, Elevation, Spacing

- Corner radius: 12px for cards/modals, 8px for inputs/buttons, full-round (9999px) for pills/badges/avatars
- Card: white surface, `slate-200` 1px border, soft shadow (`0 1px 3px rgba(15,23,42,0.06)`), hover shadow slightly deeper on interactive cards
- Page padding: 24px desktop, 16px mobile
- Section gap: 24px
- Grid gutters: 16–24px

### 2.4 Core Components

- **Primary button**: `primary-600` fill, white text, 8px radius, hover `primary-700`, disabled 50% opacity
- **Secondary/outline button**: white fill, `slate-300` border, `slate-900` text
- **Ghost/danger-text button**: transparent, colored text only (used for "Clear", "Delete")
- **Input field**: white fill, `slate-200` 1.5px border, 8px radius, focus ring `primary-500` at 10% opacity + border `primary-600`
- **Status badge/pill**: rounded-full, colored per semantic table above, small caps text
- **Card**: as described in 2.3, used as the atomic container for every content block (stat, list section, form section)
- **Modal**: centered overlay, dark scrim at 50% opacity, white panel 16px radius, header with title + close (✕), footer-right action buttons
- **Empty state**: centered icon in a soft `primary-50` circle, bold title, muted description, optional primary action button
- **Skeleton loader**: `slate-200` pulse-animated blocks matching the shape of the real content (card outlines, table rows)
- **Sidebar nav item**: icon + label, muted `slate-500` default, `primary-50` background + `primary-600` text when active
- **Table**: `slate-50` header row with uppercase muted labels, `slate-100` row dividers, hover row highlight

### 2.5 Layout Shells

Three distinct shells:

- **Public shell** (landing page only): no sidebar — a fixed, blur-backdrop top nav over full-width stacked sections. See 2.6.
- **User shell**: left sidebar (260px, collapses to a slide-in drawer under 768px) with logo, main nav (Dashboard, Medicines, Reminders, Prescriptions, Appointments, Reports & Insights, Health Timeline, AI Assistant), a divider, then secondary nav (Update Profile, Change Password), and a logout button pinned at the bottom. Top bar has a mobile menu toggle, a notification bell with an unread-count badge, and a circular user avatar.
- **Admin shell**: left sidebar (256px) with logo/"Admin Panel" subtitle, 3 nav items (Dashboard, User Management, Reports), sticky on desktop. Top bar shows the admin's name/email on the left and a logout button on the right — no notification bell.

### 2.6 Landing-Page-Only Surfaces

The public landing page is the one place allowed to break from the plain-white/card look used everywhere else, since it's marketing, not a dashboard:

- **Dark surface**: `slate-900` used as a literal background fill (not just text) for one tall feature card and blended into a gradient for the hero image tile and the bottom CTA banner: `linear-gradient(135deg, #0F172A 0%, #2563EB 100%)`.
- **Colored feature cards**: flat `primary-600` and `primary-700` fills with white text, mixed alongside plain white/bordered cards in the same grid, to create visual rhythm.
- **Floating badge card**: a small white rounded card with a soft shadow, overlapping the hero image, containing a pulsing green status dot + a live-metric label (e.g. "Heart Rate · 72 BPM") — signals "this product tracks real vitals."
- **Auth pages, dashboard, and admin panel must NOT use these dark/gradient surfaces** — they stay strictly on the plain white-card system in 2.3–2.4. This split is intentional: marketing page = expressive, product UI = calm and consistent.

### 2.7 Credential-Form Consistency Rule

Login, Register, Forgot Password, and Reset Password must all share **one identical "auth card" component**: same max-width (440px), same padding, same radius/shadow/border, same field styling, same button styling. Login and Register in particular must render their email/password inputs pixel-identically (same height, border, radius, focus ring, placeholder style, show/hide-password icon) — a user should feel zero visual discontinuity moving between "Login" and "Signup." Only the surrounding content differs (Register adds a hero side-panel, username/gender/confirm-password/terms fields).

---

## 3. Screens (in site-flow order)

Each block below: **Purpose**, **Layout**, **Content/sections**, **States**.

### 3.1 Welcome / Landing Page

**Purpose:** the public, logged-out home page — the first thing any visitor sees; converts visitors into signups. Auto-redirects straight to the Dashboard (or Admin Dashboard) if the visitor is already logged in.
**Layout:** no sidebar. A fixed, blurred/translucent top nav over a tall two-column hero, then five full-width stacked sections, then a footer. Uses the Landing-Page-Only Surfaces from 2.6.
**Content:**
- **Nav**: logo (left), in-page anchor links — Home, How it works, Find a doctor, Testimonials, Services (center, collapses into a hamburger menu on mobile), and Login (outline button) + Signup (solid button) on the right.
- **Hero** (two columns): left — a small uppercase eyebrow label, a large two-line headline with one highlighted word in primary blue, a supporting paragraph, two CTA buttons ("Get Started" solid → Register, "View Services" outline), and a social-proof row (a stack of overlapping circular avatars + "50,000+ users trust MediMate"). Right — a large rounded gradient image placeholder with a floating emoji/illustration, plus an overlapping small white "live metric" badge card (pulsing status dot + "Heart Rate · 72 BPM").
- **Features section**: centered eyebrow + subtitle, then an asymmetric 5-card grid — one tall dark-navy card ("Prescription Vault", with a link and an image block), a solid-blue card ("Smart Reminders"), a white bordered card ("Find Doctors"), another white bordered card ("Vitals Sync"), and a darker-blue card ("24/7 Nurse Chat", with a link). Each card: icon, title, short description.
- **How it works section**: centered eyebrow + subtitle, then 4 equal step cards in a row, each with a numbered circular badge floating above it, an icon, a title, and a short description (Sign Up → Add Medications → Get Reminders → Track Progress).
- **Trust bar**: a thin full-width strip with a centered uppercase label ("Trusted by 50,000+ Caregivers") and 4 inline text-mark "logos" (HealthCore, Vitalis, MediLink, CareNet).
- **Testimonials section**: centered eyebrow + subtitle, then a 3-card grid, each with a quote, an avatar, a name, and a role.
- **CTA banner**: a large rounded dark-to-blue gradient card (decorative soft translucent circles in the background) with a heading, a paragraph, two buttons ("Download for iOS" white-solid, "Download for Android" white-outline), and a row of 3 small trust badges (🔒 HIPAA Compliant, ⭐ 4.9 App Rating, 🛡️ SOC 2 Certified).
- **Footer**: brand name + tagline on the left, 4 link columns (MediMate, Medical Services, Support, Legal), and a bottom bar with a copyright line + 4 more inline links.
**States:** effectively static/marketing — no loading or empty states; the page itself renders nothing and redirects away if the visitor turns out to already be authenticated.

### 3.2 Login

**Purpose:** authenticate an existing user.
**Layout:** centered single "auth card" (per 2.7, max 440px) on a `slate-50` page. Simple top bar above it with the MediMate logo (left) and a "Signup" button (right).
**Content:** "Welcome Back" heading, one-line reassurance about data security, email field, password field (with show/hide toggle), a "Remember me" checkbox + "Forgot password?" link on one row, a full-width primary submit button ("Sign In"), a "Don't have an account? Register" line, and a small "🔒 Secure medical access" reassurance badge at the bottom. A footer below the card with brand name, social icons, and three link columns (Services, Support, Legal) plus a copyright line.
**States:** default; field validation errors (red helper text under each field); submitting (spinner + "Signing In..." inside the button, disabled).
**Consistency note:** email/password fields must match Register's exactly (2.7).

### 3.3 Register (Signup)

**Purpose:** create a new account.
**Layout:** two-column split on desktop (hero image panel on the left, form on the right, using the same "auth card" field styling as Login per 2.7); hero panel hides and form becomes full-width on mobile/tablet. Same top bar style as Login but with "Already have an account? Login" text instead of a button.
**Content:** Left panel — a large rounded illustration placeholder, a short tagline ("Empathetic Care. Precisely Delivered."), and three small feature badges in a row (🔒 Secure Data, 🕐 24/7 Support, ✨ AI Powered). Right panel — "Create your account" heading, fields: Username, Email, Gender (select), Password (show/hide), Confirm Password (show/hide), a Terms-of-Service/Privacy-Policy agreement checkbox with inline links, and a full-width primary submit button ("Create Account →"). Same footer as Login.
**States:** default; per-field validation errors; submitting ("Creating Account...").
**Consistency note:** email/password fields must match Login's exactly (2.7); only the extra fields (username, gender, confirm password, terms) are new.

### 3.4 Forgot Password

**Purpose:** request a password-reset email.
**Layout:** same centered "auth card" shell as Login.
**Content:** "Forgot your password?" heading, explanatory copy, single email field, primary submit button ("Send Reset Link"), "Remembered your password? Login" line.
**States:** default/validation-error/submitting, and a **submitted** state that swaps the whole card for a confirmation message ("Check your email…") with a "Back to login" link.

### 3.5 Reset Password

**Purpose:** set a new password from an emailed link.
**Layout:** same centered "auth card" shell.
**Content:** "Reset your password" heading, New Password field, Confirm New Password field (both with show/hide), primary submit button ("Reset Password"), "Back to login" link.
**States:** default; a red inline banner if the reset token is missing/invalid ("This reset link is invalid… request a new one"), which also disables the submit button; submitting ("Resetting...").

### 3.6 User Dashboard (Home)

**Purpose:** at-a-glance summary of the user's health activity — the first screen after login.
**Layout:** user shell + content area using a vertical stack of card sections.
**Content:** Welcome card with greeting + today's date + a rotating health tip; an overview row of 4 stat cards (e.g. today's medicines, weekly adherence %, upcoming appointments, active prescriptions); a quick-actions row of 4 large tappable cards linking to Medicines / Appointments / Prescriptions / AI Assistant; an upcoming-appointments mini-list (top 3, with a "View All" link); a recent-activity mini-list pulling from the health timeline (icon + title + date per row, "View All" link to the Timeline page); a profile-completion progress bar with a checklist of missing fields.
**States:** skeleton cards while loading; empty-state copy inside any section with no data yet (e.g. "No recent activity yet").

### 3.7 Medicines

**Purpose:** manage the user's medication list and daily adherence.
**Layout:** page header with title + "+ Add Medicine" primary button, then a stacked sequence of sections, then a responsive card grid.
**Content:** "Today's Medicines" section — a horizontal/grid list of today's scheduled doses, each with a "Mark as taken" action; adherence stats cards (weekly adherence %, taken count, streak); a refill-alerts banner/list for medicines running low; a search bar; a filter bar (All / Active / Completed / by frequency); the main medicine grid — each card shows name, dosage, frequency, schedule times, status badge, and Edit/Delete actions; an "Add/Edit Medicine" modal with fields for name, dosage, frequency, times (multi), start/end date, quantity, refill threshold, notes.
**States:** full-page skeleton while loading; empty state with a "+ Add your first medicine" call to action when the list is empty; per-card delete confirmation.

### 3.8 Reminders

**Purpose:** manage recurring medication reminder schedules (title, time, days of week).
**Layout:** page header with title + "+ Add Reminder" button, then a responsive card grid.
**Content:** each reminder card shows a title, a time, and a row of day-of-week pills (Mon–Sun, selected days highlighted); Edit/Delete actions on each card; an "Add/Edit Reminder" modal with a title field, a time picker, and a toggleable 7-day grid of day buttons.
**States:** loading spinner; empty state ("No reminders yet" + "Add Reminder" button); inline form-validation error banner inside the modal.

### 3.9 Prescriptions

**Purpose:** store and track uploaded prescriptions.
**Layout:** page header + search/filter row + responsive card grid (mirrors Medicines).
**Content:** each prescription card: title, doctor name, hospital, prescription date, expiry date (with an "expiring soon"/"expired" badge when relevant), a medicines-covered list, and a link/attachment preview if a file was uploaded; an "Add/Edit Prescription" modal with title, doctor, hospital, prescription date, expiry date, medicines (tag input), notes, and a file upload control; a dedicated prescription detail page reachable from a card.
**States:** skeleton grid while loading; empty state ("No prescriptions yet" + "Upload Prescription"); expiring-soon and expired status badges color-coded per the semantic palette.

### 3.10 Appointments

**Purpose:** schedule and track doctor appointments.
**Layout:** page header with a "+ Schedule Appointment" button; a row with (a) Upcoming/Past tabs showing counts and (b) a List/Calendar view toggle; then either a filterable list or a calendar view.
**Content:** List view — a filter bar (search, status, sort), then appointment cards/rows showing doctor name, specialization, hospital, date/time, purpose, status badge (scheduled/completed/cancelled), a reminder toggle, and Edit/Delete/status-change actions. Calendar view — a month grid with appointments plotted on their date, clickable to open the edit modal. A "Schedule/Edit Appointment" modal with doctor name, specialization, hospital, date, time, purpose, notes, and a reminder-enabled toggle.
**States:** skeleton cards while loading; three distinct empty states (no appointments at all / no upcoming ones / no past ones / no results matching filters).

### 3.11 Reports & Insights (user-facing)

**Purpose:** the user's personal adherence and health analytics.
**Layout:** page header, a filter row (period: daily/weekly, range: 7/30/90 days), then a stacked sequence of report cards.
**Content:** an overview stats row (weekly adherence, active medicines, active prescriptions, upcoming appointments, current streak, member-since date); a bar-chart card for the adherence trend over time; a two-column row with a medicine-wise progress card (per-medicine adherence bars) and a prescriptions summary card (active/expired ratio bar + recent prescriptions list with status badges); an appointments summary card (segmented bar: upcoming/completed/cancelled + a "Next Appointment" highlight).
**States:** full skeleton while loading; a combined empty state when the account has no medicines/prescriptions yet.

### 3.12 Health Timeline

**Purpose:** a single chronological feed of everything that's happened across the app.
**Layout:** page header, a filter row (event-type dropdown + from/to date pickers), then a day-grouped vertical list.
**Content:** events grouped under day headings ("Today", "Yesterday", specific dates); each event row shows a type icon (💊 medicine added, ✅ taken, ⏭️ skipped, ⚠️ missed, 📄 prescription uploaded, 📅 appointment, 💬 AI conversation, 👤 profile updated), a title, an optional description, and a timestamp; rows are clickable through to the relevant page; a "Load more" button at the end for pagination.
**States:** skeleton list while loading; empty state ("Nothing to show yet") when there are no events at all or none match the active filters.

### 3.13 AI Assistant

**Purpose:** chat with an AI about medications/health questions.
**Layout:** page header with a "Clear History" action; below it, a two-column layout — a conversation-history sidebar (grouped Today/Yesterday/Earlier) on the left, and the main chat panel (message list + suggested-prompt chips + input bar) on the right. Sidebar collapses above the chat on mobile.
**Content:** a persistent medical-disclaimer banner near the top; chat bubbles (assistant messages left-aligned in a neutral/light-violet-tinted bubble using the AI accent color, user messages right-aligned in the primary blue); a row of tappable suggested-prompt chips above the input; a text input with a send button, disabled while a reply is in flight (with a typing/sending indicator).
**States:** loading spinner while history loads; an inline retry banner if history fails to load; sending state on the input.

### 3.14 Profile

**Purpose:** manage personal info, medical info, preferences, password, and emergency contacts.
**Layout:** page header, then a long vertical stack of independent card sections, each with its own save button.
**Content:** a profile summary card (avatar, name, email, role); a profile-completion progress bar with a missing-fields checklist; a Personal Information form card (username, email, phone, DOB, gender); a Medical Information form card (blood group, allergies, chronic diseases, height, weight); an Emergency Contacts card — a list of contacts (name, relationship, phone, "Primary" badge) with Edit/Delete per row and a "+ Add Contact" button opening a modal (name, relationship, phone, email, primary toggle); a Preferences form card (dark mode, email notifications, medicine reminders, appointment reminders — all toggles); a Change Password form card (current/new/confirm, all with show/hide).
**States:** full-page skeleton while the initial profile loads; each form section has its own independent "Saving..." submit state.

### 3.15 Change Password (standalone page)

**Purpose:** a focused, single-task password-change screen (separate from the Profile page's password card).
**Layout:** centered single "auth card" shell, matching 2.7.
**Content:** "Change Password" heading, reassurance copy, Current Password / New Password / Confirm New Password fields (all show/hide), full-width primary submit button.
**States:** default; validation errors; submitting ("Updating...").

### 3.16 Admin Dashboard

**Purpose:** system-wide operational snapshot for admins — the first screen after an admin logs in.
**Layout:** admin shell, page header with a "Manage Users" button, a 3×3 responsive stat-card grid, then a single highlight card below.
**Content:** stat cards: Total Users, Active Users, New This Week, Admins, Total Medicines, Active Medicines, Total Prescriptions, Upcoming Appointments, AI Conversations; a highlight card surfacing the inactive-user count with a link into User Management.
**States:** skeleton grid while loading; empty state when there's no user activity yet at all.

### 3.17 Admin — User Management

**Purpose:** browse users, view details, activate/deactivate accounts.
**Layout:** admin shell, page header showing a live total-user count, a search bar, a responsive data table, and pagination controls below it.
**Content:** table columns — Username, Email, Role, Status (badge), Joined date, Actions (View / Activate-Deactivate); a "User Details" modal opened from "View" showing username, email, gender, role, joined date, last-updated date, current status badge, and an Activate/Deactivate button that mirrors the table's inline action.
**States:** skeleton while loading; empty state ("No users found — try a different search term"); Previous/Next pagination buttons disabled at the first/last page.

### 3.18 Admin — Reports Overview

**Purpose:** system-wide trend reporting for admins.
**Layout:** admin shell, page header, a 2×2 stat-card row, a full-width user-growth bar chart card, then a two-column row of segmented-bar summary cards.
**Content:** stat cards — Total Prescriptions, Expiring Soon (30 days), Scheduled Appointments, Active Medicines; an 8-week user-signup bar chart with per-bar counts and week labels; an Appointments card (segmented bar: scheduled/completed/cancelled with counts); a Medicines card (segmented bar: active/completed/inactive with counts).
**States:** skeleton while loading; empty state when there's no system activity yet.

---

## 4. What to fix vs. what to keep

**Keep:** blue as the single brand/primary color (it's already the dominant color everywhere and reads as trustworthy/medical — no need to change the brand color itself); the card-based, sectioned layout pattern; the icon-per-item convention (emoji icons throughout); the landing page's richer marketing visual language (dark/gradient surfaces, colored feature cards) — it's meant to look different from the product, and that's correct.

**Fix:** unify every *product* page (auth, dashboard, admin) onto the one palette/token set in Section 2 instead of each page inventing its own near-identical-but-slightly-different hex values; unify corner radius and shadow depth across pages (currently ranges from flat/no-shadow to heavy drop shadows depending on the page); unify button and form-field sizing/padding across pages; enforce the Section 2.7 rule so Login and Register's credential fields are visually identical instead of two separately-designed forms; give the AI Assistant its one distinct accent color instead of reusing plain blue like every other page; make sure every status badge (medicine/prescription/appointment/user) draws from the same 5-color semantic table instead of each feature area choosing its own status colors; keep the landing page's expressive dark/gradient look strictly confined to the landing page — don't let it bleed into the dashboard or admin panel, and don't flatten the landing page down to match the plain dashboard style either.
