import { useCallback } from "react";

function HighlightedText({ text, query }) {
  const capitalizeWord = useCallback((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }, []);
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Split by the query using regex (global, case-insensitive)
  const parts = lowerText.split(new RegExp(`(${query})`, "gi"));
  console.log(parts);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === lowerQuery;
        const content = i === 0 ? capitalizeWord(part) : part;
        return isMatch ? <strong key={i}>{content}</strong> : content;
      })}
    </>
  );
}

export default HighlightedText;
