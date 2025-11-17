import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 18, fontSize: 9 },
  header: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  subHeader: { fontSize: 11, marginBottom: 12 },
  section: { marginBottom: 12 },
  row: { flexDirection: "row" },
  th: { borderWidth: 1, borderColor: "#ddd", padding: 4, fontWeight: 700 },
  td: { borderWidth: 1, borderColor: "#ddd", padding: 4 },
  num: { width: 24, textAlign: "center" },
  name: { width: 150 },
  matricule: { width: 70 },
  birth: { width: 85 },
  hire: { width: 95 },
  diploma: { width: 110 },
  lastDate: { width: 85 },
  lastCEI: { width: 70 },
  lastGroup: { width: 155 },
  newDate: { width: 85 },
  newCEI: { width: 70 },
  newGroup: { width: 155 },
  obs: { width: 120 },
  ad: { width: 40 },
  ud: { width: 40 },
  sigGroup: { width: 80 },
  zero: { width: 0 },
  tableHeader: { backgroundColor: "#f5f5f5", fontWeight: 700 },
});

export async function generateAdvancementPdfBlob({
  period,
  teachersByInstitution,
  totalTeachers,
}: any): Promise<Blob> {
  const fmt = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("fr-FR");
  };

  const Doc = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.section}>
          <Text style={styles.header}>Liste d'Avancement</Text>
          <Text style={styles.subHeader}>
            Période: {fmt(period.startDate)} - {fmt(period.endDate)} | Enseignants: {totalTeachers}
          </Text>
        </View>
        {teachersByInstitution.map((inst: any, idx: number) => (
          <View key={idx} style={styles.section} wrap>
            <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              {inst.institution.fullname} ({inst.institution.abbreviation}) - {inst.total} enseignant(s)
            </Text>
            {inst.byGrade.map((g: any, gIdx: number) => (
              <View key={gIdx} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, marginBottom: 4 }}>{g.grade} ({g.teachers.length})</Text>
                {/* Header row 1 (grouped) -> 13 columns (no action column) */}
                <View style={[styles.row, styles.tableHeader]}>
                  <Text style={[styles.th, styles.num]}>N°</Text>
                  <Text style={[styles.th, styles.name]}>Noms et Prénoms</Text>
                  <Text style={[styles.th, styles.matricule]}>Matricule</Text>
                  <Text style={[styles.th, styles.birth]}>Date Naissance</Text>
                  <Text style={[styles.th, styles.hire]}>Date Prise Service</Text>
                  <Text style={[styles.th, styles.diploma]}>Dernier Diplôme</Text>
                  <Text style={[styles.th, styles.lastGroup]}>Dernier Avancement</Text>
                  <Text style={[styles.th, styles.newGroup]}>Nouvel Avancement</Text>
                  <Text style={[styles.th, styles.obs]}>Observation</Text>
                  <Text style={[styles.th, styles.sigGroup]}>Signatures</Text>
                </View>
                {/* Header row 2 (sub columns) */}
                <View style={[styles.row, styles.tableHeader]}>
                  <Text style={[styles.th, styles.num]}></Text>
                  <Text style={[styles.th, styles.name]}></Text>
                  <Text style={[styles.th, styles.matricule]}></Text>
                  <Text style={[styles.th, styles.birth]}></Text>
                  <Text style={[styles.th, styles.hire]}></Text>
                  <Text style={[styles.th, styles.diploma]}></Text>
                  <Text style={[styles.th, styles.lastDate]}>Date</Text>
                  <Text style={[styles.th, styles.lastCEI]}>CEInd</Text>
                  <Text style={[styles.th, styles.newDate]}>Date</Text>
                  <Text style={[styles.th, styles.newCEI]}>CEInd</Text>
                  <Text style={[styles.th, styles.obs]}></Text>
                  <Text style={[styles.th, styles.ad]}>AD</Text>
                  <Text style={[styles.th, styles.ud]}>UD</Text>
                </View>
                {g.teachers.map((t: any, i: number) => (
                  <View key={t.id} style={styles.row} wrap>
                    <Text style={[styles.td, styles.num]}>{i + 1}</Text>
                    <Text style={[styles.td, styles.name]}>{t.lastname} {t.firstname}</Text>
                    <Text style={[styles.td, styles.matricule]}>{t.matricule}</Text>
                    <Text style={[styles.td, styles.birth]}>{fmt(t.birthdate)}</Text>
                    <Text style={[styles.td, styles.hire]}>{fmt(t.hireDate)}</Text>
                    <Text style={[styles.td, styles.diploma]}>{t.lastDiploma}</Text>
                    <Text style={[styles.td, styles.lastDate]}>{fmt(t.lastAdvancementDate)}</Text>
                    <Text style={[styles.td, styles.lastCEI]}>{t.cei}</Text>
                    <Text style={[styles.td, styles.newDate]}>{fmt(t.nextAdvancementDate)}</Text>
                    <Text style={[styles.td, styles.newCEI]}>{t.nextCei}</Text>
                    <Text style={[styles.td, styles.obs]}></Text>
                    <Text style={[styles.td, styles.ad]}></Text>
                    <Text style={[styles.td, styles.ud]}></Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );

  const blob = await pdf(Doc).toBlob();
  return blob;
}
