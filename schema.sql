-- ─────────────────────────────────────────────────────────────────────────────
-- Sunnyday Carers — Supabase schema + seed data
-- Run this entire file in: Supabase dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_homes (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        TEXT NOT NULL,
  street      TEXT,
  suburb      TEXT,
  state       TEXT DEFAULT 'NSW',
  postcode    TEXT,
  phone       TEXT,
  rooms       INTEGER DEFAULT 4,
  manager     TEXT,
  mgr_phone   TEXT,
  sil_model   TEXT DEFAULT 'SIL + CP',
  ratio_day   TEXT DEFAULT '1:2 (shared)',
  ratio_night TEXT DEFAULT 'Sleepover',
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participants (
  id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first           TEXT NOT NULL,
  last            TEXT NOT NULL,
  ndis            TEXT NOT NULL,
  dob             TEXT,
  gender          TEXT,
  disability      TEXT,
  service         TEXT DEFAULT 'sil_cp',
  cp              TEXT DEFAULT 'sunnyday',
  status          TEXT DEFAULT 'onboarding',
  plan_start      TEXT,
  plan_end        TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  guardian        TEXT,
  guardian_rel    TEXT,
  guardian_phone  TEXT,
  lac             TEXT,
  lac_org         TEXT,
  house_id        BIGINT REFERENCES group_homes(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Permissive policies: all roles (anon + authenticated) can read and write.
-- Tighten these once you add authentication.

ALTER TABLE group_homes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_group_homes"  ON group_homes;
DROP POLICY IF EXISTS "public_all_participants" ON participants;

CREATE POLICY "public_all_group_homes"
  ON group_homes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "public_all_participants"
  ON participants FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Seed: Group Homes (31) ────────────────────────────────────────────────────
-- Uses OVERRIDING SYSTEM VALUE so we can specify IDs that participants reference.

INSERT INTO group_homes (id, name, street, suburb, state, postcode, phone, rooms, manager, mgr_phone, sil_model, ratio_day, ratio_night, notes)
OVERRIDING SYSTEM VALUE VALUES
(1,  'Riverside House',      '14 Riverside Dr',     'Parramatta',     'NSW','2150','02 9876 5432',5,'Sandra Cole',   '0411 100 200','SIL + CP','1:2 (shared)','Sleepover',       'Close to bus stop 340. Accessibility ramp at rear entrance.'),
(2,  'Sunflower Cottage',    '27 Wattle St',         'Penrith',        'NSW','2750','02 9123 4567',4,'Tony Marsh',    '0422 200 300','SIL only', '1:2 (shared)','Sleepover',       'Garden beds maintained by participants. Sensory room available.'),
(3,  'Blue Mountains View',  '5 Gum Leaf Rd',        'Katoomba',       'NSW','2780','02 9000 1111',3,'Priya Singh',   '0433 300 400','SIL + CP','1:1 (individual)','Active overnight','High-support house. Close to Katoomba NDIS access point.'),
(4,  'Harbour Heights',      '9 Harbour View Tce',   'Balmain',        'NSW','2041','02 9111 2222',4,'Kenji Tanaka',  '0444 400 500','SIL + CP','1:2 (shared)','Sleepover',       'Near Balmain ferry. Participants attend community activities weekly.'),
(5,  'Ironbark Place',       '31 Ironbark Ave',      'Campbelltown',   'NSW','2560','02 4622 3333',5,'Deborah Yates', '0455 500 600','SIL only', '1:2 (shared)','Sleepover',       'Large backyard. Support workers based on-site weekdays.'),
(6,  'Grevillea Gardens',    '67 Grevillea St',      'Liverpool',      'NSW','2170','02 9601 4444',6,'Mark Evans',    '0466 600 700','SIL + CP','1:3 (shared)','Sleepover',       'Largest house. Good public transport links.'),
(7,  'Palm Beach Villa',     '3 Narrabeen Rd',       'Narrabeen',      'NSW','2101','02 9913 5555',3,'Lisa Ho',       '0477 700 800','SIL + CP','1:1 (individual)','Active overnight','High-support. Beach nearby for leisure activities.'),
(8,  'Wattle Grove',         '44 Wattle St',         'Hornsby',        'NSW','2077','02 9476 6666',4,'Roy Chambers',  '0488 800 900','SIL only', '1:2 (shared)','Sleepover',       'Close to Hornsby Westfield and train station.'),
(9,  'Angophora Court',      '12 Angophora Dr',      'Gordon',         'NSW','2072','02 9499 7777',4,'Karen Smith',   '0499 900 011','SIL + CP','1:2 (shared)','Sleepover',       'Quiet street. Shared common areas recently renovated.'),
(10, 'Lemon Myrtle House',   '20 Lemon Myrtle Ln',  'Epping',         'NSW','2121','02 9869 8888',5,'Frank Russo',   '0411 011 122','SIL + CP','1:2 (shared)','Sleepover',       ''),
(11, 'Rosewood Retreat',     '55 Rosewood Dr',       'Baulkham Hills', 'NSW','2153','02 9686 9999',4,'Angela Park',   '0422 122 233','SIL only', '1:2 (shared)','Sleepover',       'Accessible bathroom in all rooms.'),
(12, 'Banksia House',        '8 Banksia Blvd',       'Sutherland',     'NSW','2232','02 9545 0011',3,'Trevor Blake',  '0433 233 344','SIL + CP','1:2 (shared)','Active overnight','Close to Sutherland train and bus interchange.'),
(13, 'Casuarina Close',      '16 Casuarina Cl',      'Cronulla',       'NSW','2230','02 9523 1122',4,'Wendy Chan',    '0444 344 455','SIL + CP','1:1 (individual)','Sleepover',   'Near beach. Ideal for participants who benefit from sensory coastal environment.'),
(14, 'Frangipani Lodge',     '23 Frangipani St',     'Gosford',        'NSW','2250','02 4324 2233',5,'David Moore',   '0455 455 566','SIL only', '1:2 (shared)','Sleepover',       ''),
(15, 'Tulip House',          '39 Tulip Dr',          'Windsor',        'NSW','2756','02 4577 3344',4,'Susan Bell',    '0466 566 677','SIL + CP','1:2 (shared)','Sleepover',       'Rural setting. Participants involved in gardening programs.'),
(16, 'Paperbark Place',      '7 Paperbark Ave',      'Blacktown',      'NSW','2148','02 9671 4455',6,'James Wu',      '0477 677 788','SIL + CP','1:3 (shared)','Sleepover',       'Largest in region. Wheelchair accessible throughout.'),
(17, 'Kurrajong View',       '52 Kurrajong Rd',      'Wentworthville', 'NSW','2145','02 9896 5566',4,'Yolanda Fox',   '0488 788 899','SIL only', '1:2 (shared)','Sleepover',       ''),
(18, 'Hakea House',          '29 Hakea Ct',          'Castle Hill',    'NSW','2154','02 9894 6677',5,'Paul Nguyen',   '0499 899 011','SIL + CP','1:2 (shared)','Sleepover',       'Close to Hills district bus routes.'),
(19, 'Melaleuca Manor',      '11 Melaleuca Dr',      'Pymble',         'NSW','2073','02 9440 7788',4,'Diana Cross',   '0411 912 123','SIL + CP','1:1 (individual)','Active overnight','High-support. On-site 24/7.'),
(20, 'Waratah Cottage',      '6 Waratah Ave',        'Manly',          'NSW','2095','02 9977 8899',3,'Chris Sato',    '0422 023 134','SIL only', '1:2 (shared)','Sleepover',       'Coastal lifestyle. Accessible kitchen.'),
(21, 'Bottlebrush House',    '48 Bottlebrush Rd',    'Chatswood',      'NSW','2067','02 9411 9900',4,'Emma Lee',      '0433 134 245','SIL + CP','1:2 (shared)','Sleepover',       'Near Chatswood Westfield and train.'),
(22, 'Flannel Flower Villa', '77 Flannel Flower Ct', 'Wollongong',     'NSW','2500','02 4229 0011',5,'Max Okafor',    '0444 245 356','SIL + CP','1:2 (shared)','Sleepover',       ''),
(23, 'Lantana Lodge',        '34 Lantana St',        'Hornsby',        'NSW','2077','02 9476 1122',4,'Sue Park',      '0455 356 467','SIL only', '1:2 (shared)','Sleepover',       ''),
(24, 'Eucalyptus House',     '19 Eucalyptus Pl',     'Parramatta',     'NSW','2150','02 9891 2233',5,'Raj Kumar',     '0466 467 578','SIL + CP','1:2 (shared)','Sleepover',       'Purpose-built accessible home.'),
(25, 'Cherry Blossom House', '61 Cherry Ln',         'Penrith',        'NSW','2750','02 9673 3344',4,'Trish Ford',    '0477 578 689','SIL + CP','1:1 (individual)','Active overnight','Complex support needs house.'),
(26, 'Protea Place',         '15 Protea Rd',         'Gordon',         'NSW','2072','02 9498 4455',4,'Helen Gray',    '0488 689 790','SIL only', '1:2 (shared)','Sleepover',       ''),
(27, 'Cycad Court',          '43 Cycad Ave',         'Campbelltown',   'NSW','2560','02 4625 5566',5,'Bob Simmons',   '0499 790 891','SIL + CP','1:2 (shared)','Sleepover',       'Extensive outdoor space.'),
(28, 'Oleander House',       '28 Oleander Ct',       'Liverpool',      'NSW','2170','02 9608 6677',4,'Anne Walsh',    '0411 891 902','SIL + CP','1:2 (shared)','Sleepover',       ''),
(29, 'Ironbark Terrace',     '9 Ironbark Tce',       'Epping',         'NSW','2121','02 9876 7788',3,'George Pitt',   '0422 902 013','SIL only', '1:2 (shared)','Sleepover',       'Small group, high-familiarity environment.'),
(30, 'Jacaranda House',      '66 Jacaranda Blvd',    'Sutherland',     'NSW','2232','02 9543 8899',5,'Monica Day',    '0433 013 124','SIL + CP','1:2 (shared)','Sleepover',       'Quiet cul-de-sac. Easy access to Sutherland Leisure Centre.'),
(31, 'Acacia Grove',         '18 Acacia St',         'Baulkham Hills', 'NSW','2153','02 9686 9900',4,'Ray Quinn',     '0444 124 235','SIL + CP','1:2 (shared)','Sleepover',       '')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence so next auto-generated ID starts after seed data
SELECT setval(pg_get_serial_sequence('group_homes','id'), COALESCE(MAX(id), 0) + 1, false) FROM group_homes;

-- ── Seed: Participants (86) ───────────────────────────────────────────────────

INSERT INTO participants (id, first, last, ndis, dob, gender, disability, service, cp, status, plan_start, plan_end, phone, email, address, guardian, guardian_rel, guardian_phone, lac, lac_org, house_id)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Liam','Nguyen','43 102 811 234','12 Mar 1988','Male','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0412 345 678','liam.nguyen@email.com','14 Rosewood Dr, Parramatta NSW 2150','Minh Nguyen','Parent','0411 222 333','Jamie Park','ConnectAbility',1),
(2, 'Amelia','Thompson','43 103 922 345','5 Jul 1995','Female','Intellectual Disability','inhome','sunnyday','active','1 Jan 2026','31 Dec 2026','0423 456 789','amelia.t@email.com','27 Sunset Blvd, Penrith NSW 2750','Carol Thompson','Parent','0422 111 000','Sue Harris','LAC Partners',NULL),
(3, 'Noah','Williams','43 104 033 456','22 Nov 1990','Male','Physical / mobility','sil','external','active','1 Apr 2025','31 Mar 2026','0434 567 890','noah.w@email.com','','','','','','',2),
(4, 'Olivia','Brown','43 105 144 567','8 Feb 2000','Female','Psychosocial','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0445 678 901','olivia.brown@email.com','3 Maple St, Blacktown NSW 2148','Peter Brown','Parent','0444 999 888','','',NULL),
(5, 'Ethan','Jones','43 106 255 678','17 Sep 1985','Male','Acquired brain injury','inhome','external','active','1 Feb 2026','31 Jan 2027','0456 789 012','ethan.jones@email.com','91 Kingsway, Cronulla NSW 2230','','','','Anna Lee','Ability First',NULL),
(6, 'Sophia','Martinez','43 107 366 789','3 Apr 1998','Female','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0467 890 123','sophia.m@email.com','','Rosa Martinez','Parent','0466 777 888','Tom Blake','ConnectAbility',3),
(7, 'Mason','Anderson','43 108 477 890','29 Jun 1993','Male','Intellectual Disability','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0478 901 234','mason.a@email.com','55 Park Ave, Liverpool NSW 2170','','','','','',NULL),
(8, 'Isabella','Taylor','43 109 588 901','14 Dec 1987','Female','Sensory (vision/hearing)','inhome','sunnyday','active','1 Aug 2025','31 Jul 2026','0489 012 345','isabella.t@email.com','88 Blue Gum Rd, Hornsby NSW 2077','','','','','',NULL),
(9, 'Lucas','Jackson','43 110 699 012','7 Aug 1991','Male','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0491 123 456','lucas.j@email.com','','Bev Jackson','Parent','0492 111 222','','',4),
(10,'Charlotte','White','43 111 700 123','21 May 1996','Female','Psychosocial','inhome','external','review','1 Sep 2025','31 Aug 2026','0412 234 567','charlotte.w@email.com','12 Wattle Way, Campbelltown NSW 2560','','','','Julie Ng','Open Minds',NULL),
(11,'James','Harris','43 112 811 234','30 Oct 1983','Male','Physical / mobility','sil','external','active','1 Jan 2026','31 Dec 2026','0423 345 678','james.h@email.com','','','','','','',5),
(12,'Mia','Wilson','43 113 922 345','18 Jan 2001','Female','Autism Spectrum Disorder','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0434 456 789','mia.wilson@email.com','7 Cherry Ln, Penrith NSW 2750','Tom Wilson','Parent','0435 888 999','','',NULL),
(13,'Benjamin','Moore','43 114 033 456','9 Mar 1989','Male','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0445 567 890','ben.moore@email.com','','','','','Sam Fox','ConnectAbility',6),
(14,'Ava','Taylor','43 115 144 567','27 Jul 1994','Female','Multiple','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0456 678 901','ava.taylor@email.com','42 Oleander Ct, Blacktown NSW 2148','','','','','',NULL),
(15,'Elijah','Davis','43 116 255 678','4 Nov 1997','Male','Psychosocial','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0467 789 012','elijah.d@email.com','19 Harbour St, Wollongong NSW 2500','','','','','',NULL),
(16,'Harper','Garcia','43 117 366 789','16 Jun 1992','Female','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0478 890 123','harper.g@email.com','','','','','','',7),
(17,'Alexander','Robinson','43 118 477 890','25 Sep 1986','Male','Acquired brain injury','inhome','external','active','1 Apr 2026','31 Mar 2027','0489 901 234','alex.r@email.com','66 Jacaranda Ave, Parramatta NSW 2150','','','','Mel Stone','Ability First',NULL),
(18,'Evelyn','Clark','43 119 588 901','13 Feb 1999','Female','Intellectual Disability','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0491 012 345','evelyn.c@email.com','','Sandra Clark','Parent','0492 555 666','','',8),
(19,'Henry','Rodriguez','43 120 699 012','2 Apr 2002','Male','Physical / mobility','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0412 123 456','henry.r@email.com','34 Blue Mountains Rd, Katoomba NSW 2780','Maria Rodriguez','Parent','0413 777 888','','',NULL),
(20,'Abigail','Lewis','43 121 700 123','20 Aug 1993','Female','Sensory (vision/hearing)','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0423 234 567','abigail.l@email.com','9 Grevillea St, Gordon NSW 2072','','','','','',NULL),
(21,'Daniel','Lee','43 122 811 234','11 Dec 1984','Male','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0434 345 678','daniel.lee@email.com','','','','','','',9),
(22,'Emily','Walker','43 123 922 345','28 Mar 1998','Female','Multiple','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0445 456 789','emily.w@email.com','23 Angophora Cl, Gosford NSW 2250','','','','','',NULL),
(23,'Matthew','Hall','43 124 033 456','6 Oct 1990','Male','Psychosocial','inhome','external','review','1 Nov 2025','31 Oct 2026','0456 567 890','matt.hall@email.com','5 Melaleuca Dr, Penrith NSW 2750','','','','Adam Gray','Open Minds',NULL),
(24,'Elizabeth','Allen','43 125 144 567','19 Jan 1995','Female','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0467 678 901','liz.allen@email.com','','Kay Allen','Parent','0468 333 444','','',10),
(25,'Joseph','Young','43 126 255 678','15 May 1988','Male','Physical / mobility','sil','external','active','1 Jan 2026','31 Dec 2026','0478 789 012','joe.young@email.com','','','','','','',11),
(26,'Samantha','Hernandez','43 127 366 789','3 Jul 2001','Female','Autism Spectrum Disorder','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0489 890 123','sam.h@email.com','77 Tulip St, Campbelltown NSW 2560','Linda Hernandez','Parent','0490 222 333','','',NULL),
(27,'David','King','43 128 477 890','22 Nov 1986','Male','Acquired brain injury','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0491 901 234','david.king@email.com','31 Heron Cres, Sutherland NSW 2232','','','','','',NULL),
(28,'Natalie','Wright','43 129 588 901','10 Apr 1993','Female','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0412 012 345','nat.wright@email.com','','','','','','',12),
(29,'Andrew','Scott','43 130 699 012','1 Aug 1997','Male','Intellectual Disability','sil','sunnyday','active','1 Jul 2025','30 Jun 2026','0423 123 456','andrew.s@email.com','','','','','','',13),
(30,'Grace','Green','43 131 700 123','26 Feb 2000','Female','Sensory (vision/hearing)','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0434 234 567','grace.green@email.com','44 Banksia Tce, Manly NSW 2095','','','','','',NULL),
(31,'Ryan','Adams','43 132 811 234','9 Jun 1989','Male','Psychosocial','inhome','external','active','1 Apr 2026','31 Mar 2027','0445 345 678','ryan.adams@email.com','16 Lemon Myrtle Dr, Pymble NSW 2073','','','','Sue Ko','LAC Partners',NULL),
(32,'Hannah','Baker','43 133 922 345','17 Oct 1994','Female','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0456 456 789','hannah.b@email.com','','','','','','',14),
(33,'Christopher','Nelson','43 134 033 456','5 Jan 1992','Male','Physical / mobility','sil','external','active','1 Jan 2026','31 Dec 2026','0467 567 890','chris.n@email.com','','','','','','',15),
(34,'Lily','Carter','43 135 144 567','24 Mar 1999','Female','Intellectual Disability','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0478 678 901','lily.carter@email.com','62 Kurrajong Ave, Windsor NSW 2756','Dean Carter','Parent','0479 111 222','','',NULL),
(35,'Joshua','Mitchell','43 136 255 678','13 Aug 1987','Male','Acquired brain injury','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0489 789 012','josh.m@email.com','7 Protea Pl, Wentworthville NSW 2145','','','','','',NULL),
(36,'Zoe','Perez','43 137 366 789','2 Nov 1995','Female','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0491 890 123','zoe.perez@email.com','','','','','','',16),
(37,'Dylan','Roberts','43 138 477 890','21 May 1991','Male','Autism Spectrum Disorder','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0412 901 234','dylan.r@email.com','53 Lantana St, Penrith NSW 2750','','','','','',NULL),
(38,'Chloe','Turner','43 139 588 901','8 Jul 1998','Female','Psychosocial','inhome','external','active','1 Mar 2026','28 Feb 2027','0423 012 345','chloe.t@email.com','25 Banksia Ave, Baulkham Hills NSW 2153','','','','Chris Bell','Open Minds',NULL),
(39,'Aaron','Phillips','43 140 699 012','30 Jan 1985','Male','Physical / mobility','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0434 123 456','aaron.p@email.com','','','','','','',17),
(40,'Ella','Campbell','43 141 700 123','19 Sep 2000','Female','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0445 234 567','ella.c@email.com','','Kim Campbell','Parent','0446 444 555','','',18),
(41,'Nathan','Parker','43 142 811 234','7 Apr 1993','Male','Sensory (vision/hearing)','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0456 345 678','nathan.p@email.com','18 Wonga Rd, Chatswood NSW 2067','','','','','',NULL),
(42,'Victoria','Evans','43 143 922 345','25 Dec 1988','Female','Multiple','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0467 456 789','vic.evans@email.com','39 Rosella Ave, Hornsby NSW 2077','','','','','',NULL),
(43,'Jack','Edwards','43 144 033 456','14 Feb 1996','Male','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0478 567 890','jack.e@email.com','','','','','','',19),
(44,'Alyssa','Collins','43 145 144 567','3 Jun 2001','Female','Psychosocial','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0489 678 901','alyssa.c@email.com','85 Greens Ave, Cronulla NSW 2230','Pam Collins','Parent','0490 666 777','','',NULL),
(45,'Brandon','Stewart','43 146 255 678','22 Aug 1984','Male','Intellectual Disability','sil','external','active','1 Jan 2026','31 Dec 2026','0491 789 012','brandon.s@email.com','','','','','','',20),
(46,'Isabelle','Sanchez','43 147 366 789','11 Oct 1997','Female','Physical / mobility','inhome','sunnyday','active','1 Mar 2026','28 Feb 2027','0412 890 123','isabelle.s@email.com','60 Casuarina Dr, Penrith NSW 2750','','','','','',NULL),
(47,'Haseen','Khawaja','43 148 477 890','29 Jan 1990','Male','Autism Spectrum Disorder','sil_cp','sunnyday','onboarding','1 Jun 2026','31 May 2027','0423 901 234','haseen.k@email.com','','','','','','',NULL),
(48,'Trevour','Vernables','43 149 588 901','18 Apr 1991','Male','Intellectual Disability','inhome','sunnyday','onboarding','1 Jun 2026','31 May 2027','0434 012 345','trev.v@email.com','11 Banksia Cl, Blacktown NSW 2148','','','','','',NULL),
(49,'Madison','Morris','43 150 699 012','6 Dec 1994','Female','Multiple','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0445 123 456','madison.m@email.com','30 Frangipani St, Liverpool NSW 2170','','','','','',NULL),
(50,'Tyler','Rogers','43 151 700 123','24 Feb 1987','Male','Psychosocial','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0456 234 567','tyler.r@email.com','','','','','','',21),
(51,'Kaitlyn','Reed','43 152 811 234','13 Jul 1999','Female','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0467 345 678','kaitlyn.r@email.com','','','','','','',22),
(52,'Cameron','Cook','43 153 922 345','2 Oct 1992','Male','Physical / mobility','inhome','external','active','1 Feb 2026','31 Jan 2027','0478 456 789','cam.cook@email.com','48 Acacia Dr, Campbelltown NSW 2560','','','','','',NULL),
(53,'Ashley','Morgan','43 154 033 456','21 May 2000','Female','Intellectual Disability','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0489 567 890','ashley.m@email.com','2 Warataph Ave, Parramatta NSW 2150','','','','','',NULL),
(54,'Jordan','Bell','43 155 144 567','10 Jan 1989','Male','Sensory (vision/hearing)','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0491 678 901','jordan.b@email.com','','','','','','',23),
(55,'Brooke','Murphy','43 156 255 678','28 Aug 1995','Female','Multiple','inhome','sunnyday','active','1 Apr 2026','31 Mar 2027','0412 789 012','brooke.m@email.com','14 Cycad St, Gosford NSW 2250','','','','','',NULL),
(56,'Kyle','Bailey','43 157 366 789','17 Mar 1986','Male','Psychosocial','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0423 890 123','kyle.b@email.com','55 Hakea Ct, Castle Hill NSW 2154','','','','','',NULL),
(57,'Morgan','Rivera','43 158 477 890','5 Oct 1993','Female','Autism Spectrum Disorder','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0434 901 234','morgan.r@email.com','','','','','','',24),
(58,'Spencer','Cooper','43 159 588 901','24 Jan 1998','Male','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0445 012 345','spencer.c@email.com','','','','','','',25),
(59,'Paige','Richardson','43 160 699 012','13 Jun 2001','Female','Physical / mobility','inhome','sunnyday','onboarding','1 Jun 2026','31 May 2027','0456 123 456','paige.r@email.com','8 Grevillea Rd, Sutherland NSW 2232','Fran Richardson','Parent','0457 888 999','','',NULL),
(60,'Blake','Cox','43 161 700 123','2 Nov 1984','Male','Acquired brain injury','day','external','active','1 Apr 2026','31 Mar 2027','0467 234 567','blake.cox@email.com','71 Wattlebird Cres, Epping NSW 2121','','','','Emma Hart','Ability First',NULL),
(61,'Sierra','Howard','43 162 811 234','21 Apr 1990','Female','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0478 345 678','sierra.h@email.com','','','','','','',26),
(62,'Garrett','Ward','43 163 922 345','9 Aug 1996','Male','Psychosocial','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0489 456 789','garrett.w@email.com','37 Bottlebrush Dr, Windsor NSW 2756','','','','','',NULL),
(63,'Lindsey','Torres','43 164 033 456','27 Jan 1993','Female','Autism Spectrum Disorder','sil','external','active','1 Jan 2026','31 Dec 2026','0491 567 890','lindsey.t@email.com','','','','','','',27),
(64,'Marcus','Peterson','43 165 144 567','16 Jun 1987','Male','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0412 678 901','marcus.p@email.com','','','','','','',28),
(65,'Kayla','Gray','43 166 255 678','5 Sep 2000','Female','Physical / mobility','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0423 789 012','kayla.g@email.com','22 Kurrajong Rd, Blacktown NSW 2148','','','','','',NULL),
(66,'Tanner','Ramirez','43 167 366 789','24 Jan 1994','Male','Sensory (vision/hearing)','inhome','sunnyday','active','1 Mar 2026','28 Feb 2027','0434 890 123','tanner.r@email.com','49 Flannel Flower St, Manly NSW 2095','','','','','',NULL),
(67,'Alexis','James','43 168 477 890','13 Apr 1997','Female','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0445 901 234','alexis.j@email.com','','','','','','',29),
(68,'Dustin','Watson','43 169 588 901','2 Aug 1989','Male','Autism Spectrum Disorder','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0456 012 345','dustin.w@email.com','63 She-Oak Ave, Parramatta NSW 2150','','','','','',NULL),
(69,'Brittany','Brooks','43 170 699 012','20 Nov 1991','Female','Psychosocial','inhome','external','review','1 Dec 2025','30 Nov 2026','0467 123 456','brittany.b@email.com','76 Paperbark Cl, Penrith NSW 2750','','','','Nick Ford','Open Minds',NULL),
(70,'Derek','Kelly','43 171 700 123','9 Mar 1985','Male','Physical / mobility','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0478 234 567','derek.k@email.com','','','','','','',30),
(71,'Courtney','Sanders','43 172 811 234','27 Jul 1998','Female','Intellectual Disability','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0489 345 678','courtney.s@email.com','','','','','','',31),
(72,'Trevor','Price','43 173 922 345','16 May 1992','Male','Acquired brain injury','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0491 456 789','trevor.p@email.com','4 Bottlebrush Ave, Hornsby NSW 2077','','','','','',NULL),
(73,'Angela','Bennett','43 174 033 456','5 Jan 1996','Female','Multiple','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0412 567 890','angela.b@email.com','28 Acacia Cl, Liverpool NSW 2170','','','','','',NULL),
(74,'Caleb','Wood','43 175 144 567','24 Sep 1988','Male','Autism Spectrum Disorder','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0423 678 901','caleb.wood@email.com','','','','','','',1),
(75,'Heather','Barnes','43 176 255 678','13 Feb 2001','Female','Psychosocial','inhome','sunnyday','onboarding','1 Jun 2026','31 May 2027','0434 789 012','heather.b@email.com','41 Flannel Flower Ave, Penrith NSW 2750','Greg Barnes','Parent','0435 333 444','','',NULL),
(76,'Seth','Ross','43 177 366 789','1 Jul 1986','Male','Intellectual Disability','sil','external','active','1 Jan 2026','31 Dec 2026','0445 890 123','seth.ross@email.com','','','','','','',2),
(77,'Danielle','Henderson','43 178 477 890','20 Oct 1993','Female','Physical / mobility','day','sunnyday','active','1 Apr 2026','31 Mar 2027','0456 901 234','danielle.h@email.com','15 Eucalyptus Rd, Campbelltown NSW 2560','','','','','',NULL),
(78,'Austin','Coleman','43 179 588 901','8 Apr 1997','Male','Sensory (vision/hearing)','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0467 012 345','austin.c@email.com','','','','','','',3),
(79,'Valerie','Jenkins','43 180 699 012','27 Dec 1990','Female','Multiple','inhome','sunnyday','active','1 Feb 2026','31 Jan 2027','0478 123 456','val.jenkins@email.com','58 Ironbark St, Wollongong NSW 2500','','','','','',NULL),
(80,'Wesley','Perry','43 181 700 123','15 Aug 1994','Male','Autism Spectrum Disorder','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0489 234 567','wes.perry@email.com','33 Grevillea Ct, Epping NSW 2121','','','','','',NULL),
(81,'Natasha','Powell','43 182 811 234','4 Jun 1987','Female','Psychosocial','sil','sunnyday','active','1 Jan 2026','31 Dec 2026','0491 345 678','natasha.p@email.com','','','','','','',4),
(82,'Craig','Long','43 183 922 345','22 Jan 1992','Male','Physical / mobility','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0412 456 789','craig.long@email.com','','','','','','',5),
(83,'Stacey','Patterson','43 184 033 456','11 Apr 1999','Female','Intellectual Disability','day','sunnyday','onboarding','1 Jun 2026','31 May 2027','0423 567 890','stacey.p@email.com','67 Wisteria Ln, Parramatta NSW 2150','Val Patterson','Parent','0424 111 222','','',NULL),
(84,'Gavin','Hughes','43 185 144 567','29 Aug 1985','Male','Acquired brain injury','inhome','external','active','1 Apr 2026','31 Mar 2027','0434 678 901','gavin.h@email.com','50 Angophora Pl, Castle Hill NSW 2154','','','','Rachel Wu','ConnectAbility',NULL),
(85,'Shannon','Flores','43 186 255 678','17 Nov 1996','Female','Multiple','sil_cp','sunnyday','active','1 Jul 2025','30 Jun 2026','0445 789 012','shannon.f@email.com','','','','','','',6),
(86,'Colin','Washington','43 187 366 789','5 Mar 1991','Male','Autism Spectrum Disorder','day','sunnyday','active','1 Mar 2026','28 Feb 2027','0456 890 123','colin.w@email.com','81 Paperbark Ave, Blacktown NSW 2148','','','','','',NULL)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence
SELECT setval(pg_get_serial_sequence('participants','id'), COALESCE(MAX(id), 0) + 1, false) FROM participants;
