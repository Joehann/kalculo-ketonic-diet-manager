import { describe, expect, it } from "vitest";
import type { TermsAcceptanceRepositoryPort } from "../ports/TermsAcceptanceRepositoryPort";
import type { TermsStoragePort } from "../ports/TermsStoragePort";
import type { TermsAcceptance } from "../../domain/TermsAcceptance";
import { DuplicateAcceptanceError } from "../../domain/errors/TermsError";
import { buildAcceptTermsCommand } from "./acceptTermsCommand";

describe("AcceptTermsCommand", () => {
  it("accepts terms and records acceptance with timestamp", async () => {
    const acceptances: TermsAcceptance[] = [];

    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save(acceptance) {
        acceptances.push(acceptance);
      },
      async findByParentId() {
        return null;
      },
    };

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: "1.0",
          text: "Non-prescriptive medical disclaimer...",
        };
      },
      async getTermsByVersion() {
        return null;
      },
    };

    const acceptCommand = buildAcceptTermsCommand(repositoryPort, storagePort);
    const result = await acceptCommand("parent-1");

    expect(acceptances).toHaveLength(1);
    expect(acceptances[0].parentId).toBe("parent-1");
    expect(acceptances[0].termsVersion).toBe("1.0");
    expect(acceptances[0].acceptedAt).toBeInstanceOf(Date);
    expect(result.parentId).toBe("parent-1");
  });

  it("throws DuplicateAcceptanceError when parent already accepted current version", async () => {
    const existingAcceptance = {
      parentId: "parent-1",
      acceptedAt: new Date("2026-01-01"),
      termsVersion: "1.0",
    };

    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save() {},
      async findByParentId(parentId) {
        if (parentId === "parent-1") {
          return existingAcceptance;
        }
        return null;
      },
    };

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: "1.0",
          text: "Non-prescriptive medical disclaimer...",
        };
      },
      async getTermsByVersion() {
        return null;
      },
    };

    const acceptCommand = buildAcceptTermsCommand(repositoryPort, storagePort);

    await expect(acceptCommand("parent-1")).rejects.toThrow(
      DuplicateAcceptanceError,
    );
  });

  it("allows re-acceptance when terms version changes", async () => {
    const acceptances: TermsAcceptance[] = [];
    let currentAcceptance: TermsAcceptance = {
      parentId: "parent-1",
      acceptedAt: new Date("2026-01-01"),
      termsVersion: "1.0",
    };

    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save(acceptance) {
        acceptances.push(acceptance);
        currentAcceptance = acceptance;
      },
      async findByParentId(parentId) {
        if (parentId === "parent-1") {
          return currentAcceptance;
        }
        return null;
      },
    };

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: "1.1",
          text: "Updated non-prescriptive medical disclaimer...",
        };
      },
      async getTermsByVersion() {
        return null;
      },
    };

    const acceptCommand = buildAcceptTermsCommand(repositoryPort, storagePort);
    const result = await acceptCommand("parent-1");

    expect(result.termsVersion).toBe("1.1");
    expect(acceptances).toHaveLength(1);
  });
});
