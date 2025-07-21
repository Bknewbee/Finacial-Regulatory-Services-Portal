import { useState, useEffect } from "react";
import ChecklistStepList from "../views/ChecklistStepList";
import ChecklistStepForm from "../forms/checklistStep";
import { Checkliststep } from "@/app/types/checklistStep";

let debounceTimer: NodeJS.Timeout;

// Static list for demo; can be fetched from backend in production
// setLicenseTypes([
//   "banking",
//   "insurance",
//   "microfinance",
//   "pension",
//   "other",
// ]);

export default function CheckilstItemDashboard() {
  const [checklistSteps, setChecklistSteps] = useState<Checkliststep[]>([]);
  const [editingChecklistStep, setEditingChecklistStep] =
    useState<Checkliststep | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<string>("");
  const [custom_license_type, setCustomLicense] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const effectiveLicense =
    selectedLicense === "other" ? custom_license_type : selectedLicense;

  const getList = async (license: string) => {
    if (!license) {
      setIsLoading(false);
      return;
    }
    const res = await fetch(`/api/checklist-step?license_type=${license}"`);
    const data = await res.json();
    setChecklistSteps(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (effectiveLicense) {
      console.log(effectiveLicense);

      clearTimeout(debounceTimer);
      setIsLoading(true);
      debounceTimer = setTimeout(() => getList(effectiveLicense), 1000);
    } else {
      setChecklistSteps([]);
      setIsLoading(false);
    }
    return () => clearTimeout(debounceTimer);
  }, [effectiveLicense]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label htmlFor="license" className="text-lg font-medium">
          License Type:
        </label>
        <select
          id="license"
          value={selectedLicense}
          onChange={(e) => setSelectedLicense(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">-- Select --</option>
          <option value="microlending">Microlending</option>
          <option value="insurance">Insurance</option>
          <option value="banking">Banking</option>
          <option value="pension">Pension</option>
          <option value="other">Other</option>
        </select>

        {selectedLicense === "other" && (
          <input
            type="text"
            placeholder="Enter license type"
            value={custom_license_type}
            onChange={(e) => setCustomLicense(e.target.value)}
            className="rounded border p-2"
            required
          />
        )}
      </div>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        effectiveLicense && (
          <>
            <ChecklistStepForm
              activeLicense={effectiveLicense}
              checklistSteps={checklistSteps}
              onSuccess={() => getList(effectiveLicense)}
              editingChecklistStep={editingChecklistStep}
              clearEditing={() => setEditingChecklistStep(null)}
            />
            <ChecklistStepList
              checklistSteps={checklistSteps}
              refresh={() => getList(effectiveLicense)}
              onEdit={(checklist) => setEditingChecklistStep(checklist)}
            />
          </>
        )
      )}
      {/* {effectiveLicense && (
        
        <>
          <ChecklistStepForm
            onSuccess={() => getList(selectedLicense)}
            editingChecklistStep={editingChecklistStep}
            clearEditing={() => setEditingChecklistStep(null)}
          />
          <ChecklistStepList
            checklistSteps={checklistSteps}
            refresh={() => getList(selectedLicense)}
            onEdit={(checklist) => setEditingChecklistStep(checklist)}
          />
        </>
      )} */}
    </div>
  );
}
