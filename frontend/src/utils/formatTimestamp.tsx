export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  console.log({ date });
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", isoString);
    return "Invalid date";
  }

  return date.toLocaleTimeString("en-IL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
