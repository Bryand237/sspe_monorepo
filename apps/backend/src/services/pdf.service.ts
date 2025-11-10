import PDFDocument from "pdfkit";
import { Teacher } from "../entity/teacher";
import { Institution } from "../entity/institution";

interface AdvancementPDFData {
  period: {
    startDate: string;
    endDate: string;
  };
  teachersByInstitution: Array<{
    institution: Institution;
    byGrade: Array<{
      grade: string;
      teachers: Teacher[];
    }>;
    total: number;
  }>;
  totalTeachers: number;
}

export class PDFService {
  private gradeOrder = [
    "Professeur",
    "Maitre de Conférence",
    "Chargé de cours",
    "Assistant Avec Thèse",
    "Assistant Sans Thèse",
  ];

  generateAdvancementPDF(data: AdvancementPDFData) {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 30, bottom: 30, left: 30, right: 30 },
    });

    this.addHeader(doc, data);
    this.addContent(doc, data);

    // Don't call doc.end() here - let the controller handle it after setting up event listeners
    return doc;
  }

  private addHeader(doc: InstanceType<typeof PDFDocument>, data: AdvancementPDFData): void {
    const startDate = new Date(data.period.startDate).toLocaleDateString(
      "fr-FR"
    );
    const endDate = new Date(data.period.endDate).toLocaleDateString("fr-FR");

    doc.fontSize(18).font("Helvetica-Bold");
    doc.text("Liste d'Avancement Semestriel", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(12).font("Helvetica");
    doc.text(`Période: ${startDate} - ${endDate}`, { align: "center" });
    doc.text(`Total Enseignants: ${data.totalTeachers}`, { align: "center" });
    doc.moveDown(1);
  }

  private addContent(doc: InstanceType<typeof PDFDocument>, data: AdvancementPDFData): void {
    data.teachersByInstitution.forEach((instData, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Institution header
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text(instData.institution.fullname);
      doc.fontSize(10).font("Helvetica");
      doc.text(
        `${instData.institution.abbreviation} - ${instData.total} enseignant(s)`
      );
      doc.moveDown(0.5);

      // Tables for each grade
      instData.byGrade.forEach((gradeData) => {
        this.addGradeTable(doc, gradeData);
        doc.moveDown(1);
      });
    });
  }

  private addGradeTable(
    doc: InstanceType<typeof PDFDocument>,
    gradeData: { grade: string; teachers: Teacher[] }
  ): void {
    doc.fontSize(11).font("Helvetica-Bold");
    doc.text(`${gradeData.grade} (${gradeData.teachers.length})`);
    doc.moveDown(0.3);

    const tableTop = doc.y;
    const colWidths = {
      no: 25,
      name: 100,
      matricule: 55,
      birthdate: 50,
      hireDate: 50,
      diploma: 70,
      lastAdvDate: 50,
      cei: 35,
      nextAdvDate: 50,
      nextCei: 35,
      observation: 60,
    };

    let x = doc.page.margins.left;
    const rowHeight = 20;

    // Table headers
    doc.fontSize(7).font("Helvetica-Bold");
    this.drawCell(doc, x, tableTop, colWidths.no, rowHeight, "N°");
    x += colWidths.no;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.name,
      rowHeight,
      "Noms et Prénoms"
    );
    x += colWidths.name;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.matricule,
      rowHeight,
      "Matricule"
    );
    x += colWidths.matricule;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.birthdate,
      rowHeight,
      "Date Naissance"
    );
    x += colWidths.birthdate;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.hireDate,
      rowHeight,
      "Date Prise Service"
    );
    x += colWidths.hireDate;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.diploma,
      rowHeight,
      "Dernier Diplôme"
    );
    x += colWidths.diploma;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.lastAdvDate,
      rowHeight,
      "Dernier Av. Date"
    );
    x += colWidths.lastAdvDate;
    this.drawCell(doc, x, tableTop, colWidths.cei, rowHeight, "CEI");
    x += colWidths.cei;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.nextAdvDate,
      rowHeight,
      "Nouvel Av. Date"
    );
    x += colWidths.nextAdvDate;
    this.drawCell(doc, x, tableTop, colWidths.nextCei, rowHeight, "Nouv. CEI");
    x += colWidths.nextCei;
    this.drawCell(
      doc,
      x,
      tableTop,
      colWidths.observation,
      rowHeight,
      "Observation"
    );

    // Table rows
    doc.font("Helvetica").fontSize(6);
    let currentY = tableTop + rowHeight;

    gradeData.teachers.forEach((teacher, idx) => {
      if (currentY > doc.page.height - doc.page.margins.bottom - rowHeight) {
        doc.addPage();
        currentY = doc.page.margins.top;
      }

      x = doc.page.margins.left;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.no,
        rowHeight,
        (idx + 1).toString()
      );
      x += colWidths.no;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.name,
        rowHeight,
        `${teacher.lastname} ${teacher.firstname}`
      );
      x += colWidths.name;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.matricule,
        rowHeight,
        teacher.matricule
      );
      x += colWidths.matricule;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.birthdate,
        rowHeight,
        this.formatDate(teacher.birthdate)
      );
      x += colWidths.birthdate;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.hireDate,
        rowHeight,
        this.formatDate(teacher.hireDate)
      );
      x += colWidths.hireDate;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.diploma,
        rowHeight,
        teacher.lastDiploma
      );
      x += colWidths.diploma;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.lastAdvDate,
        rowHeight,
        this.formatDate(teacher.lastAdvancementDate)
      );
      x += colWidths.lastAdvDate;
      this.drawCell(doc, x, currentY, colWidths.cei, rowHeight, teacher.cei);
      x += colWidths.cei;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.nextAdvDate,
        rowHeight,
        this.formatDate(teacher.nextAdvancementDate)
      );
      x += colWidths.nextAdvDate;
      this.drawCell(
        doc,
        x,
        currentY,
        colWidths.nextCei,
        rowHeight,
        teacher.nextCei
      );
      x += colWidths.nextCei;
      this.drawCell(doc, x, currentY, colWidths.observation, rowHeight, "");

      currentY += rowHeight;
    });

    doc.y = currentY;
  }

  private drawCell(
    doc: InstanceType<typeof PDFDocument>,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ): void {
    doc.rect(x, y, width, height).stroke();
    doc.text(text, x + 2, y + 5, {
      width: width - 4,
      height: height - 4,
      align: "left",
      ellipsis: true,
    });
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR");
  }
}
