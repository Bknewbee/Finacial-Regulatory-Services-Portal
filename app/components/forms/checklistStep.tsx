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
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(stepForm),
      });

      if (!res.ok) throw new Error("Failed to save step");

      const data = await res.json();

      if (res.ok) {
        clear();
        setIsLoading(false);
      }

      clear();
      toast.success(data.message);
      onSuccess();
      clearEditing();
    } catch (err) {
      console.error("Error submitting checklist step:", err);
      toast.error("Failed to add checklist step");
      setIsLoading(false);
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
          type="submit"
          className="inline-flex items-center rounded bg-blue-700 px-4 py-2 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="me-2 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 
          50 100.591C22.3858 100.591 0 78.2051 0 
          50.5908C0 22.9766 22.3858 0.59082 50 
          0.59082C77.6142 0.59082 100 22.9766 
          100 50.5908ZM9.08144 50.5908C9.08144 
          73.1895 27.4013 91.5094 50 91.5094C72.5987 
          91.5094 90.9186 73.1895 90.9186 
          50.5908C90.9186 27.9921 72.5987 9.67226 
          50 9.67226C27.4013 9.67226 9.08144 
          27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 
          97.8624 35.9116 97.0079 33.5539C95.2932 
          28.8227 92.871 24.3692 89.8167 20.348C85.8452 
          15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
          4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
          0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
          1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
          9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
          9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
          10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
          17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
          28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
          38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </>
          ) : editingChecklistStep ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
}
