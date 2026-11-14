/**
 * EN labels for the free-text Turkish job titles content writes into `status.job.title` (sprint 3, content agent:
 * ~150 titles showed in Turkish in EN). Keys are the exact content strings (case-sensitive); a title that is not
 * here goes through `enJobFallback` (word map + humanize), so EN never shows a Turkish title. tr.ts › jobTitle
 * (machine ids like `ofis`) is still checked first. Test: test/sprint3.test.ts.
 */
export const JOB_TITLES_EN: Record<string, string> = {
  'Ameliyathane hemşiresi': 'Operating-room nurse', 'Arşiv hemşiresi': 'Records nurse', 'Avukat': 'Lawyer',
  'Birim sorumlusu hekim': 'Head physician of the unit', 'Bölüm başkanı': 'Department head', 'Danışman avukat': 'Counsel',
  'Danışman muhasebeci': 'Consulting accountant', 'Dernek muhasebecisi (yarı zamanlı)': 'Association accountant (part-time)',
  'Emlak danışmanı': 'Real-estate agent', 'Emlak ofisi sahibi': 'Real-estate office owner', 'Eğitim hemşiresi': 'Nurse educator',
  'Eş bölüm başkanı': 'Co-head of department', 'Hemşire': 'Nurse', 'Kafe kasiyeri': 'Café cashier', 'Klinik hemşiresi': 'Clinic nurse',
  'Kıdemli danışman': 'Senior consultant', 'Kıdemli usta (yarı zamanlı)': 'Senior craftsman (part-time)', 'Müşteri destek uzmanı': 'Customer support specialist',
  'Ortak avukat': 'Partner lawyer', 'Poliklinik hemşiresi': 'Outpatient nurse', 'Simülatör Başeğitmeni': 'Head simulator instructor',
  'Sorumlu hemşire': 'Charge nurse', 'Telefon danışmanı': 'Phone advisor', 'Yarı zamanlı hemşire': 'Part-time nurse',
  'Yazılım geliştirici': 'Software developer', 'Yeni alanda giriş seviyesi': 'Entry level, new field', 'Yoğun bakım hemşiresi': 'ICU nurse',
  'Yoğun bakım hemşiresi (gündüz)': 'ICU nurse (days)', 'analist yardımcısı': 'Assistant analyst', 'atölye teknisyeni': 'Workshop technician',
  'bağımsız danışman': 'Independent consultant', "bağımsız düğün DJ'i": 'Independent wedding DJ', 'baş garson': 'Head waiter',
  'blokzincir geliştirici yardımcısı': 'Junior blockchain developer', 'bölge koordinatörü': 'Regional coordinator', 'bölge müdür yardımcısı': 'Deputy regional manager',
  'bölge sorumlusu': 'Area lead', 'danışman (haftada iki gün)': 'Consultant (two days a week)', 'danışman (sözleşmeli)': 'Consultant (contract)',
  'danışman hekim': 'Consultant physician', 'danışman müteahhit': 'Consulting contractor', 'danışman yardımcısı': 'Assistant consultant',
  'depo geçici vardiya': 'Warehouse temp shift', 'depo vardiya amir yardımcısı': 'Assistant warehouse shift supervisor', 'destek uzmanı': 'Support specialist',
  'esnaf, işveren': 'Shop owner, employer', 'eğitim koordinatörü': 'Training coordinator', 'fidanlık görevlisi (yarı zamanlı)': 'Nursery worker (part-time)',
  'filo şefi': 'Fleet chief', 'finans uzmanı': 'Finance specialist', 'gece taksi şoförü': 'Night cab driver', 'geri dönüş programı uzmanı': 'Returnship program specialist',
  'havalimanı şoförü': 'Airport driver', 'idari asistan': 'Administrative assistant', 'içerik editörü': 'Content editor', 'içerik uzmanı': 'Content specialist',
  'iş geliştirme uzmanı': 'Business development specialist', 'junior analist': 'Junior analyst', 'junior tasarımcı': 'Junior designer', 'junior yazılımcı': 'Junior developer',
  'kafe garsonu (kış)': 'Café waiter (winter)', 'kahve dükkânı ortağı': 'Coffee shop partner', 'kalite müdürü': 'Quality manager',
  'karşılama sorumlusu': 'Front-of-house lead', 'kendi bürosu': 'Own practice', 'klinik hekimi': 'Clinic physician', 'kombi servisi sahibi': 'Boiler service owner',
  'koordinatör': 'Coordinator', 'kripto girişimi analisti': 'Crypto startup analyst', 'kripto girişimi stajyeri': 'Crypto startup intern',
  'kurs eğitmeni': 'Course instructor', 'kurumsal koç': 'Corporate coach', 'kıdemli danışman': 'Senior consultant', 'kıdemli ikinci pilot': 'Senior first officer',
  'kıdemli muhasebeci': 'Senior accountant', 'kıdemli operasyon uzmanı': 'Senior operations specialist', 'kıdemli proje yöneticisi': 'Senior project manager',
  'kıdemli uzman': 'Senior specialist', 'kıdemli uzman I': 'Senior specialist I', 'kıdemli veri analisti': 'Senior data analyst',
  'kıdemli yazılımcı': 'Senior developer', 'kıdemli şoför': 'Senior driver', 'kırtasiye tezgâhtarı': 'Stationery clerk', 'lojistik asistanı': 'Logistics assistant',
  'muayenehane ortağı': 'Practice partner', 'müşteri temsilcisi': 'Customer representative', 'ofis asistanı': 'Office assistant',
  'operasyon asistanı': 'Operations assistant', 'operasyon müdürü': 'Operations manager', 'operasyon sorumlusu': 'Operations lead',
  'operasyon uzmanı': 'Operations specialist', 'ortak avukat': 'Partner lawyer', 'pazarlama uzman yardımcısı': 'Assistant marketing specialist',
  'posta odası görevlisi': 'Mailroom clerk', 'proje danışmanı': 'Project consultant', 'proje koordinatörü': 'Project coordinator', 'proje uzmanı': 'Project specialist',
  'rakip şirkette uzman': 'Specialist at a rival firm', 'restoran kuryesi': 'Restaurant courier', 'saatçi çırağı': "Watchmaker's apprentice",
  'salon şefi': 'Floor manager', 'satın alma müdürü': 'Purchasing manager', 'satın alma uzmanı': 'Purchasing specialist', 'satış destek uzmanı': 'Sales support specialist',
  'satış müdürü': 'Sales manager', 'seramik atölyesi çırağı': 'Ceramics studio apprentice', 'serbest danışman': 'Freelance consultant',
  "serbest düğün DJ'i": 'Freelance wedding DJ', 'serbest hayat koçu': 'Freelance life coach', 'serbest yazılımcı': 'Freelance developer',
  'servis ortağı': 'Service partner', 'servis şoförü': 'Shuttle driver', 'süreç uzmanı': 'Process specialist', 'takım yöneticisi': 'Team manager',
  'tedarik danışmanı': 'Supply consultant', 'teknik kurucu ortak': 'Technical co-founder', 'tezgâhtar': 'Shop assistant',
  'uzman ekip lideri': 'Specialist team lead', 'uzman hekim': 'Specialist physician', 'uzman yardımcısı': 'Assistant specialist',
  'vardiya sorumlusu': 'Shift lead', 'veri analisti': 'Data analyst', 'veri analisti yardımcısı': 'Assistant data analyst', 'yarı zamanlı falcı': 'Part-time fortune teller',
  'yarı zamanlı uzman': 'Part-time specialist', 'yarı zamanlı şoför': 'Part-time driver', 'yaz dönemi satış elemanı': 'Summer sales assistant',
  'yazılım destek uzmanı': 'Software support specialist', 'yazılımcı': 'Developer', 'yeni şirkette uzman': 'Specialist at a new firm',
  'yeni şirkette uzman yardımcısı': 'Assistant specialist at a new firm', 'Ön muhasebe elemanı': 'Bookkeeping clerk', 'ön muhasebe elemanı': 'Bookkeeping clerk',
  'Özel hastane hemşiresi': 'Private hospital nurse', 'Özel okul öğretmeni': 'Private school teacher', 'çırak marangoz': 'Apprentice carpenter',
  'özel ders': 'Private tutor', 'ürün uzmanı': 'Product specialist', 'Şirket içi koç': 'In-house coach', 'şef': 'Chef', 'şef yardımcısı': 'Sous-chef',
  'şirket danışman avukatı': 'Company counsel', 'şoför': 'Driver', 'kafe': 'Barista', 'depo': 'Warehouse worker', 'cagri': 'Call center agent',
  'garson': 'Waiter', 'kurye': 'Courier', 'ofis': 'Office Associate', 'ressam': 'Painter', 'stajyer': 'Intern', 'usta': 'Craftsman', 'uzman': 'Specialist',
};

