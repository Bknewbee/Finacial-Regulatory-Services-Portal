"use client";
import { Checkliststep } from "@/app/types/checklistStep";
import toast from "react-hot-toast";

type Props = {
  checklistSteps: Checkliststep[];
  refresh: () => void;
  onEdit: (checklist: Checkliststep) => void;
};

export default function ChecklistStepList({
  checklistSteps,
  refresh,
  onEdit,
}: Props) {
  const url = "/api/checklist-step";

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();

    const options = {
      method: "DELETE",
    };
    if (window.confirm("are you sure you want to delete this document?")) {
      try {
        const res = await fetch(`${url}/${id}`, options);
        const data = await res.json();

        if (data.success) {
          toast.success(data.message);
          refresh();
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Deletion failed");
        console.log("Error deleting checklist step", err);
      }
    }
  };

  // useEffect(() => {
  //   fetch("/api/checklist-step")
  //     .then((res) => res.json())
  //     .then(setSteps)
  //     .catch(console.error);
  // }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Saved Checklist Steps</h2>
      <div className="space-y-3">
        {checklistSteps.map((step) => (
          <div
            key={step._id}
            className="relative rounded border p-3 pb-14 shadow-sm"
          >
            <p>
              <strong>License:</strong>{" "}
              {step.license_type === "other"
                ? step.custom_license_type
                : step.license_type}
            </p>
            <p>
              <strong>Order:</strong> {step.order}
            </p>
            <p>
              <strong>Step:</strong> {step.step}
            </p>
            <p>
              <strong>Reference:</strong> {step.reference_section}
            </p>
            {step.notes && (
              <p>
                <strong>Notes:</strong> {step.notes}
              </p>
            )}
            {step.linkedDocTitle && (
              <p>
                <strong>Doc:</strong> {step.linkedDocTitle}
              </p>
            )}
            <div className="absolute right-1 bottom-1 flex space-x-2">
              <button
                onClick={() => {
                  onEdit(step);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="me-2 mb-1 rounded-lg border border-gray-200 bg-white px-5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={(e: React.MouseEvent) => deleteItem(step._id, e)}
                className="me-2 mb-1 rounded-lg border border-red-200 bg-red-600 px-5 py-1.5 text-sm font-medium text-gray-900 hover:border-red-600 hover:bg-red-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
