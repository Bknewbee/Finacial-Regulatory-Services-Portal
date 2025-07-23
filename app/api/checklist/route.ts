import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { ChecklistStep } from "@/app/models/ChecklistStep";
import { jsPDF } from "jspdf";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const rawLicenseType = searchParams.get("license_type") || "";
  const licenseType = rawLicenseType.replace(/^"|"$/g, "").trim();

  const query =
    licenseType.length > 0
      ? {
          $or: [
            { license_type: licenseType },
            { custom_license_type: licenseType },
          ],
        }
      : {};

  console.log("Query used:", query);

  const steps = await ChecklistStep.find(query).sort({ order: 1 });
  console.log("Checklist steps found:", steps.length);

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Filtered Checklist", 10, 10);

  let y = 20;

  steps.forEach((step, i) => {
    const license =
      step.license_type === "other"
        ? step.custom_license_type
        : step.license_type;

    const stepTitle = step.step || `Step ${i + 1}`;

    doc.setFontSize(11);
    doc.text(`Step ${i + 1}: ${stepTitle}`, 10, y);

    // Draw checkbox at the right edge
    doc.setLineWidth(0.5);
    doc.rect(190, y - 3, 5, 5); // x, y, width, height

    y += 6;

    if (step.description) {
      const descLines = doc.splitTextToSize(
        `Description: ${step.description}`,
        180,
      );
      doc.text(descLines, 10, y);
      y += descLines.length * 6;
    }

    if (step.reference_section) {
      doc.text(`Reference: ${step.reference_section}`, 10, y);
      y += 6;
    }

    doc.text(`License: ${license}`, 10, y);
    y += 6;

    if (step.order !== undefined) {
      doc.text(`Order: ${step.order}`, 10, y);
      y += 6;
    }

    // Divider line
    doc.setDrawColor(200);
    doc.line(10, y, 200, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  const pdf = doc.output("arraybuffer");
  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="checklist.pdf"`,
    },
  });
}
