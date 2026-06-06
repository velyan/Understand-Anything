export type MoyaUnderstandConfig = {
  apiBase?: string;
  projectID?: string;
  projectName?: string;
};

export function readMoyaUnderstandConfig(): MoyaUnderstandConfig | null {
  if (typeof window === "undefined") return null;
  const config = (window as Window & { __MOYA_UNDERSTAND__?: MoyaUnderstandConfig })
    .__MOYA_UNDERSTAND__;
  return config?.apiBase ? config : null;
}

export function buildMoyaAPIPath(apiBase: string, fileName: string): string {
  return `${apiBase.replace(/\/+$/, "")}/${fileName.replace(/^\/+/, "")}`;
}

export function moyaDataUrl(
  fileName: string,
  config: MoyaUnderstandConfig | null = readMoyaUnderstandConfig(),
): string | null {
  return config?.apiBase ? buildMoyaAPIPath(config.apiBase, fileName) : null;
}

export function moyaFileContentUrl(
  filePath: string,
  config: MoyaUnderstandConfig | null = readMoyaUnderstandConfig(),
): string | null {
  if (!config?.apiBase) return null;
  const params = new URLSearchParams({ path: filePath });
  return `${config.apiBase.replace(/\/+$/, "")}/file-content.json?${params.toString()}`;
}
