import { describe, expect, it } from "vitest";
import { buildMoyaAPIPath, moyaDataUrl, moyaFileContentUrl } from "../moyaEmbed";

describe("Moya embedded dashboard URLs", () => {
  it("builds API paths from a Moya-provided base URL", () => {
    expect(buildMoyaAPIPath("/workspace/session/understand/api/project/", "/meta.json"))
      .toBe("/workspace/session/understand/api/project/meta.json");
  });

  it("loads graph artifacts from the embedded API base", () => {
    expect(moyaDataUrl("knowledge-graph.json", {
      apiBase: "/workspace/session/understand/api/project-id",
    })).toBe("/workspace/session/understand/api/project-id/knowledge-graph.json");
  });

  it("omits dev-server tokens for embedded source-file requests", () => {
    expect(moyaFileContentUrl("src/App.tsx", {
      apiBase: "/workspace/session/understand/api/project-id/",
    })).toBe("/workspace/session/understand/api/project-id/file-content.json?path=src%2FApp.tsx");
  });
});
