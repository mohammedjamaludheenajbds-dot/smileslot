export type Language = "en" | "ta";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.findDentists": "Find Dentists",
    "nav.treatments": "Treatments",
    "nav.patientPortal": "Patient Portal",
    "nav.doctorPortal": "Doctor Portal",
    "nav.login": "Login",
    "nav.logout": "Logout",

    // Index
    "hero.title1": "Find & Book Your",
    "hero.title2": "Dental Appointment",
    "hero.subtitle": "Discover top-rated dentists in Erode district. Compare treatments, check IDA-fixed costs, and book appointments — all in one place.",
    "hero.search": "Search dentist, treatment, or area...",
    "hero.viewCosts": "View Treatment Costs",
    "hero.patientPortal": "Patient Portal",
    "stats.dentists": "Registered Dentists",
    "stats.reviews": "Patient Reviews",
    "stats.appointments": "Appointments Booked",
    "stats.verified": "IDA Verified Costs",
    "section.topDentists": "Top Dentists in Erode",
    "section.topDentistsDesc": "Verified professionals with IDA-standard pricing",
    "section.viewAll": "View All →",
    "section.areDentist": "Are you a Dentist in Erode?",
    "section.areDentistDesc": "Join our platform to reach more patients, manage appointments, and showcase your expertise.",
    "section.registerClinic": "Register Your Clinic →",

    // Patient Portal
    "portal.title": "Patient Portal",
    "portal.subtitle": "Complete your profile to enable faster appointment booking and better treatment recommendations.",
    "tab.appointments": "Appointments",
    "tab.personal": "Personal",
    "tab.medical": "Medical",
    "tab.dental": "Dental",
    "tab.booking": "Booking",
    "tab.records": "Records",
    "tab.medications": "Medications",
    "tab.reviews": "Reviews",
    "appointments.title": "My Appointments",
    "appointments.noAppointments": "No appointments found",
    "appointments.noBookedYet": "You haven't booked any appointments yet.",
    "appointments.browseDentists": "Browse Dentists",
    "appointments.cancel": "Cancel",
    "appointments.upcoming": "Upcoming",
    "appointments.completed": "Completed",
    "appointments.cancelled": "Cancelled",
    "appointments.all": "All",

    // Personal
    "personal.title": "Personal Information",
    "personal.name": "Full Name *",
    "personal.phone": "Phone Number *",
    "personal.age": "Age *",
    "personal.sex": "Sex *",
    "personal.height": "Height (cm)",
    "personal.weight": "Weight (kg)",
    "personal.email": "Email",
    "personal.select": "Select",

    // Medical
    "medical.title": "Medical History",
    "medical.bodyCondition": "Current Body Condition",
    "medical.pastIllness": "Past Illness History",
    "medical.medications": "Current Medications",
    "medical.socioeconomic": "Socioeconomic Status",

    // Dental
    "dental.title": "Dental History",
    "dental.previousTreatments": "Previous Dental Treatments",
    "dental.history": "Dental History & Concerns",

    // Booking
    "booking.title": "Book Appointment",
    "booking.saveFirst": "Save your profile first, then browse dentists to book an appointment.",
    "booking.howItWorks": "How booking works:",
    "booking.step1": "Complete your patient profile",
    "booking.step2": "Browse dentists and compare treatments",
    "booking.step3": "Click \"Book Appointment\" on any dentist card or profile",
    "booking.step4": "Receive appointment confirmation and reminders",
    "booking.browseDentists": "Browse Dentists & Book",

    // Records
    "records.title": "Medical Records",
    "records.upload": "Upload Record",
    "records.noRecords": "No records uploaded yet",
    "records.noRecordsDesc": "Upload X-rays, prescriptions, and other medical documents here.",
    "records.xray": "X-Ray",
    "records.prescription": "Prescription",
    "records.report": "Report",
    "records.other": "Other",
    "records.delete": "Delete",
    "records.fileName": "File Name",
    "records.type": "Record Type",
    "records.notes": "Notes (optional)",

    // Medications
    "medications.title": "Medication Reminders",
    "medications.add": "Add Medication",
    "medications.noMedications": "No medications added",
    "medications.noMedicationsDesc": "Add your medications to get daily reminders.",
    "medications.name": "Medication Name",
    "medications.dosage": "Dosage",
    "medications.frequency": "Frequency",
    "medications.time": "Reminder Time",
    "medications.daily": "Daily",
    "medications.twiceDaily": "Twice Daily",
    "medications.weekly": "Weekly",
    "medications.asNeeded": "As Needed",
    "medications.active": "Active",
    "medications.delete": "Remove",

    // Video Reviews
    "reviews.title": "Patient Video Reviews",
    "reviews.addReview": "Share Your Experience",
    "reviews.noReviews": "No video reviews yet",
    "reviews.noReviewsDesc": "Be the first to share your dental treatment experience!",
    "reviews.youtubeUrl": "YouTube Video URL",
    "reviews.reviewerName": "Your Name",
    "reviews.treatment": "Treatment Received",
    "reviews.submit": "Submit Review",

    // Buttons
    "btn.save": "Save Patient Profile",
    "btn.bookAppointment": "Book Appointment",
    "btn.whatsapp": "Chat on WhatsApp",

    // Voice
    "voice.listening": "Listening...",
    "voice.click": "Click to speak",
    "voice.notSupported": "Voice not supported in this browser",

    // Language
    "lang.switch": "தமிழ்",

    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact",
    "footer.disclaimer": "Disclaimer",
    "footer.disclaimerText": "Treatment costs are as per Indian Dental Association (IDA) guidelines. Actual costs may vary based on complexity. This platform is for pre-booking only.",
    "footer.copyright": "© 2026 Erode Dental Pre-Booking. All rights reserved.",

    // Reminders
    "reminder.smart": "Smart Reminders",
    "reminder.appointmentSoon": "Appointment coming up!",
    "reminder.medicationDue": "Time to take your medication",
  },
  ta: {
    // Navbar
    "nav.home": "முகப்பு",
    "nav.findDentists": "பல் மருத்துவர்கள்",
    "nav.treatments": "சிகிச்சைகள்",
    "nav.patientPortal": "நோயாளி போர்டல்",
    "nav.doctorPortal": "மருத்துவர் போர்டல்",
    "nav.login": "உள்நுழைக",
    "nav.logout": "வெளியேறு",

    // Index
    "hero.title1": "உங்கள் பல்",
    "hero.title2": "சிகிச்சையை முன்பதிவு செய்யுங்கள்",
    "hero.subtitle": "ஈரோடு மாவட்டத்தின் சிறந்த பல் மருத்துவர்களைக் கண்டறியுங்கள். சிகிச்சைகளை ஒப்பிட்டு, IDA நிலையான செலவுகளைச் சரிபார்த்து, முன்பதிவு செய்யுங்கள்.",
    "hero.search": "மருத்துவர், சிகிச்சை அல்லது பகுதியைத் தேடுங்கள்...",
    "hero.viewCosts": "சிகிச்சை செலவுகள்",
    "hero.patientPortal": "நோயாளி போர்டல்",
    "stats.dentists": "பதிவு செய்யப்பட்ட மருத்துவர்கள்",
    "stats.reviews": "நோயாளி மதிப்பீடுகள்",
    "stats.appointments": "முன்பதிவுகள்",
    "stats.verified": "IDA சரிபார்க்கப்பட்ட செலவுகள்",
    "section.topDentists": "ஈரோட்டின் சிறந்த பல் மருத்துவர்கள்",
    "section.topDentistsDesc": "IDA-தரநிலை விலையுடன் சரிபார்க்கப்பட்ட நிபுணர்கள்",
    "section.viewAll": "அனைத்தையும் காண →",
    "section.areDentist": "நீங்கள் ஈரோட்டில் பல் மருத்துவரா?",
    "section.areDentistDesc": "மேலும் நோயாளிகளைச் சென்றடைய, முன்பதிவுகளை நிர்வகிக்க, உங்கள் நிபுணத்துவத்தைக் காட்ட எங்கள் தளத்தில் சேருங்கள்.",
    "section.registerClinic": "உங்கள் கிளினிக்கைப் பதிவு செய்யுங்கள் →",

    // Patient Portal
    "portal.title": "நோயாளி போர்டல்",
    "portal.subtitle": "வேகமான முன்பதிவு மற்றும் சிறந்த சிகிச்சை பரிந்துரைகளுக்கு உங்கள் சுயவிவரத்தை நிறைவு செய்யுங்கள்.",
    "tab.appointments": "முன்பதிவுகள்",
    "tab.personal": "தனிப்பட்டது",
    "tab.medical": "மருத்துவம்",
    "tab.dental": "பல்",
    "tab.booking": "முன்பதிவு",
    "tab.records": "பதிவுகள்",
    "tab.medications": "மருந்துகள்",
    "tab.reviews": "மதிப்பீடுகள்",
    "appointments.title": "எனது முன்பதிவுகள்",
    "appointments.noAppointments": "முன்பதிவுகள் இல்லை",
    "appointments.noBookedYet": "நீங்கள் இன்னும் எந்த முன்பதிவும் செய்யவில்லை.",
    "appointments.browseDentists": "மருத்துவர்களைக் காண",
    "appointments.cancel": "ரத்து செய்",
    "appointments.upcoming": "வரவுள்ள",
    "appointments.completed": "நிறைவு",
    "appointments.cancelled": "ரத்து செய்யப்பட்டது",
    "appointments.all": "அனைத்தும்",

    // Personal
    "personal.title": "தனிப்பட்ட தகவல்",
    "personal.name": "முழு பெயர் *",
    "personal.phone": "தொலைபேசி எண் *",
    "personal.age": "வயது *",
    "personal.sex": "பாலினம் *",
    "personal.height": "உயரம் (செ.மீ)",
    "personal.weight": "எடை (கி.கி)",
    "personal.email": "மின்னஞ்சல்",
    "personal.select": "தேர்வு செய்யுங்கள்",

    // Medical
    "medical.title": "மருத்துவ வரலாறு",
    "medical.bodyCondition": "தற்போதைய உடல்நிலை",
    "medical.pastIllness": "முந்தைய நோய் வரலாறு",
    "medical.medications": "தற்போதைய மருந்துகள்",
    "medical.socioeconomic": "சமூக-பொருளாதார நிலை",

    // Dental
    "dental.title": "பல் வரலாறு",
    "dental.previousTreatments": "முந்தைய பல் சிகிச்சைகள்",
    "dental.history": "பல் வரலாறு & கவலைகள்",

    // Booking
    "booking.title": "முன்பதிவு செய்",
    "booking.saveFirst": "முதலில் உங்கள் சுயவிவரத்தைச் சேமிக்கவும், பின்னர் மருத்துவர்களைக் காணவும்.",
    "booking.howItWorks": "முன்பதிவு எப்படி செயல்படுகிறது:",
    "booking.step1": "உங்கள் நோயாளி சுயவிவரத்தை நிறைவு செய்யுங்கள்",
    "booking.step2": "மருத்துவர்களை உலாவி சிகிச்சைகளை ஒப்பிடுங்கள்",
    "booking.step3": "எந்த மருத்துவர் கார்டிலும் \"முன்பதிவு செய்\" என்பதைக் கிளிக் செய்யுங்கள்",
    "booking.step4": "முன்பதிவு உறுதிப்படுத்தல் மற்றும் நினைவூட்டல்களைப் பெறுங்கள்",
    "booking.browseDentists": "மருத்துவர்களைக் காணவும் & முன்பதிவு செய்யவும்",

    // Records
    "records.title": "மருத்துவ பதிவுகள்",
    "records.upload": "பதிவை பதிவேற்றவும்",
    "records.noRecords": "பதிவுகள் இன்னும் பதிவேற்றப்படவில்லை",
    "records.noRecordsDesc": "எக்ஸ்-ரே, மருந்து சீட்டு மற்றும் பிற மருத்துவ ஆவணங்களை இங்கே பதிவேற்றவும்.",
    "records.xray": "எக்ஸ்-ரே",
    "records.prescription": "மருந்து சீட்டு",
    "records.report": "அறிக்கை",
    "records.other": "பிற",
    "records.delete": "நீக்கு",
    "records.fileName": "கோப்பு பெயர்",
    "records.type": "பதிவு வகை",
    "records.notes": "குறிப்புகள் (விருப்பம்)",

    // Medications
    "medications.title": "மருந்து நினைவூட்டல்கள்",
    "medications.add": "மருந்து சேர்",
    "medications.noMedications": "மருந்துகள் சேர்க்கப்படவில்லை",
    "medications.noMedicationsDesc": "தினசரி நினைவூட்டல்களைப் பெற உங்கள் மருந்துகளைச் சேர்க்கவும்.",
    "medications.name": "மருந்து பெயர்",
    "medications.dosage": "அளவு",
    "medications.frequency": "அதிர்வெண்",
    "medications.time": "நினைவூட்டல் நேரம்",
    "medications.daily": "தினமும்",
    "medications.twiceDaily": "இரண்டு முறை",
    "medications.weekly": "வாரந்தோறும்",
    "medications.asNeeded": "தேவைப்படும்போது",
    "medications.active": "செயலில்",
    "medications.delete": "நீக்கு",

    // Video Reviews
    "reviews.title": "நோயாளி வீடியோ மதிப்பீடுகள்",
    "reviews.addReview": "உங்கள் அனுபவத்தைப் பகிரவும்",
    "reviews.noReviews": "வீடியோ மதிப்பீடுகள் இல்லை",
    "reviews.noReviewsDesc": "உங்கள் பல் சிகிச்சை அனுபவத்தைப் பகிரும் முதல் நபராக இருங்கள்!",
    "reviews.youtubeUrl": "YouTube வீடியோ URL",
    "reviews.reviewerName": "உங்கள் பெயர்",
    "reviews.treatment": "பெற்ற சிகிச்சை",
    "reviews.submit": "சமர்ப்பிக்கவும்",

    // Buttons
    "btn.save": "நோயாளி சுயவிவரத்தைச் சேமிக்கவும்",
    "btn.bookAppointment": "முன்பதிவு செய்யுங்கள்",
    "btn.whatsapp": "WhatsApp-இல் அரட்டை",

    // Voice
    "voice.listening": "கேட்கிறது...",
    "voice.click": "பேச கிளிக் செய்யவும்",
    "voice.notSupported": "இந்த உலாவியில் குரல் ஆதரவு இல்லை",

    // Language
    "lang.switch": "English",

    // Footer
    "footer.quickLinks": "விரைவு இணைப்புகள்",
    "footer.contact": "தொடர்பு",
    "footer.disclaimer": "மறுப்பு",
    "footer.disclaimerText": "சிகிச்சை செலவுகள் இந்திய பல் மருத்துவ சங்கம் (IDA) வழிகாட்டுதல்களின் படி. உண்மையான செலவுகள் சிக்கலின் அடிப்படையில் மாறுபடலாம்.",
    "footer.copyright": "© 2026 ஈரோடு பல் முன்பதிவு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

    // Reminders
    "reminder.smart": "ஸ்மார்ட் நினைவூட்டல்கள்",
    "reminder.appointmentSoon": "முன்பதிவு நெருங்குகிறது!",
    "reminder.medicationDue": "மருந்து எடுக்க நேரம்",
  },
};
