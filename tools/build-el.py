#!/usr/bin/env python3
"""Build the Greek pages (el/index.html, el/products.html) from the English ones.

Run from the repository root after any change to index.html or products.html:
    python3 tools/build-el.py
Each English snippet below must still exist in the source; the script stops and
names the snippet if it does not, so a translation is never silently lost.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ---- shared: <head>, paths and language switch ----
COMMON = [
    ('<html lang="en">', '<html lang="el" data-base="../">'),
    ('src="assets/', 'src="../assets/'), ('href="assets/', 'href="../assets/'), ('poster="assets/', 'poster="../assets/'),
    ('href="css/', 'href="../css/'), ('src="js/', 'src="../js/'), ('href="favicon.ico"', 'href="../favicon.ico"'),
    ('<a href="el/" class="lang-switch" hreflang="el" lang="el">ΕΛ</a>', '<a href="../" class="lang-switch" hreflang="en" lang="en">EN</a>'),
    ('<a href="el/products.html" class="lang-switch" hreflang="el" lang="el">ΕΛ</a>', '<a href="../products.html" class="lang-switch" hreflang="en" lang="en">EN</a>'),
    ('<meta property="og:image:alt" content="MAG Nails &amp; Beauty Shop logo" />', '<meta property="og:image:alt" content="Λογότυπο MAG Nails &amp; Beauty Shop" />'),
    ('<meta property="og:site_name"', '<meta property="og:locale" content="el_GR" />\n  <meta property="og:site_name"'),
    ('aria-label="MAG Nails home"', 'aria-label="MAG Nails αρχική"'),
]

INDEX = [
    # SEO: titles, descriptions, schema, FAQ
    ('<title>MAG Nails Rhodes · Nail Salon, Manicure &amp; Permanent Brows</title>', '<title>MAG Nails Ρόδος · Νύχια, Μανικιούρ, Πεντικιούρ &amp; Μόνιμα Φρύδια</title>'),
    ('content="Nail salon in Rhodes Town, Greece. Manicure, gel polish, rubber base, nail art, pedicure, permanent brows, lip blush, lash lift &amp; brow lamination. Rated 5/5. Book online."', 'content="Κέντρο νυχιών και ομορφιάς στη Ρόδο. Μανικιούρ, ημιμόνιμο, rubber base, nail art, πεντικιούρ, μόνιμα φρύδια, ημιμόνιμο χειλιών, lash lift &amp; brow lamination. 5/5 κριτικές. Κλείστε online."'),
    ('<meta property="og:title" content="MAG Nails &amp; Beauty Shop · Nail Salon in Rhodes" />', '<meta property="og:title" content="MAG Nails &amp; Beauty Shop · Νύχια στη Ρόδο" />'),
    ('<meta name="geo.placename" content="Rhodes" />', '<meta name="geo.placename" content="Ρόδος" />'),
    ('"description": "Nail salon and beauty shop in Rhodes, Greece: manicure, gel polish, rubber base, nail art, pedicure, permanent brows, semi-permanent lip make-up, lash lift and brow lamination."', '"description": "Κέντρο νυχιών και ομορφιάς στη Ρόδο: μανικιούρ, ημιμόνιμο, rubber base, nail art, πεντικιούρ, μόνιμα φρύδια, ημιμόνιμο μακιγιάζ χειλιών, lash lift και brow lamination."'),
    ('"url": "https://magnails.gr/",', '"url": "https://magnails.gr/el/",'),
    ('<p class="eyebrow hero__eyebrow">Nail &amp; beauty salon · Rhodes</p>', '<p class="eyebrow hero__eyebrow">Νύχια &amp; ομορφιά · Ρόδος</p>'),
    ('Precision manicures, flawless gel and hand-painted nail art in a calm, modern studio in the heart of Rhodes.', 'Μανικιούρ ακριβείας, άψογο ημιμόνιμο και ζωγραφισμένο nail art σε ένα ήρεμο, μοντέρνο studio στην καρδιά της Ρόδου.'),
    ('<p class="eyebrow reveal">FAQ · Nail salon in Rhodes</p>', '<p class="eyebrow reveal">Συχνές ερωτήσεις · Νύχια στη Ρόδο</p>'),
    ('Frequently asked <em>questions</em></h2>', 'Συχνές <em>ερωτήσεις</em></h2>'),
    ('<li><a href="#faq">FAQ</a></li>', '<li><a href="#faq">Συχνές ερωτήσεις</a></li>'),
    ('Where is MAG Nails in Rhodes?', 'Πού βρίσκεται το MAG Nails στη Ρόδο;'),
    ('MAG Nails and Beauty Shop is a nail and beauty salon at Alexandrou Papadiamanti 4 in Rhodes Town, on the island of Rhodes, Greece.', 'Το MAG Nails and Beauty Shop είναι κέντρο νυχιών και ομορφιάς στην Αλεξάνδρου Παπαδιαμάντη 4, στην πόλη της Ρόδου.'),
    ('Which nail and beauty services do you offer in Rhodes?', 'Ποιες υπηρεσίες νυχιών και ομορφιάς προσφέρετε στη Ρόδο;'),
    ('Manicure, gel polish and rubber base manicure, gel and acrygel nail reinforcement, nail art, pedicure and foot treatments, permanent brows (powder brows), semi-permanent lip make-up, lash lift and tint, brow lamination and waxing.', 'Μανικιούρ, ημιμόνιμο και rubber base, ενίσχυση νυχιών με gel και acrygel, nail art, πεντικιούρ και θεραπείες ποδιών, μόνιμα φρύδια (powder brows), ημιμόνιμο μακιγιάζ χειλιών, lash lift και βαφή βλεφαρίδων, brow lamination και αποτρίχωση.'),
    ('How do I book a nail appointment in Rhodes?', 'Πώς κλείνω ραντεβού για νύχια στη Ρόδο;'),
    ('Book online through Treatwell at any time, day or night. You can also call +30 22410 69344 or send a WhatsApp message to +30 6955 36 9825.', 'Κλείστε online μέσω Treatwell, οποιαδήποτε ώρα, μέρα ή νύχτα. Μπορείτε επίσης να καλέσετε στο 22410 69344 ή να στείλετε μήνυμα στο WhatsApp στο 6955 36 9825.'),
    ('Do you do permanent make-up for brows and lips in Rhodes?', 'Κάνετε μόνιμο μακιγιάζ φρυδιών και χειλιών στη Ρόδο;'),
    ('Yes. Every permanent brow is designed from scratch to suit your face. We offer powder brows, cover-ups of old brow tattoos and semi-permanent lip blush, with a touch-up after healing.', 'Ναι. Κάθε μόνιμο φρύδι σχεδιάζεται από την αρχή για το πρόσωπό σας. Κάνουμε powder brows, κάλυψη παλιού τατουάζ φρυδιών και ημιμόνιμο μακιγιάζ χειλιών (lip blush), με διόρθωση μετά την επούλωση.'),
    ('Do you offer pedicure and treatments for cracked heels?', 'Κάνετε πεντικιούρ και θεραπεία για σκασμένες φτέρνες;'),
    ('Yes. Our pedicure treatment removes dry skin and cracked heels and leaves your feet soft and hydrated. We also treat ingrown nails, calluses, corns and thickened nails.', 'Ναι. Το θεραπευτικό πεντικιούρ αφαιρεί το ξηρό δέρμα και τις σκασμένες φτέρνες και αφήνει τα πόδια απαλά και ενυδατωμένα. Αντιμετωπίζουμε επίσης νύχια που μπαίνουν στο δέρμα, κάλους, κότσια και παχιά νύχια.'),
    ('What are your opening hours?', 'Ποιο είναι το ωράριο λειτουργίας;'),
    ('Monday to Thursday 09:00 to 20:00, Friday 12:00 to 20:00, Saturday 09:00 to 17:00. Closed on Sunday.', 'Δευτέρα έως Πέμπτη 09:00 έως 20:00, Παρασκευή 12:00 έως 20:00, Σάββατο 09:00 έως 17:00. Κυριακή κλειστά.'),
    ('content="Nails, pedicure, permanent brows, lashes and lips in Rhodes. Book online."', 'content="Νύχια, πεντικιούρ, μόνιμα φρύδια, βλεφαρίδες και χείλη στη Ρόδο. Κλείστε ραντεβού online."'),
    ('<link rel="canonical" href="https://magnails.gr/" />', '<link rel="canonical" href="https://magnails.gr/el/" />'),
    ('<meta property="og:url" content="https://magnails.gr/" />', '<meta property="og:url" content="https://magnails.gr/el/" />'),
    # nav
    ('>Products</a>', '>Προϊόντα</a>'), ('>Services</a>', '>Υπηρεσίες</a>'), ('>Gallery</a>', '>Δουλειές</a>'),
    ('<a href="#pedicure">Pedicure</a>', '<a href="#pedicure">Πεντικιούρ</a>'), ('<a href="#brows">Brows</a>', '<a href="#brows">Φρύδια</a>'),
    ('<a href="#lashes">Lashes</a>', '<a href="#lashes">Βλεφαρίδες</a>'), ('<a href="#lips">Lips</a>', '<a href="#lips">Χείλη</a>'),
    ('<a href="#about">About</a>', '<a href="#about">Εμείς</a>'), ('<a href="#hours">Hours</a>', '<a href="#hours">Ωράριο</a>'),
    ('<a href="#visit">Visit</a>', '<a href="#visit">Επικοινωνία</a>'), ('>Book now</a>', '>Κράτηση</a>'),
    ('aria-label="Open menu"', 'aria-label="Άνοιγμα μενού"'),
    # video hero
    ('aria-label="A look inside the MAG Nails studio"', 'aria-label="Μια ματιά μέσα στο MAG Nails"'),
    ('aria-label="Scroll down"', 'aria-label="Κύλιση προς τα κάτω"'), ('<span class="scroll-down__text">Scroll</span>', '<span class="scroll-down__text">Κύλιση</span>'),
    # products teaser
    ('<p class="eyebrow reveal">Ritzy Nails · Shop</p>', '<p class="eyebrow reveal">Ritzy Nails · Κατάστημα</p>'),
    ('See our <em>products</em></h2>', 'Δείτε τα <em>προϊόντα</em> μας</h2>'),
    ('Builder gels, bases and gel polishes: the same professional products we use in the studio, now available for you.',
     'Builder gel, βάσεις και ημιμόνιμα βερνίκια: τα ίδια επαγγελματικά προϊόντα που χρησιμοποιούμε στο studio, τώρα διαθέσιμα και για εσάς.'),
    ('<span>See our products</span>', '<span>Δείτε τα προϊόντα μας</span>'),
    ('>Visit e-shop ↗</a>', '>Στο e-shop ↗</a>'),
    # intro
    ('Details that <em>speak</em> for you.</h1>', 'Λεπτομέρειες που <em>μιλούν</em> για εσάς.</h1>'),
    ('>Book online</a>', '>Κλείστε online</a>'), ('>See the menu</a>', '>Δείτε τις υπηρεσίες</a>'),
    ('>Find our products</a>', '>Τα προϊόντα μας</a>'),
    ('aria-label="Book now on Treatwell"', 'aria-label="Κλείστε ραντεβού στο Treatwell"'),
    ('lengthAdjust="spacing">BOOK NOW · NAILS &amp; BEAUTY · BOOK NOW · NAILS &amp; BEAUTY ·</textPath>',
     'lengthAdjust="spacing">ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ · NAILS &amp; BEAUTY · ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ · NAILS &amp; BEAUTY ·</textPath>'),
    # marquee
    ('<span>Manicure</span><i>✦</i><span>Pedicure</span><i>✦</i><span>Gel Polish</span><i>✦</i><span>Nail Art</span><i>✦</i><span>Brows &amp; Lashes</span><i>✦</i><span>Waxing</span><i>✦</i>',
     '<span>Μανικιούρ</span><i>✦</i><span>Πεντικιούρ</span><i>✦</i><span>Ημιμόνιμο</span><i>✦</i><span>Nail Art</span><i>✦</i><span>Φρύδια &amp; Βλεφαρίδες</span><i>✦</i><span>Αποτρίχωση</span><i>✦</i>'),
    # services
    ('>01 — The menu<', '>01 — Υπηρεσίες<'), ('>Our services</h2>', '>Οι υπηρεσίες μας</h2>'),
    ('data-tab="nails">Nails</button>', 'data-tab="nails">Νύχια</button>'), ('data-tab="feet">Pedicure</button>', 'data-tab="feet">Πεντικιούρ</button>'),
    ('data-tab="beauty">Beauty</button>', 'data-tab="beauty">Ομορφιά</button>'),
    ('>Book →</a>', '>Κράτηση →</a>'),
    ('<h3>Manicure</h3><p>Shaping, cuticle care &amp; polish</p>', '<h3>Μανικιούρ</h3><p>Σχήμα, περιποίηση επωνυχίων &amp; βερνίκι</p>'),
    ('<h3>Rubber Base</h3><p>Strong, flexible base for natural nails that lasts</p>', '<h3>Rubber Base</h3><p>Δυνατή, ελαστική βάση για φυσικά νύχια που κρατάει</p>'),
    ('<h3>Gel &amp; Acrygel Reinforcement</h3><p>Extra strength for your natural nails</p>', '<h3>Ενίσχυση με Gel &amp; Acrygel</h3><p>Επιπλέον αντοχή για τα φυσικά σας νύχια</p>'),
    ('<h3>Nail Art</h3><p>French, ombré and custom designs</p>', '<h3>Nail Art</h3><p>French, ombré και σχέδια της επιλογής σας</p>'),
    ("<h3>Gentlemen's Manicure</h3><p>Clean, neat and natural</p>", '<h3>Ανδρικό Μανικιούρ</h3><p>Καθαρό, περιποιημένο και φυσικό</p>'),
    ('<h3>Nail &amp; Gel Removal</h3><p>Gentle removal that protects the natural nail</p>', '<h3>Αφαίρεση Νυχιών &amp; Gel</h3><p>Απαλή αφαίρεση που προστατεύει το φυσικό νύχι</p>'),
    ('<h3>Pedicure with Polish</h3><p>Full foot care finished with your colour</p>', '<h3>Πεντικιούρ με Βερνίκι</h3><p>Πλήρης περιποίηση ποδιών με το χρώμα της επιλογής σας</p>'),
    ('<h3>Pedicure Treatment</h3><p>Deep care for dry skin and cracked heels</p>', '<h3>Θεραπευτικό Πεντικιούρ</h3><p>Βαθιά φροντίδα για ξηρό δέρμα και σκασμένες φτέρνες</p>'),
    ('<h3>Foot Treatments</h3><p>Ingrown nails, calluses, corns, thickened &amp; problem nails</p>', '<h3>Θεραπείες Ποδιών</h3><p>Νύχια που μπαίνουν στο δέρμα, κάλοι, κότσια, παχιά &amp; προβληματικά νύχια</p>'),
    ('<h3>Permanent Brows (Powder Brows)</h3><p>Designed from scratch to suit your face</p>', '<h3>Μόνιμα Φρύδια (Powder Brows)</h3><p>Σχεδιασμένα από την αρχή για το πρόσωπό σας</p>'),
    ('<h3>Brow Tattoo Cover-up</h3><p>A fresh, natural look over an old tattoo</p>', '<h3>Κάλυψη Παλιού Τατουάζ Φρυδιών</h3><p>Φρέσκια, φυσική όψη πάνω από παλιό τατουάζ</p>'),
    ('<h3>Semi-permanent Lip Make-up</h3><p>Lip blush and aquarelle lips, soft natural colour</p>', '<h3>Ημιμόνιμο Μακιγιάζ Χειλιών</h3><p>Lip blush και aquarelle lips, απαλό φυσικό χρώμα</p>'),
    ('<h3>Eyebrow Shaping</h3><p>With wax, tweezers or threading</p>', '<h3>Σχήμα Φρυδιών</h3><p>Με κερί, τσιμπιδάκι ή κλωστή</p>'),
    ('<h3>Brow Lamination</h3><p>Fuller, brushed-up, defined brows</p>', '<h3>Brow Lamination</h3><p>Πιο γεμάτα, χτενισμένα, καλοσχηματισμένα φρύδια</p>'),
    ('<h3>Semi-permanent Brow Tint</h3><p>Colour and definition for your brows</p>', '<h3>Ημιμόνιμη Βαφή Φρυδιών</h3><p>Χρώμα και έμφαση στα φρύδια σας</p>'),
    ('<h3>Lash Lift &amp; Tint</h3><p>A natural curl and colour for your own lashes</p>', '<h3>Lash Lift &amp; Βαφή</h3><p>Φυσική καμπύλη και χρώμα στις δικές σας βλεφαρίδες</p>'),
    ('<h3>Facial Waxing</h3><p>Upper lip and face</p>', '<h3>Αποτρίχωση Προσώπου</h3><p>Πάνω χείλος και πρόσωπο</p>'),
    # our work
    ('>02 — Our work<', '>02 — Οι δουλειές μας<'), ('Made at <em>MAG</em></h2>', 'Φτιαγμένα στο <em>MAG</em></h2>'),
    ('Real nails from our studio. Tap any photo or video to see it up close.', 'Αληθινές δουλειές από το studio μας. Πατήστε μια φωτογραφία ή ένα βίντεο για να το δείτε από κοντά.'),
    # pedicure
    ('>03 — Pedicure<', '>03 — Πεντικιούρ<'), ('Step out <em>smooth</em></h2>', 'Βήματα <em>απαλά</em></h2>'),
    ('<p class="eyebrow reveal">Before &amp; after</p>', '<p class="eyebrow reveal">Πριν &amp; μετά</p>'),
    ('From dry, cracked heels to soft, healthy feet', 'Από σκασμένες φτέρνες σε απαλά, υγιή πόδια'),
    ('Our pedicure takes care of the whole foot: dry skin and cracked heels are gently removed, the skin is smoothed and hydrated, and your nails are shaped and finished with your favourite colour.',
     'Το πεντικιούρ μας φροντίζει ολόκληρο το πόδι: αφαιρούμε απαλά το ξηρό δέρμα και τις σκασμένες φτέρνες, λειαίνουμε και ενυδατώνουμε την επιδερμίδα, και τα νύχια παίρνουν σχήμα και το αγαπημένο σας χρώμα.'),
    ('Drag the bar on the photo to see the difference', 'Σύρετε τη μπάρα στη φωτογραφία για να δείτε τη διαφορά'),
    ('alt="After pedicure: smooth, healthy heels"', 'alt="Μετά το πεντικιούρ: απαλές, υγιείς φτέρνες"'),
    ('alt="Before pedicure: dry, cracked heels"', 'alt="Πριν το πεντικιούρ: ξηρές, σκασμένες φτέρνες"'),
    ('aria-hidden="true">Before</span>', 'aria-hidden="true">Πριν</span>'), ('aria-hidden="true">After</span>', 'aria-hidden="true">Μετά</span>'),
    ('aria-label="Compare before and after: slide left to see more of the result"', 'aria-label="Σύγκριση πριν και μετά: σύρετε αριστερά για να δείτε περισσότερο το αποτέλεσμα"'),
    # brows
    ('>04 — Brows<', '>04 — Φρύδια<'), ('Brows, <em>designed</em> for you</h2>', 'Φρύδια <em>σχεδιασμένα</em> για εσάς</h2>'),
    ('aria-label="Client showing her new permanent brows"', 'aria-label="Πελάτισσα με τα νέα μόνιμα φρύδια της"'),
    ('<p class="eyebrow reveal">Permanent make-up</p>', '<p class="eyebrow reveal">Μόνιμο μακιγιάζ</p>'),
    ('Permanent brows, drawn from scratch', 'Μόνιμα φρύδια, σχεδιασμένα από την αρχή'),
    ('Every permanent brow starts with a design. We measure and draw the shape on your face first, agree on it together, and only then begin, so the result suits your features and looks natural.',
     'Κάθε μόνιμο φρύδι ξεκινά με σχέδιο. Μετράμε και σχεδιάζουμε πρώτα το σχήμα πάνω στο πρόσωπό σας, το συμφωνούμε μαζί και μόνο τότε ξεκινάμε, ώστε το αποτέλεσμα να ταιριάζει στα χαρακτηριστικά σας και να δείχνει φυσικό.'),
    ('<h4>Design</h4><p>The shape is mapped and drawn to fit your face.</p>', '<h4>Σχεδιασμός</h4><p>Το σχήμα μετριέται και σχεδιάζεται για το πρόσωπό σας.</p>'),
    ('<h4>Tattoo</h4><p>Soft powder brows, or a cover-up of an old tattoo.</p>', '<h4>Τατουάζ</h4><p>Απαλά powder brows ή κάλυψη παλιού τατουάζ.</p>'),
    ('<h4>Touch-up</h4><p>Once healed, we perfect the final result.</p>', '<h4>Διόρθωση</h4><p>Μετά την επούλωση, τελειοποιούμε το αποτέλεσμα.</p>'),
    ('aria-label="Filter results"', 'aria-label="Φίλτρο αποτελεσμάτων"'),
    ('aria-pressed="true">All <span', 'aria-pressed="true">Όλα <span'),
    ('aria-pressed="false">Before &amp; after <span', 'aria-pressed="false">Πριν &amp; μετά <span'),
    # lashes
    ('>05 — Lashes<', '>05 — Βλεφαρίδες<'), ('Lashes that <em>lift</em> you</h2>', 'Βλεφαρίδες με <em>άποψη</em></h2>'),
    ('<p class="eyebrow reveal">Lash lift &amp; brow care</p>', '<p class="eyebrow reveal">Lash lift &amp; περιποίηση φρυδιών</p>'),
    ('Your own lashes, beautifully lifted', 'Οι δικές σας βλεφαρίδες, όμορφα ανασηκωμένες'),
    ('No extensions, no glue: a lash lift curls and opens up your natural lashes, and a tint gives them depth. Pair it with brow lamination or shaping for a fresh, groomed look that lasts for weeks.',
     'Χωρίς extensions, χωρίς κόλλα: το lash lift δίνει καμπύλη και ανοίγει τις φυσικές σας βλεφαρίδες, και η βαφή τους δίνει βάθος. Συνδυάστε το με brow lamination ή σχήμα φρυδιών για φρέσκια, περιποιημένη όψη που κρατάει εβδομάδες.'),
    ('<h4>Lash lift &amp; tint</h4><p>A natural curl and darker colour for your own lashes.</p>', '<h4>Lash lift &amp; βαφή</h4><p>Φυσική καμπύλη και πιο σκούρο χρώμα στις βλεφαρίδες σας.</p>'),
    ('<h4>Brow lamination</h4><p>Brushed-up, fuller and perfectly set brows.</p>', '<h4>Brow lamination</h4><p>Χτενισμένα, πιο γεμάτα, τέλεια σχηματισμένα φρύδια.</p>'),
    ('<h4>Brow shaping &amp; tint</h4><p>Clean shape and colour to frame your eyes.</p>', '<h4>Σχήμα &amp; βαφή φρυδιών</h4><p>Καθαρό σχήμα και χρώμα που πλαισιώνουν τα μάτια σας.</p>'),
    ('Wake up beautiful · stay effortlessly natural', 'Ξυπνήστε όμορφες · μείνετε φυσικές'),
    ('aria-label="Lash lift and tint, before and after"', 'aria-label="Lash lift και βαφή, πριν και μετά"'),
    ('aria-label="Filter lash results"', 'aria-label="Φίλτρο αποτελεσμάτων βλεφαρίδων"'),
    ('aria-pressed="false">Brow lamination <span', 'aria-pressed="false">Brow lamination <span'),
    # lips
    ('>06 — Lips<', '>06 — Χείλη<'), ('Lips, <em>softly</em> defined</h2>', 'Χείλη με <em>απαλό</em> χρώμα</h2>'),
    ('<p class="eyebrow reveal">Semi-permanent make-up</p>', '<p class="eyebrow reveal">Ημιμόνιμο μακιγιάζ</p>'),
    ('>Semi-permanent lip make-up</h3>', '>Ημιμόνιμο μακιγιάζ χειλιών</h3>'),
    ('Soft, natural-looking colour and definition for your lips. We choose the shade together and shape it to suit your face, so your lips look fresh every day, without lipstick.',
     'Απαλό, φυσικό χρώμα και περίγραμμα για τα χείλη σας. Επιλέγουμε μαζί την απόχρωση και το σχήμα που ταιριάζει στο πρόσωπό σας, ώστε τα χείλη σας να δείχνουν φρέσκα κάθε μέρα, χωρίς κραγιόν.'),
    ('<h4>Colour</h4><p>We pick the right shade for you, from soft blush to deep red.</p>', '<h4>Χρώμα</h4><p>Διαλέγουμε την απόχρωση που σας ταιριάζει, από απαλό ροζ έως βαθύ κόκκινο.</p>'),
    ('<h4>Shape</h4><p>The lip line is designed and the colour gently applied.</p>', '<h4>Σχήμα</h4><p>Σχεδιάζεται το περίγραμμα και το χρώμα περνάει απαλά.</p>'),
    ('<h4>Heal &amp; refresh</h4><p>The colour softens as it heals and can be refreshed later.</p>', '<h4>Επούλωση &amp; ανανέωση</h4><p>Το χρώμα μαλακώνει με την επούλωση και μπορεί να ανανεωθεί αργότερα.</p>'),
    ('Lip blush · aquarelle lips · lip refresh', 'Lip blush · aquarelle lips · ανανέωση χρώματος'),
    ('aria-label="Close-up of semi-permanent lip colour"', 'aria-label="Κοντινό ημιμόνιμου χρώματος χειλιών"'),
    ('aria-label="Filter lip results"', 'aria-label="Φίλτρο αποτελεσμάτων χειλιών"'),
    ('aria-pressed="false">Healed results <span', 'aria-pressed="false">Μετά την επούλωση <span'),
    # lightbox
    ('aria-label="Our work" hidden', 'aria-label="Οι δουλειές μας" hidden'), ('aria-label="Close"', 'aria-label="Κλείσιμο"'),
    ('aria-label="Previous"', 'aria-label="Προηγούμενο"'), ('aria-label="Next"', 'aria-label="Επόμενο"'),
    # shop banner
    ('aria-label="Online shop"', 'aria-label="Online κατάστημα"'), ('<p class="eyebrow reveal">Shop online</p>', '<p class="eyebrow reveal">Αγορές online</p>'),
    ('The products we <em>love</em>, now for you</h2>', 'Τα προϊόντα που <em>αγαπάμε</em>, τώρα για εσάς</h2>'),
    ('Gel polishes, builder bases and nail care from Ritzy Nails, the same products we use in the studio. Order online and get them delivered.',
     'Ημιμόνιμα βερνίκια, builder βάσεις και περιποίηση νυχιών από τη Ritzy Nails, τα ίδια προϊόντα που χρησιμοποιούμε στο studio. Παραγγείλτε online και τα παραλαμβάνετε στο σπίτι.'),
    ('<span>Visit the e-shop</span>', '<span>Επισκεφθείτε το e-shop</span>'),
    # about
    ('alt="A MAG Nails technician doing a gel manicure in the studio"', 'alt="Τεχνίτρια του MAG Nails κάνει ημιμόνιμο μανικιούρ στο studio"'),
    ('>07 — The studio<', '>07 — Το studio<'), ('Clean lines. <em>Careful</em> hands.</h2>', 'Καθαρές γραμμές. <em>Προσεκτικά</em> χέρια.</h2>'),
    ('At MAG Nails &amp; Beauty Shop we believe great nails are about the details: the perfect shape, a clean cuticle line and colour that lasts. Every appointment starts with a consultation, so you leave with exactly what you came for.',
     'Στο MAG Nails &amp; Beauty Shop πιστεύουμε ότι τα όμορφα νύχια κρύβονται στις λεπτομέρειες: το τέλειο σχήμα, καθαρά επωνύχια και χρώμα που κρατάει. Κάθε ραντεβού ξεκινά με συζήτηση, ώστε να φύγετε με ακριβώς αυτό που θέλατε.'),
    ('Sterilised tools for every client', 'Αποστειρωμένα εργαλεία για κάθε πελάτισσα'), ('Premium gel &amp; polish brands', 'Κορυφαίες μάρκες gel &amp; βερνικιών'),
    ('Custom nail art on request', 'Nail art κατά παραγγελία'), ('Relaxed, friendly atmosphere', 'Χαλαρή, φιλική ατμόσφαιρα'),
    # process
    ('>08 — Your visit<', '>08 — Η επίσκεψή σας<'), ('>How it works</h2>', '>Πώς λειτουργεί</h2>'),
    ('<h3>Book</h3><p>Choose a service and a time that suits you.</p>', '<h3>Κράτηση</h3><p>Διαλέξτε υπηρεσία και ώρα που σας βολεύει.</p>'),
    ('<h3>Consult</h3><p>We talk shape, length and colour together.</p>', '<h3>Συζήτηση</h3><p>Αποφασίζουμε μαζί σχήμα, μήκος και χρώμα.</p>'),
    ('<h3>Relax</h3><p>Sit back while we take care of the details.</p>', '<h3>Χαλάρωση</h3><p>Χαλαρώστε όσο φροντίζουμε τις λεπτομέρειες.</p>'),
    ("<h3>Shine</h3><p>Leave with nails you can't stop looking at.</p>", '<h3>Λάμψη</h3><p>Φύγετε με νύχια που δεν θα σταματάτε να κοιτάτε.</p>'),
    # reviews
    ('>09 — Reviews<', '>09 — Κριτικές<'), ('Loved by our <em>clients</em></h2>', 'Μας αγαπούν οι <em>πελάτες</em> μας</h2>'),
    ('</b> reviews</span>', '</b> κριτικές</span>'),
    # booking
    ('>10 — Appointments<', '>10 — Ραντεβού<'), ('Book your <em>moment</em></h2>', 'Κλείστε τη <em>στιγμή</em> σας</h2>'),
    ('All appointments are booked online through Treatwell. Choose your service, see the available times and book in a few taps, day or night.',
     'Όλα τα ραντεβού κλείνονται online μέσω Treatwell. Διαλέξτε υπηρεσία, δείτε τις διαθέσιμες ώρες και κλείστε με λίγα κλικ, μέρα ή νύχτα.'),
    ('<span>Book online</span>', '<span>Κλείστε online</span>'),
    ('<li><b>1</b>Pick your service</li>', '<li><b>1</b>Διαλέξτε υπηρεσία</li>'), ('<li><b>2</b>Choose a free time slot</li>', '<li><b>2</b>Επιλέξτε ελεύθερη ώρα</li>'),
    ('<li><b>3</b>Done — see you at the studio</li>', '<li><b>3</b>Έτοιμο, τα λέμε στο studio</li>'),
    # hours / visit
    ('>11 — Opening hours<', '>11 — Ωράριο<'), ('When to <em>find us</em></h2>', 'Πότε θα μας <em>βρείτε</em></h2>'),
    ('Rhodes time <b>', 'Ώρα Ρόδου <b>'),
    ('>12 — Find us<', '>12 — Επικοινωνία<'), ('>Come say hello</h2>', '>Ελάτε να μας γνωρίσετε</h2>'),
    ('<h3>Address</h3>', '<h3>Διεύθυνση</h3>'), ('<h3>Contact</h3>', '<h3>Επικοινωνία</h3>'),
    # floating menu
    ('aria-label="Contact and booking"', 'aria-label="Επικοινωνία και κρατήσεις"'),
    ('<span class="fab__label">Follow us on Instagram</span>', '<span class="fab__label">Ακολουθήστε μας στο Instagram</span>'),
    ('<span class="fab__label">Find our products</span>', '<span class="fab__label">Τα προϊόντα μας</span>'),
    ('<span class="fab__label">Book online</span>', '<span class="fab__label">Κλείστε online</span>'),
    ('<span class="fab__label">Message on WhatsApp</span>', '<span class="fab__label">Μήνυμα στο WhatsApp</span>'),
    ('aria-label="Contact us or book an appointment"', 'aria-label="Επικοινωνήστε ή κλείστε ραντεβού"'),
    # google review buttons
    ('<span>Leave us a review</span>', '<span>Γράψτε μας κριτική</span>'),
    ('<p>Been to MAG? We would love to hear from you.</p>', '<p>Ήρθατε στο MAG; Θα χαρούμε πολύ να μας πείτε τη γνώμη σας.</p>'),
    ('<span>Write a Google review</span>', '<span>Γράψτε κριτική στη Google</span>'),
    ('<span>Leave a review</span>', '<span>Γράψτε κριτική</span>'),
    # footer
    ('Nails · Brows · Lashes · Lips · Pedicure ·', 'Νύχια · Φρύδια · Βλεφαρίδες · Χείλη · Πεντικιούρ ·'),
    ('Nails, brows, lashes &amp; semi-permanent make-up in the heart of Rhodes.', 'Νύχια, φρύδια, βλεφαρίδες &amp; ημιμόνιμο μακιγιάζ στην καρδιά της Ρόδου.'),
    ('aria-label="Footer"', 'aria-label="Υποσέλιδο"'), ('<h3>Explore</h3>', '<h3>Εξερευνήστε</h3>'),
    ('<li><a href="#gallery">Our work</a></li>', '<li><a href="#gallery">Οι δουλειές μας</a></li>'),
    ('<li><a href="#reviews">Reviews</a></li>', '<li><a href="#reviews">Κριτικές</a></li>'),
    ('<h3>Visit &amp; contact</h3>', '<h3>Επίσκεψη &amp; επικοινωνία</h3>'), ('<h3>Opening hours</h3>', '<h3>Ωράριο</h3>'),
    ('MAG Nails &amp; Beauty Shop · Rhodes</p>', 'MAG Nails &amp; Beauty Shop · Ρόδος</p>'),
    ('aria-label="Back to top"', 'aria-label="Επιστροφή στην αρχή"'),
]

PRODUCTS = [
    ('<title>Ritzy Nails Products in Rhodes · Builder Gel, Base &amp; Gel Polish · MAG Nails</title>', '<title>Προϊόντα Ritzy Nails στη Ρόδο · Builder Gel, Βάσεις &amp; Ημιμόνιμα · MAG Nails</title>'),
    ('<link rel="canonical" href="https://magnails.gr/products.html" />', '<link rel="canonical" href="https://magnails.gr/el/products.html" />'),
    ('<meta property="og:url" content="https://magnails.gr/products.html" />', '<meta property="og:url" content="https://magnails.gr/el/products.html" />'),
    ('<meta property="og:title" content="Our Products · MAG Nails &amp; Beauty Shop" />', '<meta property="og:title" content="Τα προϊόντα μας · MAG Nails &amp; Beauty Shop" />'),
    ('<a href="index.html" class="pnav__back">← Back to site</a>', '<a href="index.html" class="pnav__back">← Πίσω στο site</a>'),
    ('>Visit e-shop ↗</a>', '>Στο e-shop ↗</a>'),
    ('<p class="eyebrow reveal">Shop online · Professional nail products</p>', '<p class="eyebrow reveal">Αγορές online · Επαγγελματικά προϊόντα νυχιών</p>'),
    ('Our <em>products</em></h1>', 'Τα <em>προϊόντα</em> μας</h1>'),
    ('The builder gels, bases and gel polishes we use every day in the studio. Tap any product to order it from the Ritzy Nails e-shop.',
     'Τα builder gel, οι βάσεις και τα ημιμόνιμα βερνίκια που χρησιμοποιούμε καθημερινά στο studio. Πατήστε σε ένα προϊόν για να το παραγγείλετε από το e-shop της Ritzy Nails.'),
    ('aria-label="Filter products"', 'aria-label="Φίλτρο προϊόντων"'),
    ('aria-pressed="true">All <span', 'aria-pressed="true">Όλα <span'),
    ('aria-pressed="false">Builder gels <span', 'aria-pressed="false">Builder gel <span'),
    ('aria-pressed="false">Bases <span', 'aria-pressed="false">Βάσεις <span'),
    ('aria-pressed="false">Gel polish <span', 'aria-pressed="false">Ημιμόνιμα <span'),
    ('aria-pressed="false">Nail art <span', 'aria-pressed="false">Nail art <span'),
    ('Find your <em>favourites</em></h2>', 'Βρείτε τα <em>αγαπημένα</em> σας</h2>'),
    ('Browse the full Ritzy Nails range, with every colour and size, on the online shop.', 'Δείτε όλη τη σειρά της Ritzy Nails, σε κάθε χρώμα και μέγεθος, στο online κατάστημα.'),
    ('<span>Visit the e-shop</span>', '<span>Επισκεφθείτε το e-shop</span>'),
    ('MAG Nails &amp; Beauty Shop · Rhodes</p>', 'MAG Nails &amp; Beauty Shop · Ρόδος</p>'),
    ('aria-label="Back to top"', 'aria-label="Επιστροφή στην αρχή"'),
]


def build(src, dst, pairs):
    html = (ROOT / src).read_text(encoding="utf-8")
    missing = []
    for en, el in COMMON + pairs:
        if en not in html:
            if (en, el) in COMMON:
                continue  # shared rules only apply where they match
            missing.append(en)
            continue
        html = html.replace(en, el)
    if missing:
        sys.exit(f"{src}: these English snippets were not found (update tools/build-el.py):\n  - " + "\n  - ".join(m[:90] for m in missing))
    out = ROOT / dst
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"wrote {dst}")


build("index.html", "el/index.html", INDEX)
build("products.html", "el/products.html", PRODUCTS)
