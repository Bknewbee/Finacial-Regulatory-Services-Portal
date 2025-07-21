import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Checkliststep } from "@/app/types/checklistStep";

type Props = {
  onSuccess: () => void;
  editingChecklistStep: Checkliststep | null;
  clearEditing: () => void;
  activeLicense: string;
  checklistSteps: Checkliststep[];
};

export default function ChecklistStepForm({
  onSuccess,
  editingChecklistStep,
  clearEditing,
  activeLicense,
  checklistSteps,
}: Props) {
  const [stepForm, setStepForm] = useState({
    license_type: activeLicense,
    custom_license_type: "",
    order: 0,
    step: "",
    reference_section: "",
    notes: "",
    linkedDocTitle: "",
  });
  const [isDuplicateOrder, setIsDuplicateOrder] = useState(false);

  //const [licenseTypes, setLicenseTypes] = useState<string[]>([]);

  const clear = () => {
    setStepForm({
      license_type: activeLicense,
      custom_license_type: "",
      order: 0,
      step: "",
      reference_section: "",
      notes: "",
      linkedDocTitle: "",
    });
  };

  const addStep = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingChecklistStep
      ? `/api/checklist-step/${editingChecklistStep._id}`
      : "/api/checklist-step";
    const method = editingChecklistStep ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(stepForm),
      });

      if (!res.ok) throw new Error("Failed to save step");

      const data = await res.json();

      if (res.ok) {
        clear();
      }

      clear();
      toast.success(data.message);
      onSuccess();
      clearEditing();
    } catch (err) {
      console.error("Error submitting checklist step:", err);
      toast.error("Failed to add checklist step");
    }
  };

  useEffect(() => {
    const isDuplicate =
      !editingChecklistStep && // only check for new creation
      checklistSteps.some((step) => step.order === stepForm.order);
    setIsDuplicateOrder(isDuplicate);

    if (editingChecklistStep) {
      setStepForm(editingChecklistStep);
      console.log(editingChecklistStep);
    }
  }, [editingChecklistStep, stepForm.order, checklistSteps]);

  return (
    <form onSubmit={addStep} className="mb-8 grid gap-3">
      {/* <select
        value={stepForm.license_type ?? ""}
        onChange={(e) =>
          setStepForm((f) => ({ ...f, license_type: e.target.value }))
        }
        className="rounded border p-2"
        required
      >
        <option value="">Select License Type</option>
        {licenseTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
      {stepForm.license_type === "other" && (
        <input
          type="text"
          placeholder="Enter license type"
          value={stepForm.custom_license_type ?? ""}
          onChange={(e) =>
            setStepForm((f) => ({ ...f, custom_license_type: e.target.value }))
          }
          className="rounded border p-2"
          required
        />
      )}
      <hr className="mx-auto w-[80%]" /> */}

      <input
        type="number"
        placeholder="Order"
        value={stepForm.order ?? ""}
        min={1}
        onChange={(e) =>
          setStepForm((f) => ({ ...f, order: Number(e.target.value) }))
        }
        className="rounded border p-2"
        required
      />
      {isDuplicateOrder && (
        <p className="px-5 text-sm font-medium text-red-600">
          A step with this order already exists. Please choose a different
          order.
        </p>
      )}

      <textarea
        placeholder="Step Description"
        value={stepForm.step ?? ""}
        onChange={(e) => setStepForm((f) => ({ ...f, step: e.target.value }))}
        className="rounded border p-2"
        required
      />

      <input
        placeholder="Reference Section"
        value={stepForm.reference_section ?? ""}
        onChange={(e) =>
          setStepForm((f) => ({ ...f, reference_section: e.target.value }))
        }
        className="rounded border p-2"
        required
      />

      <input
        placeholder="Notes (optional)"
        value={stepForm.notes ?? ""}
        onChange={(e) => setStepForm((f) => ({ ...f, notes: e.target.value }))}
        className="rounded border p-2"
      />

      <input
        placeholder="Linked Document Title (optional)"
        value={stepForm.linkedDocTitle ?? ""}
        onChange={(e) =>
          setStepForm((f) => ({ ...f, linkedDocTitle: e.target.value }))
        }
        className="rounded border p-2"
      />

      <div className="flex w-full justify-between px-5">
        <button
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            clearEditing();
            clear();
          }}
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          Clear
        </button>
        <button
          disabled={isDuplicateOrder}
          type="submit"
          className={`rounded px-4 py-2 text-white ${
            isDuplicateOrder ? "cursor-not-allowed bg-gray-400" : "bg-blue-700"
          }`}
        >
          {editingChecklistStep ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
