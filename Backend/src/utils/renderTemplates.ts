import fs from "fs";
import path from "path";

export const renderTemplate = (
  templateName: string,
  variables: Record<string, string>
): string => {
  let filePath = path.join(process.cwd(), "src", "templates", templateName);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "dist", "templates", templateName);
  }

  if (!fs.existsSync(filePath)) {
     // Fallback to __dirname relative path if absolute process.cwd paths fail
     filePath = path.join(__dirname, "..", "templates", templateName);
  }

  let html = fs.readFileSync(filePath, "utf-8");

  for (const key in variables) {
    html = html.replace(
      new RegExp(`{{${key}}}`, "g"),
      variables[key]
    );
  }

  return html;
};
