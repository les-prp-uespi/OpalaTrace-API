export function normalizeString(text: string): string {
    const noAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const noSpaces = noAccents.replace(/\s+/g, "_");
    const allLowercase = noSpaces.toLowerCase();
    return allLowercase;
  }