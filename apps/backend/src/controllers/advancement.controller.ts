import { CREATED, OK } from "../constants/http";
import { Advancement } from "../entity/advancement";
import { AdvancementService } from "../services/advancement.service";
import { DocService } from "../services/docs.service";
import { PDFService } from "../services/pdf.service";
import { catchError } from "../utils/catchError";
import * as fs from "fs";
import * as path from "path";

export class AdvancementController {
  private advancementService: AdvancementService;
  private docService: DocService;
  private pdfService: PDFService;

  constructor() {
    this.advancementService = new AdvancementService();
    this.docService = new DocService();
    this.pdfService = new PDFService();
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
    const advData: Partial<Advancement> = req.body;
    const docPath = req.file?.path;
    const docName = req.file?.filename;

    const newDoc = await this.docService.saveDoc({ docName, docPath });
    advData.doc = newDoc;
    const newAdvancement = await this.advancementService.createAdvancement(
      advData
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
