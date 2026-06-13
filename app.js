'use strict';

// ── Data stores ──────────────────────────────────────────────────────────────

let editingParticipantId = null;
let currentProfileId = null;
let importedRows = [];
let selectedService = null;
let selectedCP = null;
let obCurrentStep = 1;
let editingHouseId = null;

const participantStore = [
  { id:1,  first:'Liam',       last:'Nguyen',       ndis:'43 102 811 234', dob:'12 Mar 1988', gender:'Male',   disability:'Autism Spectrum Disorder', service:'sil_cp', cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0412 345 678', email:'liam.nguyen@email.com',    address:'14 Rosewood Dr, Parramatta NSW 2150',   guardian:'Minh Nguyen',      guardianRel:'Parent',       guardianPhone:'0411 222 333', lac:'Jamie Park', lacOrg:'ConnectAbility', houseId:1 },
  { id:2,  first:'Amelia',     last:'Thompson',     ndis:'43 103 922 345', dob:'5 Jul 1995',  gender:'Female', disability:'Intellectual Disability',   service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0423 456 789', email:'amelia.t@email.com',        address:'27 Sunset Blvd, Penrith NSW 2750',      guardian:'Carol Thompson',   guardianRel:'Parent',       guardianPhone:'0422 111 000', lac:'Sue Harris',  lacOrg:'LAC Partners',   houseId:null },
  { id:3,  first:'Noah',       last:'Williams',     ndis:'43 104 033 456', dob:'22 Nov 1990', gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'external',  status:'active',     planStart:'1 Apr 2025', planEnd:'31 Mar 2026', phone:'0434 567 890', email:'noah.w@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:2 },
  { id:4,  first:'Olivia',     last:'Brown',        ndis:'43 105 144 567', dob:'8 Feb 2000',  gender:'Female', disability:'Psychosocial',             service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0445 678 901', email:'olivia.brown@email.com',    address:'3 Maple St, Blacktown NSW 2148',         guardian:'Peter Brown',      guardianRel:'Parent',       guardianPhone:'0444 999 888', lac:'',           lacOrg:'',               houseId:null },
  { id:5,  first:'Ethan',      last:'Jones',        ndis:'43 106 255 678', dob:'17 Sep 1985', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'external',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0456 789 012', email:'ethan.jones@email.com',     address:'91 Kingsway, Cronulla NSW 2230',         guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Anna Lee',   lacOrg:'Ability First',  houseId:null },
  { id:6,  first:'Sophia',     last:'Martinez',     ndis:'43 107 366 789', dob:'3 Apr 1998',  gender:'Female', disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0467 890 123', email:'sophia.m@email.com',         address:'',                                       guardian:'Rosa Martinez',    guardianRel:'Parent',       guardianPhone:'0466 777 888', lac:'Tom Blake',  lacOrg:'ConnectAbility', houseId:3 },
  { id:7,  first:'Mason',      last:'Anderson',     ndis:'43 108 477 890', dob:'29 Jun 1993', gender:'Male',   disability:'Intellectual Disability',   service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0478 901 234', email:'mason.a@email.com',          address:'55 Park Ave, Liverpool NSW 2170',        guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:8,  first:'Isabella',   last:'Taylor',       ndis:'43 109 588 901', dob:'14 Dec 1987', gender:'Female', disability:'Sensory (vision/hearing)',  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Aug 2025', planEnd:'31 Jul 2026', phone:'0489 012 345', email:'isabella.t@email.com',       address:'88 Blue Gum Rd, Hornsby NSW 2077',       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:9,  first:'Lucas',      last:'Jackson',      ndis:'43 110 699 012', dob:'7 Aug 1991',  gender:'Male',   disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0491 123 456', email:'lucas.j@email.com',          address:'',                                       guardian:'Bev Jackson',      guardianRel:'Parent',       guardianPhone:'0492 111 222', lac:'',           lacOrg:'',               houseId:4 },
  { id:10, first:'Charlotte',  last:'White',        ndis:'43 111 700 123', dob:'21 May 1996', gender:'Female', disability:'Psychosocial',             service:'inhome',  cp:'external',  status:'review',     planStart:'1 Sep 2025', planEnd:'31 Aug 2026', phone:'0412 234 567', email:'charlotte.w@email.com',      address:'12 Wattle Way, Campbelltown NSW 2560',   guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Julie Ng',   lacOrg:'Open Minds',     houseId:null },
  { id:11, first:'James',      last:'Harris',       ndis:'43 112 811 234', dob:'30 Oct 1983', gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0423 345 678', email:'james.h@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:5 },
  { id:12, first:'Mia',        last:'Wilson',       ndis:'43 113 922 345', dob:'18 Jan 2001', gender:'Female', disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0434 456 789', email:'mia.wilson@email.com',       address:'7 Cherry Ln, Penrith NSW 2750',          guardian:'Tom Wilson',       guardianRel:'Parent',       guardianPhone:'0435 888 999', lac:'',           lacOrg:'',               houseId:null },
  { id:13, first:'Benjamin',   last:'Moore',        ndis:'43 114 033 456', dob:'9 Mar 1989',  gender:'Male',   disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0445 567 890', email:'ben.moore@email.com',         address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Sam Fox',    lacOrg:'ConnectAbility', houseId:6 },
  { id:14, first:'Ava',        last:'Taylor',       ndis:'43 115 144 567', dob:'27 Jul 1994', gender:'Female', disability:'Multiple',                  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0456 678 901', email:'ava.taylor@email.com',        address:'42 Oleander Ct, Blacktown NSW 2148',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:15, first:'Elijah',     last:'Davis',        ndis:'43 116 255 678', dob:'4 Nov 1997',  gender:'Male',   disability:'Psychosocial',             service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0467 789 012', email:'elijah.d@email.com',          address:'19 Harbour St, Wollongong NSW 2500',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:16, first:'Harper',     last:'Garcia',       ndis:'43 117 366 789', dob:'16 Jun 1992', gender:'Female', disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0478 890 123', email:'harper.g@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:7 },
  { id:17, first:'Alexander',  last:'Robinson',     ndis:'43 118 477 890', dob:'25 Sep 1986', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'external',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0489 901 234', email:'alex.r@email.com',            address:'66 Jacaranda Ave, Parramatta NSW 2150',  guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Mel Stone',  lacOrg:'Ability First',  houseId:null },
  { id:18, first:'Evelyn',     last:'Clark',        ndis:'43 119 588 901', dob:'13 Feb 1999', gender:'Female', disability:'Intellectual Disability',   service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0491 012 345', email:'evelyn.c@email.com',          address:'',                                       guardian:'Sandra Clark',     guardianRel:'Parent',       guardianPhone:'0492 555 666', lac:'',           lacOrg:'',               houseId:8 },
  { id:19, first:'Henry',      last:'Rodriguez',    ndis:'43 120 699 012', dob:'2 Apr 2002',  gender:'Male',   disability:'Physical / mobility',       service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0412 123 456', email:'henry.r@email.com',           address:'34 Blue Mountains Rd, Katoomba NSW 2780',guardian:'Maria Rodriguez',  guardianRel:'Parent',       guardianPhone:'0413 777 888', lac:'',           lacOrg:'',               houseId:null },
  { id:20, first:'Abigail',    last:'Lewis',        ndis:'43 121 700 123', dob:'20 Aug 1993', gender:'Female', disability:'Sensory (vision/hearing)',  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0423 234 567', email:'abigail.l@email.com',         address:'9 Grevillea St, Gordon NSW 2072',         guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:21, first:'Daniel',     last:'Lee',          ndis:'43 122 811 234', dob:'11 Dec 1984', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0434 345 678', email:'daniel.lee@email.com',        address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:9 },
  { id:22, first:'Emily',      last:'Walker',       ndis:'43 123 922 345', dob:'28 Mar 1998', gender:'Female', disability:'Multiple',                  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0445 456 789', email:'emily.w@email.com',           address:'23 Angophora Cl, Gosford NSW 2250',       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:23, first:'Matthew',    last:'Hall',         ndis:'43 124 033 456', dob:'6 Oct 1990',  gender:'Male',   disability:'Psychosocial',             service:'inhome',  cp:'external',  status:'review',     planStart:'1 Nov 2025', planEnd:'31 Oct 2026', phone:'0456 567 890', email:'matt.hall@email.com',          address:'5 Melaleuca Dr, Penrith NSW 2750',        guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Adam Gray',  lacOrg:'Open Minds',     houseId:null },
  { id:24, first:'Elizabeth',  last:'Allen',        ndis:'43 125 144 567', dob:'19 Jan 1995', gender:'Female', disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0467 678 901', email:'liz.allen@email.com',          address:'',                                       guardian:'Kay Allen',        guardianRel:'Parent',       guardianPhone:'0468 333 444', lac:'',           lacOrg:'',               houseId:10 },
  { id:25, first:'Joseph',     last:'Young',        ndis:'43 126 255 678', dob:'15 May 1988', gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0478 789 012', email:'joe.young@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:11 },
  { id:26, first:'Samantha',   last:'Hernandez',    ndis:'43 127 366 789', dob:'3 Jul 2001',  gender:'Female', disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0489 890 123', email:'sam.h@email.com',              address:'77 Tulip St, Campbelltown NSW 2560',      guardian:'Linda Hernandez',  guardianRel:'Parent',       guardianPhone:'0490 222 333', lac:'',           lacOrg:'',               houseId:null },
  { id:27, first:'David',      last:'King',         ndis:'43 128 477 890', dob:'22 Nov 1986', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0491 901 234', email:'david.king@email.com',         address:'31 Heron Cres, Sutherland NSW 2232',      guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:28, first:'Natalie',    last:'Wright',       ndis:'43 129 588 901', dob:'10 Apr 1993', gender:'Female', disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0412 012 345', email:'nat.wright@email.com',         address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:12 },
  { id:29, first:'Andrew',     last:'Scott',        ndis:'43 130 699 012', dob:'1 Aug 1997',  gender:'Male',   disability:'Intellectual Disability',   service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0423 123 456', email:'andrew.s@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:13 },
  { id:30, first:'Grace',      last:'Green',        ndis:'43 131 700 123', dob:'26 Feb 2000', gender:'Female', disability:'Sensory (vision/hearing)',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0434 234 567', email:'grace.green@email.com',        address:'44 Banksia Tce, Manly NSW 2095',          guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:31, first:'Ryan',       last:'Adams',        ndis:'43 132 811 234', dob:'9 Jun 1989',  gender:'Male',   disability:'Psychosocial',             service:'inhome',  cp:'external',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0445 345 678', email:'ryan.adams@email.com',         address:'16 Lemon Myrtle Dr, Pymble NSW 2073',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Sue Ko',     lacOrg:'LAC Partners',   houseId:null },
  { id:32, first:'Hannah',     last:'Baker',        ndis:'43 133 922 345', dob:'17 Oct 1994', gender:'Female', disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0456 456 789', email:'hannah.b@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:14 },
  { id:33, first:'Christopher','last':'Nelson',     ndis:'43 134 033 456', dob:'5 Jan 1992',  gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0467 567 890', email:'chris.n@email.com',            address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:15 },
  { id:34, first:'Lily',       last:'Carter',       ndis:'43 135 144 567', dob:'24 Mar 1999', gender:'Female', disability:'Intellectual Disability',   service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0478 678 901', email:'lily.carter@email.com',        address:'62 Kurrajong Ave, Windsor NSW 2756',      guardian:'Dean Carter',      guardianRel:'Parent',       guardianPhone:'0479 111 222', lac:'',           lacOrg:'',               houseId:null },
  { id:35, first:'Joshua',     last:'Mitchell',     ndis:'43 136 255 678', dob:'13 Aug 1987', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0489 789 012', email:'josh.m@email.com',             address:'7 Protea Pl, Wentworthville NSW 2145',   guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:36, first:'Zoe',        last:'Perez',        ndis:'43 137 366 789', dob:'2 Nov 1995',  gender:'Female', disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0491 890 123', email:'zoe.perez@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:16 },
  { id:37, first:'Dylan',      last:'Roberts',      ndis:'43 138 477 890', dob:'21 May 1991', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0412 901 234', email:'dylan.r@email.com',            address:'53 Lantana St, Penrith NSW 2750',         guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:38, first:'Chloe',      last:'Turner',       ndis:'43 139 588 901', dob:'8 Jul 1998',  gender:'Female', disability:'Psychosocial',             service:'inhome',  cp:'external',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0423 012 345', email:'chloe.t@email.com',            address:'25 Banksia Ave, Baulkham Hills NSW 2153', guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Chris Bell', lacOrg:'Open Minds',     houseId:null },
  { id:39, first:'Aaron',      last:'Phillips',     ndis:'43 140 699 012', dob:'30 Jan 1985', gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0434 123 456', email:'aaron.p@email.com',            address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:17 },
  { id:40, first:'Ella',       last:'Campbell',     ndis:'43 141 700 123', dob:'19 Sep 2000', gender:'Female', disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0445 234 567', email:'ella.c@email.com',             address:'',                                       guardian:'Kim Campbell',     guardianRel:'Parent',       guardianPhone:'0446 444 555', lac:'',           lacOrg:'',               houseId:18 },
  { id:41, first:'Nathan',     last:'Parker',       ndis:'43 142 811 234', dob:'7 Apr 1993',  gender:'Male',   disability:'Sensory (vision/hearing)',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0456 345 678', email:'nathan.p@email.com',           address:'18 Wonga Rd, Chatswood NSW 2067',         guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:42, first:'Victoria',   last:'Evans',        ndis:'43 143 922 345', dob:'25 Dec 1988', gender:'Female', disability:'Multiple',                  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0467 456 789', email:'vic.evans@email.com',          address:'39 Rosella Ave, Hornsby NSW 2077',         guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:43, first:'Jack',       last:'Edwards',      ndis:'43 144 033 456', dob:'14 Feb 1996', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0478 567 890', email:'jack.e@email.com',             address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:19 },
  { id:44, first:'Alyssa',     last:'Collins',      ndis:'43 145 144 567', dob:'3 Jun 2001',  gender:'Female', disability:'Psychosocial',             service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0489 678 901', email:'alyssa.c@email.com',           address:'85 Greens Ave, Cronulla NSW 2230',         guardian:'Pam Collins',      guardianRel:'Parent',       guardianPhone:'0490 666 777', lac:'',           lacOrg:'',               houseId:null },
  { id:45, first:'Brandon',    last:'Stewart',      ndis:'43 146 255 678', dob:'22 Aug 1984', gender:'Male',   disability:'Intellectual Disability',   service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0491 789 012', email:'brandon.s@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:20 },
  { id:46, first:'Isabelle',   last:'Sanchez',      ndis:'43 147 366 789', dob:'11 Oct 1997', gender:'Female', disability:'Physical / mobility',       service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0412 890 123', email:'isabelle.s@email.com',         address:'60 Casuarina Dr, Penrith NSW 2750',        guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:47, first:'Haseen',     last:'Khawaja',      ndis:'43 148 477 890', dob:'29 Jan 1990', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0423 901 234', email:'haseen.k@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:48, first:'Trevour',    last:'Vernables',    ndis:'43 149 588 901', dob:'18 Apr 1991', gender:'Male',   disability:'Intellectual Disability',   service:'inhome',  cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0434 012 345', email:'trev.v@email.com',             address:'11 Banksia Cl, Blacktown NSW 2148',       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:49, first:'Madison',    last:'Morris',       ndis:'43 150 699 012', dob:'6 Dec 1994', gender:'Female',  disability:'Multiple',                  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0445 123 456', email:'madison.m@email.com',          address:'30 Frangipani St, Liverpool NSW 2170',    guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:50, first:'Tyler',      last:'Rogers',       ndis:'43 151 700 123', dob:'24 Feb 1987', gender:'Male',   disability:'Psychosocial',             service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0456 234 567', email:'tyler.r@email.com',            address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:21 },
  { id:51, first:'Kaitlyn',    last:'Reed',         ndis:'43 152 811 234', dob:'13 Jul 1999', gender:'Female', disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0467 345 678', email:'kaitlyn.r@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:22 },
  { id:52, first:'Cameron',    last:'Cook',         ndis:'43 153 922 345', dob:'2 Oct 1992',  gender:'Male',   disability:'Physical / mobility',       service:'inhome',  cp:'external',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0478 456 789', email:'cam.cook@email.com',            address:'48 Acacia Dr, Campbelltown NSW 2560',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:53, first:'Ashley',     last:'Morgan',       ndis:'43 154 033 456', dob:'21 May 2000', gender:'Female', disability:'Intellectual Disability',   service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0489 567 890', email:'ashley.m@email.com',           address:'2 Warataph Ave, Parramatta NSW 2150',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:54, first:'Jordan',     last:'Bell',         ndis:'43 155 144 567', dob:'10 Jan 1989', gender:'Male',   disability:'Sensory (vision/hearing)',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0491 678 901', email:'jordan.b@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:23 },
  { id:55, first:'Brooke',     last:'Murphy',       ndis:'43 156 255 678', dob:'28 Aug 1995', gender:'Female', disability:'Multiple',                  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0412 789 012', email:'brooke.m@email.com',           address:'14 Cycad St, Gosford NSW 2250',           guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:56, first:'Kyle',       last:'Bailey',       ndis:'43 157 366 789', dob:'17 Mar 1986', gender:'Male',   disability:'Psychosocial',             service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0423 890 123', email:'kyle.b@email.com',             address:'55 Hakea Ct, Castle Hill NSW 2154',       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:57, first:'Morgan',     last:'Rivera',       ndis:'43 158 477 890', dob:'5 Oct 1993', gender:'Female',  disability:'Autism Spectrum Disorder',  service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0434 901 234', email:'morgan.r@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:24 },
  { id:58, first:'Spencer',    last:'Cooper',       ndis:'43 159 588 901', dob:'24 Jan 1998', gender:'Male',   disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0445 012 345', email:'spencer.c@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:25 },
  { id:59, first:'Paige',      last:'Richardson',   ndis:'43 160 699 012', dob:'13 Jun 2001', gender:'Female', disability:'Physical / mobility',       service:'inhome',  cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0456 123 456', email:'paige.r@email.com',            address:'8 Grevillea Rd, Sutherland NSW 2232',     guardian:'Fran Richardson',  guardianRel:'Parent',       guardianPhone:'0457 888 999', lac:'',           lacOrg:'',               houseId:null },
  { id:60, first:'Blake',      last:'Cox',          ndis:'43 161 700 123', dob:'2 Nov 1984',  gender:'Male',   disability:'Acquired brain injury',     service:'day',     cp:'external',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0467 234 567', email:'blake.cox@email.com',          address:'71 Wattlebird Cres, Epping NSW 2121',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Emma Hart', lacOrg:'Ability First',  houseId:null },
  { id:61, first:'Sierra',     last:'Howard',       ndis:'43 162 811 234', dob:'21 Apr 1990', gender:'Female', disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0478 345 678', email:'sierra.h@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:26 },
  { id:62, first:'Garrett',    last:'Ward',         ndis:'43 163 922 345', dob:'9 Aug 1996',  gender:'Male',   disability:'Psychosocial',             service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0489 456 789', email:'garrett.w@email.com',          address:'37 Bottlebrush Dr, Windsor NSW 2756',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:63, first:'Lindsey',    last:'Torres',       ndis:'43 164 033 456', dob:'27 Jan 1993', gender:'Female', disability:'Autism Spectrum Disorder',  service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0491 567 890', email:'lindsey.t@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:27 },
  { id:64, first:'Marcus',     last:'Peterson',     ndis:'43 165 144 567', dob:'16 Jun 1987', gender:'Male',   disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0412 678 901', email:'marcus.p@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:28 },
  { id:65, first:'Kayla',      last:'Gray',         ndis:'43 166 255 678', dob:'5 Sep 2000',  gender:'Female', disability:'Physical / mobility',       service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0423 789 012', email:'kayla.g@email.com',            address:'22 Kurrajong Rd, Blacktown NSW 2148',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:66, first:'Tanner',     last:'Ramirez',      ndis:'43 167 366 789', dob:'24 Jan 1994', gender:'Male',   disability:'Sensory (vision/hearing)',  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0434 890 123', email:'tanner.r@email.com',           address:'49 Flannel Flower St, Manly NSW 2095',    guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:67, first:'Alexis',     last:'James',        ndis:'43 168 477 890', dob:'13 Apr 1997', gender:'Female', disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0445 901 234', email:'alexis.j@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:29 },
  { id:68, first:'Dustin',     last:'Watson',       ndis:'43 169 588 901', dob:'2 Aug 1989',  gender:'Male',   disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0456 012 345', email:'dustin.w@email.com',           address:'63 She-Oak Ave, Parramatta NSW 2150',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:69, first:'Brittany',   last:'Brooks',       ndis:'43 170 699 012', dob:'20 Nov 1991', gender:'Female', disability:'Psychosocial',             service:'inhome',  cp:'external',  status:'review',     planStart:'1 Dec 2025', planEnd:'30 Nov 2026', phone:'0467 123 456', email:'brittany.b@email.com',         address:'76 Paperbark Cl, Penrith NSW 2750',       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Nick Ford',  lacOrg:'Open Minds',     houseId:null },
  { id:70, first:'Derek',      last:'Kelly',        ndis:'43 171 700 123', dob:'9 Mar 1985',  gender:'Male',   disability:'Physical / mobility',       service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0478 234 567', email:'derek.k@email.com',            address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:30 },
  { id:71, first:'Courtney',   last:'Sanders',      ndis:'43 172 811 234', dob:'27 Jul 1998', gender:'Female', disability:'Intellectual Disability',   service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0489 345 678', email:'courtney.s@email.com',         address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:31 },
  { id:72, first:'Trevor',     last:'Price',        ndis:'43 173 922 345', dob:'16 May 1992', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0491 456 789', email:'trevor.p@email.com',           address:'4 Bottlebrush Ave, Hornsby NSW 2077',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:73, first:'Angela',     last:'Bennett',      ndis:'43 174 033 456', dob:'5 Jan 1996', gender:'Female',  disability:'Multiple',                  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0412 567 890', email:'angela.b@email.com',           address:'28 Acacia Cl, Liverpool NSW 2170',        guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:74, first:'Caleb',      last:'Wood',         ndis:'43 175 144 567', dob:'24 Sep 1988', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0423 678 901', email:'caleb.wood@email.com',         address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:1 },
  { id:75, first:'Heather',    last:'Barnes',       ndis:'43 176 255 678', dob:'13 Feb 2001', gender:'Female', disability:'Psychosocial',             service:'inhome',  cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0434 789 012', email:'heather.b@email.com',          address:'41 Flannel Flower Ave, Penrith NSW 2750', guardian:'Greg Barnes',      guardianRel:'Parent',       guardianPhone:'0435 333 444', lac:'',           lacOrg:'',               houseId:null },
  { id:76, first:'Seth',       last:'Ross',         ndis:'43 177 366 789', dob:'1 Jul 1986',  gender:'Male',   disability:'Intellectual Disability',   service:'sil',     cp:'external',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0445 890 123', email:'seth.ross@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:2 },
  { id:77, first:'Danielle',   last:'Henderson',    ndis:'43 178 477 890', dob:'20 Oct 1993', gender:'Female', disability:'Physical / mobility',       service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0456 901 234', email:'danielle.h@email.com',         address:'15 Eucalyptus Rd, Campbelltown NSW 2560', guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:78, first:'Austin',     last:'Coleman',      ndis:'43 179 588 901', dob:'8 Apr 1997',  gender:'Male',   disability:'Sensory (vision/hearing)',  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0467 012 345', email:'austin.c@email.com',           address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:3 },
  { id:79, first:'Valerie',    last:'Jenkins',      ndis:'43 180 699 012', dob:'27 Dec 1990', gender:'Female', disability:'Multiple',                  service:'inhome',  cp:'sunnyday',  status:'active',     planStart:'1 Feb 2026', planEnd:'31 Jan 2027', phone:'0478 123 456', email:'val.jenkins@email.com',        address:'58 Ironbark St, Wollongong NSW 2500',     guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:80, first:'Wesley',     last:'Perry',        ndis:'43 181 700 123', dob:'15 Aug 1994', gender:'Male',   disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0489 234 567', email:'wes.perry@email.com',          address:'33 Grevillea Ct, Epping NSW 2121',        guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
  { id:81, first:'Natasha',    last:'Powell',       ndis:'43 182 811 234', dob:'4 Jun 1987',  gender:'Female', disability:'Psychosocial',             service:'sil',     cp:'sunnyday',  status:'active',     planStart:'1 Jan 2026', planEnd:'31 Dec 2026', phone:'0491 345 678', email:'natasha.p@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:4 },
  { id:82, first:'Craig',      last:'Long',         ndis:'43 183 922 345', dob:'22 Jan 1992', gender:'Male',   disability:'Physical / mobility',       service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0412 456 789', email:'craig.long@email.com',         address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:5 },
  { id:83, first:'Stacey',     last:'Patterson',    ndis:'43 184 033 456', dob:'11 Apr 1999', gender:'Female', disability:'Intellectual Disability',   service:'day',     cp:'sunnyday',  status:'onboarding', planStart:'1 Jun 2026', planEnd:'31 May 2027', phone:'0423 567 890', email:'stacey.p@email.com',           address:'67 Wisteria Ln, Parramatta NSW 2150',     guardian:'Val Patterson',    guardianRel:'Parent',       guardianPhone:'0424 111 222', lac:'',           lacOrg:'',               houseId:null },
  { id:84, first:'Gavin',      last:'Hughes',       ndis:'43 185 144 567', dob:'29 Aug 1985', gender:'Male',   disability:'Acquired brain injury',     service:'inhome',  cp:'external',  status:'active',     planStart:'1 Apr 2026', planEnd:'31 Mar 2027', phone:'0434 678 901', email:'gavin.h@email.com',            address:'50 Angophora Pl, Castle Hill NSW 2154',   guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'Rachel Wu',  lacOrg:'ConnectAbility', houseId:null },
  { id:85, first:'Shannon',    last:'Flores',       ndis:'43 186 255 678', dob:'17 Nov 1996', gender:'Female', disability:'Multiple',                  service:'sil_cp',  cp:'sunnyday',  status:'active',     planStart:'1 Jul 2025', planEnd:'30 Jun 2026', phone:'0445 789 012', email:'shannon.f@email.com',          address:'',                                       guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:6 },
  { id:86, first:'Colin',      last:'Washington',   ndis:'43 187 366 789', dob:'5 Mar 1991',  gender:'Male',   disability:'Autism Spectrum Disorder',  service:'day',     cp:'sunnyday',  status:'active',     planStart:'1 Mar 2026', planEnd:'28 Feb 2027', phone:'0456 890 123', email:'colin.w@email.com',            address:'81 Paperbark Ave, Blacktown NSW 2148',    guardian:'',                 guardianRel:'',             guardianPhone:'',             lac:'',           lacOrg:'',               houseId:null },
];

const houseData = [
  { id:1,  name:'Riverside House',      street:'14 Riverside Dr',      suburb:'Parramatta',      state:'NSW', postcode:'2150', phone:'02 9876 5432', rooms:5, manager:'Sandra Cole',    mgrPhone:'0411 100 200', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Close to bus stop 340. Accessibility ramp at rear entrance.' },
  { id:2,  name:'Sunflower Cottage',    street:'27 Wattle St',          suburb:'Penrith',         state:'NSW', postcode:'2750', phone:'02 9123 4567', rooms:4, manager:'Tony Marsh',     mgrPhone:'0422 200 300', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Garden beds maintained by participants. Sensory room available.' },
  { id:3,  name:'Blue Mountains View',  street:'5 Gum Leaf Rd',         suburb:'Katoomba',        state:'NSW', postcode:'2780', phone:'02 9000 1111', rooms:3, manager:'Priya Singh',    mgrPhone:'0433 300 400', silModel:'SIL + CP', ratioDay:'1:1 (individual)', ratioNight:'Active overnight', notes:'High-support house. Close to Katoomba NDIS access point.' },
  { id:4,  name:'Harbour Heights',      street:'9 Harbour View Tce',    suburb:'Balmain',         state:'NSW', postcode:'2041', phone:'02 9111 2222', rooms:4, manager:'Kenji Tanaka',   mgrPhone:'0444 400 500', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Near Balmain ferry. Participants attend community activities weekly.' },
  { id:5,  name:'Ironbark Place',       street:'31 Ironbark Ave',        suburb:'Campbelltown',    state:'NSW', postcode:'2560', phone:'02 4622 3333', rooms:5, manager:'Deborah Yates',  mgrPhone:'0455 500 600', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Large backyard. Support workers based on-site weekdays.' },
  { id:6,  name:'Grevillea Gardens',    street:'67 Grevillea St',        suburb:'Liverpool',       state:'NSW', postcode:'2170', phone:'02 9601 4444', rooms:6, manager:'Mark Evans',     mgrPhone:'0466 600 700', silModel:'SIL + CP', ratioDay:'1:3 (shared)', ratioNight:'Sleepover', notes:'Largest house. Good public transport links.' },
  { id:7,  name:'Palm Beach Villa',     street:'3 Narrabeen Rd',         suburb:'Narrabeen',       state:'NSW', postcode:'2101', phone:'02 9913 5555', rooms:3, manager:'Lisa Ho',        mgrPhone:'0477 700 800', silModel:'SIL + CP', ratioDay:'1:1 (individual)', ratioNight:'Active overnight', notes:'High-support. Beach nearby for leisure activities.' },
  { id:8,  name:'Wattle Grove',         street:'44 Wattle St',           suburb:'Hornsby',         state:'NSW', postcode:'2077', phone:'02 9476 6666', rooms:4, manager:'Roy Chambers',   mgrPhone:'0488 800 900', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Close to Hornsby Westfield and train station.' },
  { id:9,  name:'Angophora Court',      street:'12 Angophora Dr',        suburb:'Gordon',          state:'NSW', postcode:'2072', phone:'02 9499 7777', rooms:4, manager:'Karen Smith',    mgrPhone:'0499 900 011', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Quiet street. Shared common areas recently renovated.' },
  { id:10, name:'Lemon Myrtle House',   street:'20 Lemon Myrtle Ln',     suburb:'Epping',          state:'NSW', postcode:'2121', phone:'02 9869 8888', rooms:5, manager:'Frank Russo',    mgrPhone:'0411 011 122', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:11, name:'Rosewood Retreat',     street:'55 Rosewood Dr',         suburb:'Baulkham Hills',  state:'NSW', postcode:'2153', phone:'02 9686 9999', rooms:4, manager:'Angela Park',    mgrPhone:'0422 122 233', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Accessible bathroom in all rooms.' },
  { id:12, name:'Banksia House',        street:'8 Banksia Blvd',         suburb:'Sutherland',      state:'NSW', postcode:'2232', phone:'02 9545 0011', rooms:3, manager:'Trevor Blake',   mgrPhone:'0433 233 344', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Active overnight', notes:'Close to Sutherland train and bus interchange.' },
  { id:13, name:'Casuarina Close',      street:'16 Casuarina Cl',        suburb:'Cronulla',        state:'NSW', postcode:'2230', phone:'02 9523 1122', rooms:4, manager:'Wendy Chan',     mgrPhone:'0444 344 455', silModel:'SIL + CP', ratioDay:'1:1 (individual)', ratioNight:'Sleepover', notes:'Near beach. Ideal for participants who benefit from sensory coastal environment.' },
  { id:14, name:'Frangipani Lodge',     street:'23 Frangipani St',       suburb:'Gosford',         state:'NSW', postcode:'2250', phone:'02 4324 2233', rooms:5, manager:'David Moore',    mgrPhone:'0455 455 566', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:15, name:'Tulip House',          street:'39 Tulip Dr',            suburb:'Windsor',         state:'NSW', postcode:'2756', phone:'02 4577 3344', rooms:4, manager:'Susan Bell',     mgrPhone:'0466 566 677', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Rural setting. Participants involved in gardening programs.' },
  { id:16, name:'Paperbark Place',      street:'7 Paperbark Ave',        suburb:'Blacktown',       state:'NSW', postcode:'2148', phone:'02 9671 4455', rooms:6, manager:'James Wu',       mgrPhone:'0477 677 788', silModel:'SIL + CP', ratioDay:'1:3 (shared)', ratioNight:'Sleepover', notes:'Largest in region. Wheelchair accessible throughout.' },
  { id:17, name:'Kurrajong View',       street:'52 Kurrajong Rd',        suburb:'Wentworthville',  state:'NSW', postcode:'2145', phone:'02 9896 5566', rooms:4, manager:'Yolanda Fox',    mgrPhone:'0488 788 899', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:18, name:'Hakea House',          street:'29 Hakea Ct',            suburb:'Castle Hill',     state:'NSW', postcode:'2154', phone:'02 9894 6677', rooms:5, manager:'Paul Nguyen',    mgrPhone:'0499 899 011', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Close to Hills district bus routes.' },
  { id:19, name:'Melaleuca Manor',      street:'11 Melaleuca Dr',        suburb:'Pymble',          state:'NSW', postcode:'2073', phone:'02 9440 7788', rooms:4, manager:'Diana Cross',    mgrPhone:'0411 912 123', silModel:'SIL + CP', ratioDay:'1:1 (individual)', ratioNight:'Active overnight', notes:'High-support. On-site 24/7.' },
  { id:20, name:'Waratah Cottage',      street:'6 Waratah Ave',          suburb:'Manly',           state:'NSW', postcode:'2095', phone:'02 9977 8899', rooms:3, manager:'Chris Sato',     mgrPhone:'0422 023 134', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Coastal lifestyle. Accessible kitchen.' },
  { id:21, name:'Bottlebrush House',    street:'48 Bottlebrush Rd',      suburb:'Chatswood',       state:'NSW', postcode:'2067', phone:'02 9411 9900', rooms:4, manager:'Emma Lee',       mgrPhone:'0433 134 245', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Near Chatswood Westfield and train.' },
  { id:22, name:'Flannel Flower Villa', street:'77 Flannel Flower Ct',   suburb:'Wollongong',      state:'NSW', postcode:'2500', phone:'02 4229 0011', rooms:5, manager:'Max Okafor',     mgrPhone:'0444 245 356', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:23, name:'Lantana Lodge',        street:'34 Lantana St',          suburb:'Hornsby',         state:'NSW', postcode:'2077', phone:'02 9476 1122', rooms:4, manager:'Sue Park',       mgrPhone:'0455 356 467', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:24, name:'Eucalyptus House',     street:'19 Eucalyptus Pl',       suburb:'Parramatta',      state:'NSW', postcode:'2150', phone:'02 9891 2233', rooms:5, manager:'Raj Kumar',      mgrPhone:'0466 467 578', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Purpose-built accessible home.' },
  { id:25, name:'Cherry Blossom House', street:'61 Cherry Ln',           suburb:'Penrith',         state:'NSW', postcode:'2750', phone:'02 9673 3344', rooms:4, manager:'Trish Ford',     mgrPhone:'0477 578 689', silModel:'SIL + CP', ratioDay:'1:1 (individual)', ratioNight:'Active overnight', notes:'Complex support needs house.' },
  { id:26, name:'Protea Place',         street:'15 Protea Rd',           suburb:'Gordon',          state:'NSW', postcode:'2072', phone:'02 9498 4455', rooms:4, manager:'Helen Gray',     mgrPhone:'0488 689 790', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:27, name:'Cycad Court',          street:'43 Cycad Ave',           suburb:'Campbelltown',    state:'NSW', postcode:'2560', phone:'02 4625 5566', rooms:5, manager:'Bob Simmons',    mgrPhone:'0499 790 891', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Extensive outdoor space.' },
  { id:28, name:'Oleander House',       street:'28 Oleander Ct',         suburb:'Liverpool',       state:'NSW', postcode:'2170', phone:'02 9608 6677', rooms:4, manager:'Anne Walsh',     mgrPhone:'0411 891 902', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
  { id:29, name:'Ironbark Terrace',     street:'9 Ironbark Tce',         suburb:'Epping',          state:'NSW', postcode:'2121', phone:'02 9876 7788', rooms:3, manager:'George Pitt',    mgrPhone:'0422 902 013', silModel:'SIL only',  ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Small group, high-familiarity environment.' },
  { id:30, name:'Jacaranda House',      street:'66 Jacaranda Blvd',      suburb:'Sutherland',      state:'NSW', postcode:'2232', phone:'02 9543 8899', rooms:5, manager:'Monica Day',     mgrPhone:'0433 013 124', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'Quiet cul-de-sac. Easy access to Sutherland Leisure Centre.' },
  { id:31, name:'Acacia Grove',         street:'18 Acacia St',           suburb:'Baulkham Hills',  state:'NSW', postcode:'2153', phone:'02 9686 9900', rooms:4, manager:'Ray Quinn',      mgrPhone:'0444 124 235', silModel:'SIL + CP', ratioDay:'1:2 (shared)', ratioNight:'Sleepover', notes:'' },
];

// ── Navigation ────────────────────────────────────────────────────────────────

function showPage(page) {
  document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.remove('hidden');
  const navMap = { dashboard: 0, participants: 1, onboarding: 2, 'group-homes': 3, 'in-home': 4, 'day-program': 5, compliance: 6, reports: 7 };
  const navItems = document.querySelectorAll('.nav-item');
  const idx = navMap[page];
  if (idx !== undefined && navItems[idx]) navItems[idx].classList.add('active');
  if (page === 'participants') renderParticipants(participantStore);
  if (page === 'group-homes') renderGroupHomes();
  if (page === 'in-home') renderInHome();
  if (page === 'day-program') renderDayProgram();
  if (page === 'dashboard') refreshDashboard();
}

// ── Modal helpers ─────────────────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'saModal') populateSASelect();
  if (id === 'onboardingModal') { obCurrentStep = 1; renderObStep(); }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) backdrop.classList.remove('open');
  });
});

// ── Participant rendering ─────────────────────────────────────────────────────

function avatarColor(name) {
  const colors = [
    ['#EAF2FB','#1A5A9A'],['#E8F5EF','#255C47'],['#FEF3DC','#C17D12'],
    ['#FDEEE9','#E05C3B'],['#F0EBF9','#7B5EA7'],['#F7F8FA','#4A5068']
  ];
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1)||0)) % colors.length;
  return colors[idx];
}

function initials(p) {
  return (p.first[0] + p.last[0]).toUpperCase();
}

function buildServiceBadge(service) {
  const map = {
    sil_cp: ['badge-gold','SIL + CP'],
    sil:    ['badge-sky', 'SIL'],
    inhome: ['badge-sage','In Home'],
    day:    ['badge-lavender','Day Program'],
  };
  const [cls, label] = map[service] || ['badge-gray', service];
  return `<span class="badge ${cls}">${label}</span>`;
}

function buildCPBadge(cp, service) {
  if (service !== 'sil_cp' && service !== 'sil') return '<span style="color:var(--text-3);font-size:12px">—</span>';
  if (cp === 'sunnyday') return '<span class="badge badge-gold">☀️ Sunnyday</span>';
  return '<span class="badge badge-gray">External</span>';
}

function buildStatusBadge(status) {
  const map = {
    active:     `<span class="badge badge-sage"><span class="status-dot dot-active"></span>Active</span>`,
    onboarding: `<span class="badge badge-gold"><span class="status-dot dot-onboarding"></span>Onboarding</span>`,
    review:     `<span class="badge badge-coral"><span class="status-dot dot-review"></span>Plan Review</span>`,
    inactive:   `<span class="badge badge-gray"><span class="status-dot dot-inactive"></span>Inactive</span>`,
  };
  return map[status] || `<span class="badge badge-gray">${status}</span>`;
}

function renderParticipants(list) {
  const tbody = document.getElementById('participantBody');
  tbody.innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div>
          <div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div>
          <div class="participant-ndis">${p.ndis}</div>
        </div>
      </div></td>
      <td style="font-size:12px">${p.dob}</td>
      <td>${buildServiceBadge(p.service)}</td>
      <td>${buildCPBadge(p.cp, p.service)}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td>
        <button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button>
        <button class="btn btn-sm" style="margin-left:4px" onclick="openEditParticipant(${p.id})"><i class="ti ti-edit"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterTable(q) {
  const lower = q.toLowerCase();
  const filtered = participantStore.filter(p =>
    (p.first + ' ' + p.last).toLowerCase().includes(lower) ||
    p.ndis.replace(/\s/g,'').includes(q.replace(/\s/g,''))
  );
  renderParticipants(filtered);
}

let currentServiceFilter = 'all';
function filterService(type, btn) {
  currentServiceFilter = type;
  document.querySelectorAll('#segment-bar .seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = type === 'all' ? participantStore :
    participantStore.filter(p => {
      if (type === 'sil') return p.service === 'sil' || p.service === 'sil_cp';
      if (type === 'inhome') return p.service === 'inhome';
      if (type === 'day') return p.service === 'day';
      return true;
    });
  renderParticipants(filtered);
}

// ── Participant profile ────────────────────────────────────────────────────────

function openParticipant(id) {
  const p = participantStore.find(x => x.id === id);
  if (!p) return;
  currentProfileId = id;
  const [bg, fg] = avatarColor(p.first);

  document.getElementById('profileName').textContent = p.first + ' ' + p.last;
  document.getElementById('profileNdis').textContent = 'NDIS ' + p.ndis;
  document.getElementById('prof-name').textContent = p.first + ' ' + p.last;
  document.getElementById('prof-ndis').textContent = 'NDIS ' + p.ndis;
  document.getElementById('prof-avatar').style.cssText = `background:${bg};color:${fg}`;
  document.getElementById('prof-avatar').textContent = initials(p);
  document.getElementById('prof-status-badge').innerHTML = buildStatusBadge(p.status);

  document.getElementById('prof-details').innerHTML = `
    <div class="info-row"><span class="info-label">DOB</span><span class="info-val">${p.dob}</span></div>
    <div class="info-row"><span class="info-label">Gender</span><span class="info-val">${p.gender}</span></div>
    <div class="info-row"><span class="info-label">Disability</span><span class="info-val">${p.disability}</span></div>
    <div class="info-row"><span class="info-label">Service</span><span class="info-val">${buildServiceBadge(p.service)}</span></div>
    <div class="info-row"><span class="info-label">CP provider</span><span class="info-val">${buildCPBadge(p.cp, p.service)}</span></div>
    <div class="info-row"><span class="info-label">Plan ends</span><span class="info-val">${p.planEnd}</span></div>
    ${p.houseId ? `<div class="info-row"><span class="info-label">Group Home</span><span class="info-val" style="font-size:11px">${(houseData.find(h=>h.id===p.houseId)||{}).name||''}</span></div>` : ''}
  `;

  const contacts = [];
  if (p.phone) contacts.push(`<div class="info-row"><span class="info-label"><i class="ti ti-phone" style="font-size:12px"></i> Phone</span><span class="info-val">${p.phone}</span></div>`);
  if (p.email) contacts.push(`<div class="info-row"><span class="info-label"><i class="ti ti-mail" style="font-size:12px"></i> Email</span><span class="info-val" style="font-size:11px">${p.email}</span></div>`);
  if (p.guardian) contacts.push(`<div class="info-row"><span class="info-label">Guardian</span><span class="info-val">${p.guardian}</span></div>`);
  if (p.guardianPhone) contacts.push(`<div class="info-row"><span class="info-label">Guardian ph.</span><span class="info-val">${p.guardianPhone}</span></div>`);
  if (p.lac) contacts.push(`<div class="info-row"><span class="info-label">LAC</span><span class="info-val">${p.lac}</span></div>`);
  document.getElementById('prof-contacts').innerHTML = contacts.join('') || '<div style="padding:10px 0;font-size:12px;color:var(--text-3)">No contact details recorded.</div>';

  document.getElementById('prof-funding').innerHTML = `
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Core Supports</div><div style="font-size:11px;color:var(--text-3)">Daily activities, personal care</div></div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:600">$42,500</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:62%;background:var(--sky)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$26,350 remaining</div>
      </div>
    </div>
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Capacity Building</div><div style="font-size:11px;color:var(--text-3)">Skills, employment, social</div></div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:600">$18,200</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:35%;background:var(--sage)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$11,830 remaining</div>
      </div>
    </div>
    <div class="support-item">
      <div><div style="font-size:13px;font-weight:600">Capital Supports</div><div style="font-size:11px;color:var(--text-3)">AT, home mods, SIL</div></div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:600">$6,800</div>
        <div class="budget-bar-wrap"><div class="budget-bar" style="width:120px"><div class="budget-fill" style="width:80%;background:var(--coral)"></div></div></div>
        <div style="font-size:11px;color:var(--text-3)">$1,360 remaining</div>
      </div>
    </div>
  `;

  document.getElementById('prof-compliance-list').innerHTML = `
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>NDIS plan current</strong><span>Plan expires ${p.planEnd}</span></div></div>
    <div class="check-item ${p.status==='onboarding'?'missing':'done'}"><div class="check-icon ${p.status==='onboarding'?'ci-missing':'ci-done'}">${p.status==='onboarding'?'!':'✓'}</div><div class="check-text"><strong>Service agreement</strong><span>${p.status==='onboarding'?'Not yet generated':'Signed and on file'}</span></div></div>
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>Privacy consent</strong><span>Signed ${p.planStart}</span></div></div>
    <div class="check-item pending"><div class="check-icon ci-pending">~</div><div class="check-text"><strong>Support plan review</strong><span>Due within 6 months of plan start</span></div></div>
    <div class="check-item done"><div class="check-icon ci-done">✓</div><div class="check-text"><strong>Worker screening</strong><span>All assigned workers cleared</span></div></div>
  `;

  document.getElementById('prof-notes').innerHTML = `
    <div class="note-item"><div class="note-dot-col"><div class="note-dot"></div><div class="note-line"></div></div><div class="note-content"><strong>Intake completed</strong><p>Onboarding intake form completed by Sarah Mitchell. Documents collected.</p><div class="note-meta">${p.planStart} · Sarah Mitchell</div></div></div>
    <div class="note-item"><div class="note-dot-col"><div class="note-dot" style="background:var(--sage)"></div></div><div class="note-content"><strong>Service commenced</strong><p>Support services commenced as per service agreement. No issues reported.</p><div class="note-meta">${p.planStart} · System</div></div></div>
  `;

  // activate first tab
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab')[0].classList.add('active');
  document.getElementById('tab-plan').classList.add('active');

  showPage('profile');
}

function switchTab(panel, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + panel).classList.add('active');
}

// ── Edit participant ──────────────────────────────────────────────────────────

function openEditParticipant(id) {
  const p = participantStore.find(x => x.id === id);
  if (!p) return;
  editingParticipantId = id;
  document.getElementById('editParticipantTitle').textContent = p.first + ' ' + p.last;
  document.getElementById('ep-first').value = p.first;
  document.getElementById('ep-last').value = p.last;
  document.getElementById('ep-ndis').value = p.ndis;
  document.getElementById('ep-dob').value = p.dob;
  setSelectValue('ep-gender', p.gender);
  setSelectValue('ep-disability', p.disability);
  document.getElementById('ep-phone').value = p.phone || '';
  document.getElementById('ep-email').value = p.email || '';
  document.getElementById('ep-address').value = p.address || '';
  setSelectValue('ep-service', p.service);
  setSelectValue('ep-status', p.status);
  document.getElementById('ep-plan-start').value = p.planStart || '';
  document.getElementById('ep-plan-end').value = p.planEnd || '';
  document.getElementById('ep-gname').value = p.guardian || '';
  setSelectValue('ep-grel', p.guardianRel || '');
  document.getElementById('ep-gphone').value = p.guardianPhone || '';
  document.getElementById('ep-gemail').value = '';
  document.getElementById('ep-lac').value = p.lac || '';
  document.getElementById('ep-lac-org').value = p.lacOrg || '';

  // Populate group home dropdown
  const ghSel = document.getElementById('ep-group-home');
  ghSel.innerHTML = '<option value="">— Not assigned —</option>' +
    houseData.map(h => `<option value="${h.id}" ${p.houseId===h.id?'selected':''}>${h.name} — ${h.suburb}</option>`).join('');

  toggleEditCPField();
  openModal('editParticipantModal');
}

function toggleEditCPField() {
  const svc = document.getElementById('ep-service').value;
  const isSil = svc === 'sil_cp' || svc === 'sil';
  document.getElementById('ep-cp-field').style.display = isSil ? '' : 'none';
  document.getElementById('ep-cp-na-field').style.display = isSil ? 'none' : '';
  document.getElementById('ep-house-section').style.display = isSil ? '' : 'none';
}

function setSelectValue(id, val) {
  const sel = document.getElementById(id);
  if (!sel) return;
  for (const opt of sel.options) {
    if (opt.value === val || opt.text === val) { opt.selected = true; break; }
  }
}

function saveEditParticipant() {
  const p = participantStore.find(x => x.id === editingParticipantId);
  if (!p) return;
  p.first = document.getElementById('ep-first').value.trim() || p.first;
  p.last  = document.getElementById('ep-last').value.trim()  || p.last;
  p.ndis  = document.getElementById('ep-ndis').value.trim()  || p.ndis;
  p.dob   = document.getElementById('ep-dob').value.trim()   || p.dob;
  p.gender = document.getElementById('ep-gender').value;
  p.disability = document.getElementById('ep-disability').value;
  p.phone  = document.getElementById('ep-phone').value.trim();
  p.email  = document.getElementById('ep-email').value.trim();
  p.address = document.getElementById('ep-address').value.trim();
  p.service = document.getElementById('ep-service').value;
  p.status  = document.getElementById('ep-status').value;
  p.planStart = document.getElementById('ep-plan-start').value;
  p.planEnd   = document.getElementById('ep-plan-end').value;
  p.guardian  = document.getElementById('ep-gname').value.trim();
  p.guardianRel = document.getElementById('ep-grel').value;
  p.guardianPhone = document.getElementById('ep-gphone').value.trim();
  p.lac    = document.getElementById('ep-lac').value.trim();
  p.lacOrg = document.getElementById('ep-lac-org').value.trim();
  const ghVal = document.getElementById('ep-group-home').value;
  p.houseId = ghVal ? parseInt(ghVal) : null;
  closeModal('editParticipantModal');
  refreshDashboard();
  if (currentProfileId === editingParticipantId) openParticipant(editingParticipantId);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function refreshDashboard() {
  const total = participantStore.length;
  const onboardingCount = participantStore.filter(p => p.status === 'onboarding').length;
  const silCount = participantStore.filter(p => p.service === 'sil' || p.service === 'sil_cp').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-total-sub').textContent = 'registered participants';
  document.getElementById('stat-onboarding').textContent = onboardingCount;
  document.getElementById('stat-onboarding-sub').textContent = 'pending intake tasks';
  document.getElementById('stat-sil').textContent = silCount;
  document.getElementById('stat-sil-sub').textContent = 'in ' + houseData.length + ' group homes';
  document.getElementById('stat-alerts').textContent = '4';
  document.getElementById('stat-alerts-sub').textContent = 'action required';

  document.getElementById('nav-badge').textContent = total;

  const recent = participantStore.slice(-8).reverse();
  document.getElementById('dashboard-recent-body').innerHTML = recent.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg};width:26px;height:26px;font-size:10px">${initials(p)}</div>
        <div>
          <div class="participant-name" style="cursor:pointer;font-size:12px" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div>
        </div>
      </div></td>
      <td>${buildServiceBadge(p.service)}</td>
      <td>${buildStatusBadge(p.status)}</td>
    </tr>`;
  }).join('');

  document.getElementById('dashboard-date-sub').textContent = 'Welcome back, Sarah — ' + new Date().toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'long'});
}

// ── Group Homes ───────────────────────────────────────────────────────────────

function getOccupancy(houseId) {
  return participantStore.filter(p => p.houseId === houseId && (p.service === 'sil' || p.service === 'sil_cp')).length;
}

function renderGroupHomes() {
  const totalParticipants = participantStore.filter(p => p.houseId !== null).length;
  const totalRooms = houseData.reduce((s, h) => s + h.rooms, 0);
  const totalOccupied = houseData.reduce((s, h) => s + getOccupancy(h.id), 0);

  document.getElementById('gh-stats').innerHTML = `
    <div class="stat-card stat-accent"><div class="stat-label">Group Homes</div><div class="stat-value">${houseData.length}</div><div class="stat-sub">Active SIL properties</div></div>
    <div class="stat-card stat-accent-sky"><div class="stat-label">Total Beds</div><div class="stat-value">${totalRooms}</div><div class="stat-sub">Across all homes</div></div>
    <div class="stat-card stat-accent-sage"><div class="stat-label">Occupied</div><div class="stat-value">${totalOccupied}</div><div class="stat-sub">${totalRooms - totalOccupied} vacant beds</div></div>
    <div class="stat-card stat-accent-coral"><div class="stat-label">SIL Participants</div><div class="stat-value">${totalParticipants}</div><div class="stat-sub">Placed in homes</div></div>
  `;

  document.getElementById('gh-cards-grid').innerHTML = houseData.map(h => {
    const occ = getOccupancy(h.id);
    const pct = Math.round((occ / h.rooms) * 100);
    const barColor = pct >= 90 ? 'var(--coral)' : pct >= 70 ? 'var(--sun-gold)' : 'var(--sky)';
    const residents = participantStore.filter(p => p.houseId === h.id);
    return `<div class="card" style="cursor:default">
      <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:600;font-size:14px">${h.name}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">${h.street}, ${h.suburb} ${h.state}</div>
        </div>
        <span class="badge ${h.silModel.includes('CP') ? 'badge-gold' : 'badge-sky'}">${h.silModel}</span>
      </div>
      <div style="padding:12px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;color:var(--text-2)">Occupancy</span>
          <span style="font-size:12px;font-weight:600;color:var(--text-1)">${occ}/${h.rooms}</span>
        </div>
        <div class="budget-bar"><div class="budget-fill" style="width:${pct}%;background:${barColor}"></div></div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-3)">Manager: <strong style="color:var(--text-1)">${h.manager}</strong> · ${h.mgrPhone}</div>
        ${residents.length ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">${residents.slice(0,4).map(p => {
          const [bg,fg] = avatarColor(p.first);
          return `<div class="avatar" style="background:${bg};color:${fg};width:24px;height:24px;font-size:9px;cursor:pointer" title="${p.first} ${p.last}" onclick="openParticipant(${p.id})">${initials(p)}</div>`;
        }).join('')}${residents.length > 4 ? `<div class="avatar" style="background:var(--surface-3);color:var(--text-2);width:24px;height:24px;font-size:9px">+${residents.length-4}</div>`:''}</div>` : ''}
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-sm" style="flex:1" onclick="openEditHouse(${h.id})"><i class="ti ti-edit"></i> Edit</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── In Home Care ──────────────────────────────────────────────────────────────

function renderInHome() {
  const list = participantStore.filter(p => p.service === 'inhome');
  document.getElementById('inhome-count').textContent = list.length;
  document.getElementById('inhome-body').innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div><div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div><div class="participant-ndis">${p.ndis}</div></div>
      </div></td>
      <td style="font-size:12px">${p.ndis}</td>
      <td style="font-size:11px;color:var(--text-2);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.address || '—'}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td><button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button></td>
    </tr>`;
  }).join('');
}

// ── Day Program ───────────────────────────────────────────────────────────────

function renderDayProgram() {
  const list = participantStore.filter(p => p.service === 'day');
  document.getElementById('day-count').textContent = list.length;
  document.getElementById('day-body').innerHTML = list.map(p => {
    const [bg, fg] = avatarColor(p.first);
    return `<tr>
      <td><div class="name-cell">
        <div class="avatar" style="background:${bg};color:${fg}">${initials(p)}</div>
        <div><div class="participant-name" style="cursor:pointer" onclick="openParticipant(${p.id})">${p.first} ${p.last}</div><div class="participant-ndis">${p.ndis}</div></div>
      </div></td>
      <td style="font-size:12px">${p.ndis}</td>
      <td style="font-size:12px">${p.planEnd}</td>
      <td>${buildStatusBadge(p.status)}</td>
      <td><button class="btn btn-sm" onclick="openParticipant(${p.id})"><i class="ti ti-eye"></i></button></td>
    </tr>`;
  }).join('');
}

// ── Onboarding stepper ────────────────────────────────────────────────────────

function obStep(dir) {
  const newStep = obCurrentStep + dir;
  if (newStep < 1 || newStep > 5) {
    if (newStep > 5) finaliseOnboarding();
    return;
  }
  obCurrentStep = newStep;
  renderObStep();
}

function renderObStep() {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('ob-step-' + i).classList.toggle('hidden', i !== obCurrentStep);
    const stepEl = document.getElementById('step-' + i);
    stepEl.classList.remove('active','done');
    if (i < obCurrentStep) stepEl.classList.add('done');
    else if (i === obCurrentStep) stepEl.classList.add('active');
  }
  document.getElementById('ob-back-btn').style.display = obCurrentStep > 1 ? '' : 'none';
  document.getElementById('ob-step-indicator').textContent = `Step ${obCurrentStep} of 5`;
  const nextBtn = document.getElementById('ob-next-btn');
  if (obCurrentStep === 5) {
    nextBtn.innerHTML = '<i class="ti ti-user-plus"></i> Complete onboarding';
  } else {
    nextBtn.innerHTML = 'Next <i class="ti ti-arrow-right"></i>';
  }
}

function finaliseOnboarding() {
  const first = document.getElementById('f-first').value.trim();
  const last  = document.getElementById('f-last').value.trim();
  const ndis  = document.getElementById('f-ndis').value.trim();
  if (!first || !last) { alert('Please enter the participant\'s first and last name.'); return; }
  const newId = participantStore.length ? Math.max(...participantStore.map(p=>p.id)) + 1 : 1;
  const svc = selectedService || 'sil_cp';
  participantStore.push({
    id: newId, first, last,
    ndis: ndis || '43 XXX XXX XXX',
    dob: document.getElementById('f-dob').value || 'Unknown',
    gender: document.getElementById('f-gender').value,
    disability: 'Not recorded', service: svc, cp: selectedCP || 'sunnyday',
    status: 'onboarding', planStart: '', planEnd: '',
    phone: '', email: '', address: '', guardian: '', guardianRel: '',
    guardianPhone: '', lac: '', lacOrg: '', houseId: null,
  });
  closeModal('onboardingModal');
  refreshDashboard();
  showPage('participants');
}

function selectService(type, el) {
  selectedService = type;
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('cp-section').classList.toggle('hidden', type !== 'sil' && type !== 'sil_cp');
  document.getElementById('sil-house-section').classList.toggle('hidden', type !== 'sil' && type !== 'sil_cp');
  if (type === 'sil' || type === 'sil_cp') populateObHouseSelect();
}

function selectCP(type, el) {
  selectedCP = type;
  document.querySelectorAll('.cp-option').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('external-cp-fields').classList.toggle('hidden', type !== 'external');
}

function populateObHouseSelect() {
  const sel = document.getElementById('ob-house-select');
  sel.innerHTML = '<option value="">No preference</option>' +
    houseData.map(h => {
      const occ = getOccupancy(h.id);
      const vac = h.rooms - occ;
      return `<option value="${h.id}" ${vac===0?'disabled':''}>${h.name} — ${h.suburb} (${vac} bed${vac!==1?'s':''} available)</option>`;
    }).join('');
}

// ── Add / Edit Group Home ─────────────────────────────────────────────────────

function openAddHouseModal() {
  editingHouseId = null;
  document.getElementById('houseModalTitle').innerHTML = '<i class="ti ti-building-community" style="color:var(--sun-gold);font-size:18px;margin-right:8px;vertical-align:-2px"></i>Add Group Home';
  document.getElementById('houseModalSub').textContent = 'Register a new SIL group home · Sunnyday Carers';
  document.getElementById('houseModalSaveBtn').innerHTML = '<i class="ti ti-building-community"></i> Add group home';
  ['gh-name','gh-street','gh-suburb','gh-postcode','gh-phone','gh-manager','gh-mgr-phone','gh-notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('gh-rooms').value = '';
  document.getElementById('gh-occupancy-summary').style.display = 'none';
  openModal('addHouseModal');
}

function openEditHouse(id) {
  const h = houseData.find(x => x.id === id);
  if (!h) return;
  editingHouseId = id;
  document.getElementById('houseModalTitle').innerHTML = '<i class="ti ti-edit" style="color:var(--sky);font-size:18px;margin-right:8px;vertical-align:-2px"></i>Edit Group Home';
  document.getElementById('houseModalSub').textContent = h.name + ' · Sunnyday Carers';
  document.getElementById('houseModalSaveBtn').innerHTML = '<i class="ti ti-device-floppy"></i> Save changes';
  document.getElementById('gh-name').value    = h.name;
  document.getElementById('gh-street').value  = h.street;
  document.getElementById('gh-suburb').value  = h.suburb;
  document.getElementById('gh-postcode').value = h.postcode;
  document.getElementById('gh-phone').value   = h.phone;
  document.getElementById('gh-rooms').value   = h.rooms;
  document.getElementById('gh-manager').value = h.manager;
  document.getElementById('gh-mgr-phone').value = h.mgrPhone;
  document.getElementById('gh-notes').value   = h.notes;
  setSelectValue('gh-state', h.state);
  setSelectValue('gh-sil-model', h.silModel);
  setSelectValue('gh-ratio-day', h.ratioDay);
  setSelectValue('gh-ratio-night', h.ratioNight);
  recalcOccupancy();
  openModal('addHouseModal');
}

function closeHouseModal() { closeModal('addHouseModal'); }

function saveHouse() {
  const name = document.getElementById('gh-name').value.trim();
  const street = document.getElementById('gh-street').value.trim();
  const suburb = document.getElementById('gh-suburb').value.trim();
  const rooms = parseInt(document.getElementById('gh-rooms').value);
  const manager = document.getElementById('gh-manager').value.trim();
  if (!name || !street || !suburb || !rooms || !manager) { alert('Please fill in all required fields.'); return; }
  const data = {
    name, street, suburb,
    state: document.getElementById('gh-state').value,
    postcode: document.getElementById('gh-postcode').value,
    phone: document.getElementById('gh-phone').value,
    rooms,
    manager,
    mgrPhone: document.getElementById('gh-mgr-phone').value,
    silModel: document.getElementById('gh-sil-model').value,
    ratioDay: document.getElementById('gh-ratio-day').value,
    ratioNight: document.getElementById('gh-ratio-night').value,
    notes: document.getElementById('gh-notes').value,
  };
  if (editingHouseId) {
    const h = houseData.find(x => x.id === editingHouseId);
    Object.assign(h, data);
  } else {
    const newId = houseData.length ? Math.max(...houseData.map(h=>h.id)) + 1 : 1;
    houseData.push({ id: newId, ...data });
  }
  closeHouseModal();
  renderGroupHomes();
}

function recalcOccupancy() {
  const rooms = parseInt(document.getElementById('gh-rooms').value) || 0;
  const occ = editingHouseId ? getOccupancy(editingHouseId) : 0;
  const vacant = Math.max(0, rooms - occ);
  const pct = rooms > 0 ? Math.round((occ / rooms) * 100) : 0;
  const summary = document.getElementById('gh-occupancy-summary');
  summary.style.display = rooms > 0 ? '' : 'none';
  if (rooms > 0) {
    document.getElementById('occ-total').textContent = rooms;
    document.getElementById('occ-occupied').textContent = occ;
    document.getElementById('occ-vacant').textContent = vacant;
    document.getElementById('occ-bar').style.width = pct + '%';
    document.getElementById('occ-pct').textContent = pct + '%';
  }
}

// ── Service Agreement ─────────────────────────────────────────────────────────

function populateSASelect() {
  const sel = document.getElementById('sa-participant');
  sel.innerHTML = '<option value="">— Select participant —</option>' +
    participantStore
      .filter(p => p.service === 'sil_cp' || p.service === 'sil')
      .sort((a,b) => (a.first+a.last).localeCompare(b.first+b.last))
      .map(p => `<option value="${p.id}">${p.first} ${p.last} — ${p.ndis}</option>`)
      .join('');
  document.getElementById('sa-preview').style.display = 'none';
}

function prefillSA() {
  const id = parseInt(document.getElementById('sa-participant').value);
  const p = participantStore.find(x => x.id === id);
  if (!p) { document.getElementById('sa-preview').style.display = 'none'; return; }
  document.getElementById('prev-name').textContent = p.first + ' ' + p.last;
  document.getElementById('prev-ndis').textContent = p.ndis;
  document.getElementById('prev-dob').textContent = p.dob;
  document.getElementById('prev-plan').textContent = p.planEnd || 'Not recorded';
  document.getElementById('sa-preview').style.display = '';
}

function generateSA() {
  const id = parseInt(document.getElementById('sa-participant').value);
  const p = participantStore.find(x => x.id === id);
  if (!p) { alert('Please select a participant first.'); return; }
  const type = document.getElementById('sa-type').value;
  const start = document.getElementById('sa-start-date').value;
  const params = new URLSearchParams({
    name: p.first + ' ' + p.last, ndis: p.ndis, dob: p.dob,
    planEnd: p.planEnd, type, start,
  });
  window.open('sunnyday-sa-sil-cp.html?' + params.toString(), '_blank');
  closeModal('saModal');
}

function openSABlank() {
  window.open('sunnyday-sa-sil-cp.html', '_blank');
  closeModal('saModal');
}

// ── Import ────────────────────────────────────────────────────────────────────

let impStep = 1;

function closeImportModal() { closeModal('importModal'); impReset(); }

function impReset() {
  impStep = 1;
  importedRows = [];
  document.getElementById('imp-panel-1').style.display = '';
  document.getElementById('imp-panel-2').style.display = 'none';
  document.getElementById('imp-panel-3').style.display = 'none';
  document.getElementById('imp-back-btn').style.display = 'none';
  document.getElementById('imp-next-btn').style.display = 'none';
  document.getElementById('imp-done-btn').style.display = 'none';
  document.getElementById('imp-file-name').textContent = '';
  document.getElementById('csvFileInput').value = '';
  setImpStep(1);
}

function setImpStep(s) {
  impStep = s;
  ['imp-step-1','imp-step-2','imp-step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active','done');
    if (i+1 < s) el.classList.add('done');
    else if (i+1 === s) el.classList.add('active');
  });
}

function impGoStep(s) { setImpStep(s); }

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').style.borderColor = 'var(--border)';
  document.getElementById('dropZone').style.background = 'var(--surface-2)';
  const file = e.dataTransfer.files[0];
  if (file) processImportFile(file);
}

function handleFileSelect(input) {
  const file = input.files[0];
  if (file) processImportFile(file);
}

function processImportFile(file) {
  document.getElementById('imp-file-name').textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      importedRows = data;
      showImportPreview(data);
    } catch(err) {
      alert('Could not parse file. Please use a CSV or XLSX file with the correct column headers.');
    }
  };
  reader.readAsBinaryString(file);
}

function showImportPreview(data) {
  if (!data.length) { alert('No data rows found in file.'); return; }
  const cols = Object.keys(data[0]);
  const errors = data.filter(r => !r.first_name || !r.last_name || !r.ndis_number);
  document.getElementById('imp-panel-1').style.display = 'none';
  document.getElementById('imp-panel-2').style.display = '';
  document.getElementById('imp-back-btn').style.display = '';
  document.getElementById('imp-next-btn').style.display = '';
  document.getElementById('imp-next-btn').querySelector('#imp-count') && (document.getElementById('imp-count').textContent = data.length);
  document.getElementById('imp-next-btn').innerHTML = `<i class="ti ti-database-import"></i> Import ${data.length} participants`;

  document.getElementById('imp-summary').innerHTML = `
    <div style="background:var(--sky-light);border:1px solid rgba(46,127,212,0.2);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--sky-dark)">${data.length}</div><div style="font-size:11px;color:var(--sky-dark)">Rows detected</div></div>
    <div style="background:var(--sage-light);border:1px solid rgba(58,140,110,0.25);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--sage-dark)">${data.length - errors.length}</div><div style="font-size:11px;color:var(--sage-dark)">Valid rows</div></div>
    <div style="background:${errors.length?'var(--coral-light)':'var(--sage-light)'};border:1px solid ${errors.length?'rgba(224,92,59,0.2)':'rgba(58,140,110,0.25)'};border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:${errors.length?'var(--coral)':'var(--sage-dark)'}">${errors.length}</div><div style="font-size:11px;color:${errors.length?'var(--coral)':'var(--sage-dark)'}">Errors</div></div>
    <div style="background:var(--surface-3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;text-align:center"><div style="font-size:22px;font-weight:700;color:var(--text-2)">${cols.length}</div><div style="font-size:11px;color:var(--text-3)">Columns</div></div>
  `;

  document.getElementById('imp-preview-head').innerHTML = '<tr>' + cols.map(c => `<th style="padding:8px 12px;font-size:11px;text-transform:uppercase;background:var(--surface-2);border-bottom:1px solid var(--border)">${c}</th>`).join('') + '</tr>';
  document.getElementById('imp-preview-body').innerHTML = data.slice(0,10).map(row =>
    '<tr>' + cols.map(c => `<td style="padding:8px 12px;border-bottom:1px solid var(--border)">${row[c]||''}</td>`).join('') + '</tr>'
  ).join('');
  setImpStep(2);
}

function downloadTemplate(format) {
  const headers = ['first_name','last_name','ndis_number','dob','service_type','plan_start','plan_end','cp_provider','disability','guardian_name','guardian_phone','status'];
  const sample = [['John','Smith','43 123 456 789','15 Mar 1990','sil_cp','1 Jul 2026','30 Jun 2027','sunnyday','Autism Spectrum Disorder','Mary Smith','0412 345 678','active']];
  if (format === 'csv') {
    const csv = [headers.join(','), ...sample.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download:'sunnyday-participant-template.csv'});
    a.click();
  } else {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, 'sunnyday-participant-template.xlsx');
  }
}

function impConfirm() {
  if (!importedRows.length) return;
  let added = 0;
  const maxId = participantStore.length ? Math.max(...participantStore.map(p=>p.id)) : 0;
  importedRows.forEach((row, i) => {
    if (!row.first_name || !row.last_name) return;
    participantStore.push({
      id: maxId + i + 1,
      first: row.first_name, last: row.last_name,
      ndis: row.ndis_number || '—',
      dob: row.dob || 'Unknown',
      gender: row.gender || 'Not recorded',
      disability: row.disability || 'Not recorded',
      service: row.service_type || 'sil_cp',
      cp: row.cp_provider || 'sunnyday',
      status: row.status || 'onboarding',
      planStart: row.plan_start || '', planEnd: row.plan_end || '',
      phone: row.phone || '', email: row.email || '', address: row.address || '',
      guardian: row.guardian_name || '', guardianRel: '', guardianPhone: row.guardian_phone || '',
      lac: '', lacOrg: '', houseId: null,
    });
    added++;
  });
  document.getElementById('imp-panel-2').style.display = 'none';
  document.getElementById('imp-panel-3').style.display = '';
  document.getElementById('imp-next-btn').style.display = 'none';
  document.getElementById('imp-back-btn').style.display = 'none';
  document.getElementById('imp-done-btn').style.display = '';
  document.getElementById('imp-done-title').textContent = `${added} participants imported`;
  document.getElementById('imp-done-sub').textContent = 'All participants added with status "Onboarding". Review and update individual records as needed.';
  setImpStep(3);
  refreshDashboard();
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  refreshDashboard();
});
