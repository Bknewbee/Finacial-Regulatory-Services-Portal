import { useState } from "react";

const allTags = [
  "#AML",
  "#RiskFramework",
  "#EPSLicensing",
  "#Governance",
  "#TrustAccount",
  "#CapitalRequirements",
  "#Compliance",
  "#Remittance",
  "#BusinessPlan",
  "#BotswanaRegulations",
];

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [inputTag, setInputTag] = useState("");

  const addTag = (tag: string) => {
    const formatted = tag.trim().startsWith("#")
      ? tag.trim()
      : `#${tag.trim()}`;
    if (formatted && !tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputTag.trim()) {
      e.preventDefault();
      addTag(inputTag);
      setInputTag("");
    } else if (e.key === "Backspace" && inputTag === "") {
      removeTag(tags.length - 1);
    }
  };

  const filteredSuggestions = allTags.filter(
    (t) =>
      t.toLowerCase().includes(inputTag.toLowerCase()) && !tags.includes(t),
  );

  return (
    <div className="rounded border p-2">
      <div className="mb-1 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="flex items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(i)}
              className="ml-1 text-blue-500 hover:text-red-500"
              aria-label="Remove tag"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          className="min-w-[100px] flex-grow text-sm outline-none"
          placeholder="Add tag and press Enter"
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {inputTag && filteredSuggestions.length > 0 && (
        <ul className="mt-1 max-h-28 overflow-y-auto rounded border bg-white text-sm shadow">
          {filteredSuggestions.map((t, i) => (
            <li
              key={i}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
              onMouseDown={() => {
                addTag(t);
                setTimeout(() => setInputTag(""), 0);
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
