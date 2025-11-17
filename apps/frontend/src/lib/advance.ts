const grades = [
  "Professeur",
  "Maitre de Conférence",
  "Chargé de cours",
  "Assistant Avec Thèse",
  "Assistant Sans Thèse",
];

const cei = {
  Professeur: [
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
  ],
  "Maitre de Conférence": [
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
  ],
  "Chargé de cours": [
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
  ],
  "Assistant Avec Thèse": ["3C/3E/606", "3C/2E/665", "3C/1E/715"],
  "Assistant Sans Thèse": ["3C/3E/320", "3C/2E/450", "3C/1E/540"],
};

export const advanceGrade = (grade: string) => {
  const index = grades.indexOf(grade);
  if (index === -1) return grade;
  return grades[index + 1];
};

export const newCEI = (grade: string, lastCEI: string) => {
  const nextGrade = advanceGrade(grade);
  const ceiIndex = cei[nextGrade as keyof typeof cei].findIndex(
    (cei) => cei === lastCEI
  );
  if (ceiIndex === -1) return lastCEI;
  if (ceiIndex === cei[grade as keyof typeof cei].length - 1)
    return cei[nextGrade as keyof typeof cei][0];
  return cei[nextGrade as keyof typeof cei][ceiIndex + 1];
};
