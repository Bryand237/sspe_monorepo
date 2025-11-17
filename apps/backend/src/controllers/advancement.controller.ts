import { CREATED, OK } from "../constants/http";
import { Advancement } from "../entity/advancement";
import { AdvancementService } from "../services/advancement.service";
import { DocService } from "../services/docs.service";
import { PDFService } from "../services/pdf.service";
import { TeacherService } from "../services/teacher.service";
import { catchError } from "../utils/catchError";
import * as fs from "fs";
import * as path from "path";

const gradesOrder = [
  "Professeur",
  "Maitre de Conférence",
  "Chargé de cours",
  "Assistant Avec Thèse",
  "Assistant Sans Thèse",
] as const;

const ceiMap: Record<string, string[]> = {
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

const advanceGrade = (grade: string) => {
  const idx = gradesOrder.indexOf(grade as any);
  if (idx === -1) return grade;
  return (gradesOrder[idx + 1] as string) ?? grade;
};

const computeNewCEI = (grade: string, lastCEI: string) => {
  const nextGrade = advanceGrade(grade);
  const nextList = ceiMap[nextGrade];
  if (!nextList) return lastCEI;
  const idx = nextList.findIndex((c) => c === lastCEI);
  if (idx === -1) return lastCEI;
  const currentList = ceiMap[grade] || [];
  if (idx === currentList.length - 1) return nextList[0];
  return nextList[idx + 1];
};

export class AdvancementController {
  private advancementService: AdvancementService;
  private docService: DocService;
  private pdfService: PDFService;
  private teacherService: TeacherService;

  constructor() {
    this.advancementService = new AdvancementService();
    this.docService = new DocService();
    this.pdfService = new PDFService();
    this.teacherService = new TeacherService();
  }

  getAllAdvancementsNumber = catchError(async (req, res) => {
    const number = await this.advancementService.getAllAdvancementNumber();
    res.status(OK).json({
      success: true,
      number,
    });
  });

  getAllAdvancements = catchError(async (req, res) => {
    const advancements = await this.advancementService.getAllAdvancement();
    res.status(OK).json({
      success: true,
      data: advancements,
    });
  });

  getAdvancementById = catchError(async (req, res) => {
    const id = req.params.id;
    const advancement = await this.advancementService.getAdvancementById(id);
    res.status(OK).json({
      success: true,
      data: advancement,
    });
  });

  createAdvancement = catchError(async (req, res) => {
    const raw = req.body as any;
    const docPath = req.file?.path;
    const docName = req.file?.filename;

    const parsedCount = Number(raw.numberOfTeacher);
    const numberOfTeacher = Number.isFinite(parsedCount)
      ? parsedCount
      : undefined;
    const startDate = raw.startDate ? new Date(raw.startDate) : undefined;
    const endDate = raw.endDate ? new Date(raw.endDate) : undefined;
    const teachersList = (() => {
      if (!raw.teachersList) return [] as { id: string }[];
      try {
        const parsed = JSON.parse(raw.teachersList);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const publicDocPath = docName ? `/avancements/${docName}` : docPath;
    const newDoc = await this.docService.saveDoc({
      docName,
      docPath: publicDocPath,
      docsize: req.file?.size ?? 0,
    });

    // Fetch teacher entities for relation and updates
    const teacherEntities = (
      await Promise.all(
        teachersList.map(async (t: { id: string }) => {
          return await this.teacherService.getTeacherById(t.id);
        })
      )
    ).filter(Boolean) as any[];

    const advData: Partial<Advancement> = {
      doc: newDoc,
      numberOfTeacher: numberOfTeacher ?? teacherEntities.length,
      startDate: startDate!,
      endDate: endDate!,
      teachersList: teacherEntities,
    };

    const newAdvancement = await this.advancementService.createAdvancement(advData);

    // Update each teacher according to advancement rules
    const twoYearsMs = 1000 * 60 * 60 * 24 * 365 * 2;
    await Promise.all(
      teacherEntities.map(async (teacher: any) => {
        const newGrade = teacher.nextGrade ?? advanceGrade(teacher.grade);
        const lastCEI = teacher.cei;
        const newCei = teacher.nextCei ?? computeNewCEI(teacher.grade, lastCEI);
        const baseDate: Date = teacher.nextAdvancementDate
          ? new Date(teacher.nextAdvancementDate)
          : endDate!;
        const newLastAdvDate = baseDate;
        const nextAdv = new Date(newLastAdvDate.getTime() + twoYearsMs);
        const nextGrade = advanceGrade(newGrade);
        const nextCei = computeNewCEI(newGrade, newCei);
        await this.teacherService.updateTeacher(teacher.id, {
          lastAdvancementDate: newLastAdvDate,
          cei: newCei,
          grade: newGrade as any,
          nextAdvancementDate: nextAdv,
          nextGrade: nextGrade as any,
          nextCei: nextCei,
        });
      })
    );

    res.status(CREATED).json({
      success: true,
      data: newAdvancement,
      message: "Avancement enregistré avec succès.",
    });
  });

  updateAdvancement = catchError(async (req, res) => {
    const id = req.params.id;
    const advData: Partial<Advancement> = req.body;
    const updatedAdvancement = await this.advancementService.updateAdvancement(
      id,
      advData
    );
    res.status(OK).json({
      success: true,
      data: updatedAdvancement,
      message: "Avancement modifié avec succès.",
    });
  });

  deleteAdvancement = catchError(async (req, res) => {
    const id = req.params.id;
    await this.advancementService.deleteAdvancement(id);
    res.status(OK).json({
      success: true,
      message: "Avancement supprimé avec succès.",
    });
  });

  // Test endpoint without DB - for debugging
  testGeneratePDF = catchError(async (req, res) => {
    console.log("🧪 TEST: Starting PDF generation (NO DB)...");
    const { period, teachersByInstitution, totalTeachers } = req.body;

    const advancementsDir = path.join(process.cwd(), "avancements");
    if (!fs.existsSync(advancementsDir)) {
      fs.mkdirSync(advancementsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `test_${timestamp}.pdf`;
    const filepath = path.join(advancementsDir, filename);

    const pdfDoc = this.pdfService.generateAdvancementPDF({
      period,
      teachersByInstitution,
      totalTeachers,
    });

    const writeStream = fs.createWriteStream(filepath);
    pdfDoc.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on("finish", () => resolve());
      writeStream.on("error", reject);
      pdfDoc.on("error", reject);
    });

    pdfDoc.end();

    const fileBuffer = fs.readFileSync(filepath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(CREATED).send(fileBuffer);
  });

  generateAdvancementPDF = catchError(async (req, res) => {
    console.log("📄 Starting PDF generation...");
    const { period, teachersByInstitution, totalTeachers, teacherIds } = req.body;
    console.log("📊 Data received:", { 
      period, 
      totalTeachers, 
      institutionsCount: teachersByInstitution?.length,
      teacherIdsCount: teacherIds?.length 
    });

    // Create avancements directory if it doesn't exist
    const advancementsDir = path.join(process.cwd(), "avancements");
    if (!fs.existsSync(advancementsDir)) {
      console.log("📁 Creating avancements directory...");
      fs.mkdirSync(advancementsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `avancement_${timestamp}.pdf`;
    const filepath = path.join(advancementsDir, filename);
    console.log("💾 PDF will be saved to:", filepath);

    // Generate PDF document (without calling end())
    console.log("🔨 Generating PDF document...");
    const pdfDoc = this.pdfService.generateAdvancementPDF({
      period,
      teachersByInstitution,
      totalTeachers,
    });
    console.log("✅ PDF document created");

    // Save PDF to file
    console.log("📝 Creating write stream...");
    const writeStream = fs.createWriteStream(filepath);
    pdfDoc.pipe(writeStream);
    console.log("🔗 PDF piped to write stream");

    // Set up event listeners BEFORE calling end()
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

    // Now call end() to finalize the PDF
    console.log("🏁 Calling pdfDoc.end()...");
    pdfDoc.end();

    // Wait for the write to complete
    console.log("⏳ Waiting for PDF write to complete...");
    await pdfPromise;
    console.log("✅ PDF write completed");

    console.log("💾 Saving document to database...");
    // Save document reference in database
    const newDoc = await this.docService.saveDoc({
      docName: filename,
      docPath: filepath,
    });
    console.log("✅ Document saved, ID:", newDoc.id);

    console.log("📝 Creating advancement record...");
    // Create advancement record
    const advData: Partial<Advancement> = {
      doc: newDoc,
      numberOfTeacher: totalTeachers,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      teachersList: teacherIds,
    };

    const newAdvancement = await this.advancementService.createAdvancement(advData);
    console.log("✅ Advancement created, ID:", newAdvancement.id);

    // Send PDF as response
    console.log("📤 Sending PDF to client...");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    
    const fileBuffer = fs.readFileSync(filepath);
    res.status(CREATED).send(fileBuffer);
    console.log("✅ PDF sent successfully!");
  });
}
