/**
 * Script de test direct pour la génération PDF
 * Lance directement le service sans passer par Express
 */

import { PDFService } from "./services/pdf.service";
import * as fs from "fs";
import * as path from "path";

const testData = {
  period: {
    startDate: "2024-01-01",
    endDate: "2024-06-30",
  },
  teachersByInstitution: [
    {
      institution: {
        id: "1",
        fullname: "Test Institution",
        abbreviation: "TEST",
        type: "école" as const,
      },
      byGrade: [
        {
          grade: "Professeur",
          teachers: [
            {
              id: "1",
              firstname: "John",
              lastname: "Doe",
              matricule: "123456",
              birthdate: new Date("1980-01-01"),
              hireDate: new Date("2010-01-01"),
              lastDiploma: "PhD",
              lastAdvancementDate: new Date("2020-01-01"),
              cei: "10",
              nextAdvancementDate: new Date("2025-01-01"),
              nextCei: "11",
              grade: "Professeur",
              status: "actif" as const,
              functions: "Enseignement",
              institution: {} as any,
            },
          ],
        },
      ],
      total: 1,
    },
  ],
  totalTeachers: 1,
};

console.log("🧪 Testing PDF Service directly...\n");

try {
  const pdfService = new PDFService();
  console.log("✅ PDFService instantiated");

  console.log("🔨 Generating PDF...");
  const pdfDoc = pdfService.generateAdvancementPDF(testData as any);
  console.log("✅ PDF document created");

  const filepath = path.join(process.cwd(), "test-direct.pdf");
  console.log("💾 Saving to:", filepath);

  const writeStream = fs.createWriteStream(filepath);
  pdfDoc.pipe(writeStream);

  const pdfPromise = new Promise<void>((resolve, reject) => {
    writeStream.on("finish", () => {
      console.log("✅ Write stream finished");
      resolve();
    });
    writeStream.on("error", (err) => {
      console.error("❌ Write stream error:", err);
      reject(err);
    });
    pdfDoc.on("error", (err) => {
      console.error("❌ PDF document error:", err);
      reject(err);
    });
  });

  pdfDoc.end();
  console.log("🏁 PDF document ended");

  pdfPromise
    .then(() => {
      console.log("\n✅ SUCCESS! PDF generated successfully");
      console.log("File saved to:", filepath);
      const stats = fs.statSync(filepath);
      console.log("File size:", stats.size, "bytes");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ FAILED! Error:", error);
      process.exit(1);
    });
} catch (error) {
  console.error("\n❌ EXCEPTION CAUGHT:");
  console.error(error);
  process.exit(1);
}
