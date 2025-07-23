"use client";
import { toast } from "react-hot-toast";
import { Doc } from "@/app/types/doc";

type Props = {
  docs: Doc[];
  refresh: () => void;
  onEdit: (doc: Doc) => void;
};

export default function DocumentList({ docs, refresh, onEdit }: Props) {
  //const [docs, setDocs] = useState<Doc[]>([]);
  const url = "api/documents";

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
        console.log("Error deleting document", err);
      }
    }
  };

  // const getList = async () => {
  //   refresh();
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   refresh();
  // };

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Uploaded Documents</h2>
      <div className="space-y-4">
        {docs?.map((doc) => (
          <div
            key={doc._id}
            className="relative rounded border p-4 pb-10 shadow"
          >
            <p>
              <strong>Title:</strong> {doc.title}
            </p>
            <p>
              <strong>Type:</strong> {doc.type}
            </p>
            {doc.description && (
              <p>
                <strong>Description:</strong> {doc.description}
              </p>
            )}
            {(doc.tags?.length ?? 0) > 0 && (
              <p>
                <strong>Tags:</strong> {doc.tags!.join(", ")}
              </p>
            )}

            {doc.savedPath ? (
              <p>
                <strong>File:</strong>{" "}
                <a
                  href={doc.savedPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>
            ) : (
              <p className="text-red-600">No file available</p>
            )}

            <div className="absolute right-1 bottom-1 flex space-x-2">
              <button
                onClick={() => {
                  onEdit(doc);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="me-2 mb-1 rounded-lg border border-gray-200 bg-white px-5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={(e: React.MouseEvent) => deleteItem(doc._id, e)}
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
