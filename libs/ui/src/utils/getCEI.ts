import { TGrade } from "../interfaces/IGrade";

export const getCEI = (grade: TGrade): string[] => {
  let returnArr: string[] = [];

  switch (grade) {
    case "Professeur":
      returnArr = ["Cp1/Ep1/Indp1", "Cp2/Ep2/Indp2"];
      break;
    case "MaitreDeConference":
      returnArr = ["Cm1/Em1/Indm1", "Cm2/Em2/Indm2"];
      break;
    case "ChargeDeCours":
      returnArr = ["Cm1/Em1/Indm1", "Cm2/Em2/Indm2"];
      break;
    case "AssistantAvecThese":
      returnArr = ["Cm1/Em1/Indm1", "Cm2/Em2/Indm2"];
      break;
    case "AssistantSansThese":
      returnArr = ["Cm1/Em1/Indm1", "Cm2/Em2/Indm2"];
      break;
    default:
      break;
  }

  return returnArr;
};
