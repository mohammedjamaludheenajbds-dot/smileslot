

## Home Consultation — Public Form (No Login Required)

### What We're Building
A publicly accessible Home Consultation page where elderly/handicapped patients (or their family) can submit a request for a dentist home visit. No login or account needed — just fill out the form and submit.

### Database
Create a `home_consultations` table with columns:
- `id` (uuid, PK)
- `name` (text, not null)
- `age` (integer, not null)
- `sex` (text, not null) — Male/Female/Other
- `phone` (text, not null)
- `address` (text, not null)
- `condition` (text, not null) — what they're suffering from
- `treatment_required` (text, not null)
- `status` (text, default 'pending')
- `created_at` (timestamptz, default now())

RLS: Allow anonymous inserts. Allow authenticated doctors to read all rows.

### New Page: `/home-consultation`
- Simple, clean form with all fields above
- Validation via zod
- On submit, inserts into `home_consultations` table and shows success toast
- No login required — publicly accessible

### Routing & Navigation
- Add `/home-consultation` as a public route in `App.tsx`
- Add "Home Consultation" link in Navbar (visible to everyone)

### Dentist Portal Integration
- Add a "Home Requests" tab in `DentistPortal.tsx` showing submitted requests from the database with status badges

### Files to Create/Edit
1. **Migration** — create `home_consultations` table + RLS policies
2. **`src/pages/HomeConsultation.tsx`** — new public form page
3. **`src/App.tsx`** — add route
4. **`src/components/Navbar.tsx`** — add nav link
5. **`src/pages/DentistPortal.tsx`** — add home requests tab
6. **`src/i18n/translations.ts`** — add translation keys

