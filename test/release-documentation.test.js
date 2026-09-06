import { readFileSync } from "node:fs";

const roadmap = readFileSync("ROADMAP.md", "utf8");
const releaseValidation = readFileSync("docs/release-validation.md", "utf8");
const historicalRoadmap = readFileSync("docs/roadmap.md", "utf8");

function currentHandsOnTag(text) {
    const match = text.match(/\*\*Status: `(1\.20\.0-rc\.\d+)` is the current final hands-on candidate/);
    if (!match) {
        throw new Error("ROADMAP.md does not declare the current final hands-on candidate");
    }
    return match[1];
}

function validationCandidateTag(text) {
    const match = text.match(/^- release: `(1\.20\.0-rc\.\d+)`$/m);
    if (!match) {
        throw new Error("docs/release-validation.md does not declare a prerelease candidate");
    }
    return match[1];
}

test("hands-on validation documentation tracks the authoritative roadmap candidate", () => {
    expect(validationCandidateTag(releaseValidation)).toBe(currentHandsOnTag(roadmap));
});

test("legacy docs roadmap is explicitly historical and points to the root roadmap", () => {
    expect(historicalRoadmap).toMatch(/^# Historical modernization roadmap$/m);
    expect(historicalRoadmap).toContain("[`ROADMAP.md`](../ROADMAP.md)");
    expect(historicalRoadmap).toContain("sole authoritative source");
});
