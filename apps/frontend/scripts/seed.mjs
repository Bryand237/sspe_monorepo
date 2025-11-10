// Seed script for institutions (10) and teachers (20)
// Usage: node ./scripts/seed.mjs

const BASE_URL = "http://localhost:5500/api/";

async function postJSON(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${path} ${res.status}: ${txt}`);
  }
  return res.json();
}

async function getJSON(path) {
  const res = await fetch(BASE_URL + path);
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dateISO(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const grades = [
  "Professeur",
  "Maitre de Conférence",
  "Chargé de cours",
  "Assistant Sans Thèse",
  "Assistant Avec Thèse",
];

function nextGradeFor(grade) {
  switch (grade) {
    case "Assistant Sans Thèse":
      return "Assistant Avec Thèse";
    case "Assistant Avec Thèse":
      return "Chargé de cours";
    case "Chargé de cours":
      return "Maitre de Conférence";
    case "Maitre de Conférence":
      return "Professeur";
    case "Professeur":
    default:
      return "Professeur";
  }
}

function ceisFor(grade) {
  switch (grade) {
    case "Assistant Sans Thèse":
      return ["3C/3E/320", "3C/2E/450", "3C/1E/540"];
    case "Assistant Avec Thèse":
      return ["3C/3E/606", "3C/2E/665", "3C/1E/715"];
    case "Chargé de cours":
      return [
        "2C/1E/715",
        "2C/2E/785",
        "2C/3E/870",
        "2C/4E/940",
        "2C/5E/1005",
        "2C/6E/1050",
        "1C/1E/1115",
        "1C/2E/1140",
        "1C/3E/1200",
        "CE/1240",
      ];
    case "Maitre de Conférence":
      return [
        "2C/1E/785",
        "2C/2E/870",
        "2C/3E/940",
        "2C/4E/1005",
        "2C/5E/1050",
        "2C/6E/1115",
        "1C/1E/1140",
        "1C/2E/1200",
        "1C/3E/1240",
        "CE/1300",
      ];
    case "Professeur":
      return [
        "2C/1E/940",
        "2C/2E/1005",
        "2C/3E/1050",
        "2C/4E/1115",
        "2C/5E/1140",
        "1C/1E/1200",
        "1C/3E/1240",
        "1C/3E/1300",
        "CE/1350",
        "HE/1400",
      ];
    default:
      return ["3C/3E/320"];
  }
}

async function seedInstitutions() {
  const institutions = [
    { fullname: "École Normale Supérieure", abbreviation: "ENS", type: "école", host: "Ngaoundéré" },
    { fullname: "École Polytechnique", abbreviation: "EP", type: "école", host: "Yaoundé" },
    { fullname: "École des Sciences de Santé", abbreviation: "ESS", type: "école", host: "Douala" },
    { fullname: "Faculté des Sciences", abbreviation: "FS", type: "faculté", host: "Ngaoundéré" },
    { fullname: "Faculté des Lettres", abbreviation: "FL", type: "faculté", host: "Ngaoundéré" },
    { fullname: "Faculté de Médecine", abbreviation: "FM", type: "faculté", host: "Yaoundé" },
    { fullname: "Faculté de Droit", abbreviation: "FD", type: "faculté", host: "Douala" },
    { fullname: "École d'Agronomie", abbreviation: "EA", type: "école", host: "Bafoussam" },
    { fullname: "École d'Informatique", abbreviation: "EI", type: "école", host: "Buea" },
    { fullname: "Faculté d'Économie", abbreviation: "FE", type: "faculté", host: "Garoua" },
  ];

  const created = [];
  for (const inst of institutions) {
    const res = await postJSON("institutions", inst);
    // expecting DataResponse-like { data: {...} }
    const createdInst = res?.data ?? res;
    created.push(createdInst);
  }
  return created; // array with ids
}

function randomPhone() {
  const base = "+2376";
  let s = base;
  while (s.length < 13) s += Math.floor(Math.random() * 10);
  return s;
}

function randomEmail(i) {
  return `enseignant${i}@univ.cm`;
}

function randomMatricule(i) {
  const n = (10000 + i + Math.floor(Math.random() * 9000)).toString();
  return `MAT-${n}`;
}

async function seedTeachers(institutions) {
  const teachers = [];
  for (let i = 1; i <= 20; i++) {
    const grade = pick(grades);
    const nextGrade = nextGradeFor(grade);
    const ceis = ceisFor(grade);
    const nextCeis = ceisFor(nextGrade);
    const inst = pick(institutions);

    const teacher = {
      matricule: randomMatricule(i),
      firstname: `Nom${i}`,
      lastname: `Prenom${i}`,
      lastDiploma: pick(["PhD", "DEA", "Master", "Licence"]),
      sex: pick(["Masculin", "Feminin"]),
      hireDate: dateISO(2000 + Math.floor(Math.random() * 3000)),
      email: randomEmail(i),
      phone: randomPhone(),
      functions: pick(["Enseignant-chercheur", "Chef de département", "Coordinateur"]),
      birthdate: dateISO(9000 + Math.floor(Math.random() * 4000)),
      institution: inst.id || inst._id || inst, // backend may accept id or object
      grade,
      nextGrade,
      cei: pick(ceis),
      nextCei: pick(nextCeis),
      lastAdvancementDate: dateISO(800 + Math.floor(Math.random() * 1200)),
      nextAdvancementDate: dateISO(0 - Math.floor(Math.random() * -365)),
      statut: pick(["actif", "archivé"]),
    };
    teachers.push(teacher);
  }

  const created = [];
  for (const t of teachers) {
    const res = await postJSON("teachers", t);
    created.push(res?.data ?? res);
  }
  return created;
}

async function main() {
  try {
    // get existing to avoid duplicates
    const existingInst = await getJSON("institutions").catch(() => null);
    let institutions = existingInst?.data ?? [];
    if (!Array.isArray(institutions) || institutions.length < 10) {
      institutions = await seedInstitutions();
      console.log(`✔ Institutions créées: ${institutions.length}`);
    } else {
      console.log(`ℹ Institutions existantes: ${institutions.length}`);
    }

    const existingTeachers = await getJSON("teachers").catch(() => null);
    const currentCount = Array.isArray(existingTeachers?.data)
      ? existingTeachers.data.length
      : 0;
    if (currentCount < 20) {
      const createdTeachers = await seedTeachers(institutions);
      console.log(`✔ Enseignants créés: ${createdTeachers.length}`);
    } else {
      console.log(`ℹ Enseignants existants: ${currentCount}`);
    }

    console.log("✔ Seed terminé");
  } catch (err) {
    console.error("✖ Seed échoué:", err.message);
    process.exit(1);
  }
}

main();
