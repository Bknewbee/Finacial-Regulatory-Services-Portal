import { JSX } from "react";

export function formatPlainTextToJSX(text: string): JSX.Element {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];

  lines.forEach((line, idx) => {
    // Match numbered list: e.g., 1. Some text
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const content = parseInlineBold(numberedMatch[2]);
      listItems.push(<li key={idx}>{content}</li>);
      return;
    }

    // If listItems exists and we reach a non-numbered line, flush the list
    if (listItems.length > 0) {
      elements.push(
        <ol key={`list-${idx}`} className="list-decimal space-y-1 pl-5">
          {listItems}
        </ol>,
      );
      listItems = [];
    }

    // Handle inline bold for normal paragraphs
    elements.push(
      <p key={idx} className="py-1">
        {parseInlineBold(line)}
      </p>,
    );
  });

  // Flush any remaining list at the end
  if (listItems.length > 0) {
    elements.push(
      <ol key={`list-${listItems}`} className="list-decimal space-y-1 pl-5">
        {listItems}
      </ol>,
    );
  }

  return <>{elements}</>;
}

// Helper to parse inline bold (e.g. "some **bold** word")
function parseInlineBold(line: string): JSX.Element[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/); // split and keep **bold**
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