/** Word map for titles new content adds before this table catches up (lower-case Turkish word → English). */
const WORDS: Record<string, string> = {
  'kıdemli': 'senior', 'uzman': 'specialist', 'uzmanı': 'specialist', 'yardımcısı': 'assistant', 'müdürü': 'manager', 'müdür': 'manager', 'danışman': 'consultant',
  'danışmanı': 'consultant', 'yarı': 'part', 'zamanlı': 'time', 'şef': 'chef', 'şefi': 'chief', 'sorumlusu': 'lead', 'koordinatörü': 'coordinator', 'hemşire': 'nurse',
  'hemşiresi': 'nurse', 'öğretmen': 'teacher', 'öğretmeni': 'teacher', 'şoför': 'driver', 'şoförü': 'driver', 'garson': 'waiter', 'avukat': 'lawyer', 'muhasebeci': 'accountant',
  'yazılımcı': 'developer', 'analist': 'analyst', 'analisti': 'analyst', 'ortak': 'partner', 'ortağı': 'partner', 'serbest': 'freelance', 'çırak': 'apprentice', 'çırağı': 'apprentice',
  'satış': 'sales', 'proje': 'project', 'operasyon': 'operations', 'veri': 'data', 'usta': 'craftsman', 'stajyer': 'intern', 'eğitmen': 'instructor', 'eğitmeni': 'instructor',
  'hekim': 'physician', 'hekimi': 'physician', 'sahibi': 'owner', 've': 'and', 'yeni': 'new', 'baş': 'head', 'bölge': 'regional', 'asistanı': 'assistant', 'asistan': 'assistant',
};

/** EN fallback: word by word when every word is known; otherwise the neutral "Employee" (never Turkish on screen). */
export function enJobFallback(title: string): string {
  const words = title.toLocaleLowerCase('tr').split(/\s+/).map((w) => w.replace(/[(),]/g, '')).filter(Boolean);
  if (!words.length || words.some((w) => !WORDS[w] && !/^(i|ii|iii|junior)$/.test(w))) return 'Employee';
  const txt = words.map((w) => WORDS[w] ?? w).join(' ').replace(/\bpart time\b/, 'part-time');
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
