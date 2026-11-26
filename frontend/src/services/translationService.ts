const API =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export async function translateText(
  text: string,
  language: string
): Promise<string> {
  if (language === "en") return text;

  const response = await fetch(`${API}/translation/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      text,
    }),
  });

  const data = await response.json();

  return data.translation;
}