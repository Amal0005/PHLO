import fs from "fs";
import path from "path";

export const renderTemplate = (
  templateName: string,
  variables: Record<string, string>
): string => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    templateName
  );

  let html = fs.readFileSync(filePath, "utf-8");

  for (const key in variables) {
    html = html.replace(
      new RegExp(`{{${key}}}`, "g"),
      variables[key]
    );
  }

  return html;
};
