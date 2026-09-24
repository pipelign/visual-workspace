#!/usr/bin/env python3
"""Check the pinned skill snapshot and repo-local agent adapters, offline."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]


def check_setup(root: Path) -> list[str]:
    errors: list[str] = []
    lock_path = root / ".agents/matt-pocock-skills.lock.json"
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    if lock["version"] != 1:
        return ["Unsupported skill lock version"]
    if not re.fullmatch(r"[0-9a-f]{40}", lock["revision"]):
        errors.append("Lock revision must be a full commit SHA")
    if not lock["skills"]:
        errors.append("The vendored skill selection is empty")

    skills_root = root / ".agents/skills"
    names: set[str] = set()
    for skill in lock["skills"]:
        name = skill["name"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            errors.append(f"Invalid skill name: {name}")
            continue
        if name in names:
            errors.append(f"Duplicate skill in lock: {name}")
        names.add(name)
        folder = skills_root / name
        expected = skill["files"]
        if "SKILL.md" not in expected:
            errors.append(f"{name}: lock is missing SKILL.md")
        actual = {
            path.relative_to(folder).as_posix()
            for path in folder.rglob("*")
            if path.is_file() or path.is_symlink()
        }
        for missing in sorted(set(expected) - actual):
            errors.append(f"{name}: missing {missing}")
        for extra in sorted(actual - set(expected)):
            errors.append(f"{name}: unexpected file {extra}")
        for relative in sorted(actual & set(expected)):
            path = folder / relative
            if path.is_symlink():
                errors.append(f"{name}: vendored file is a symlink: {relative}")
            elif hashlib.sha256(path.read_bytes()).hexdigest() != expected[relative]:
                errors.append(f"{name}: modified {relative}")

    license_path = root / lock["license"]["path"]
    if not license_path.is_file():
        errors.append("Missing upstream license")
    elif hashlib.sha256(license_path.read_bytes()).hexdigest() != lock["license"]["sha256"]:
        errors.append("Upstream license differs from the recorded snapshot")

    canonical = {
        folder.name: folder
        for folder in skills_root.iterdir()
        if folder.is_dir()
    }
    for name, folder in sorted(canonical.items()):
        entrypoint = folder / "SKILL.md"
        if not entrypoint.is_file():
            errors.append(f"{name}: missing SKILL.md entrypoint")
            continue
        content = entrypoint.read_text(encoding="utf-8")
        frontmatter = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)", content, re.DOTALL)
        if not frontmatter:
            errors.append(f"{name}: missing YAML frontmatter")
            continue
        header = frontmatter.group(1)
        name_match = re.search(r"^name:[ \t]*(.+)$", header, re.MULTILINE)
        if not name_match or name_match.group(1).strip().strip("'\"") != name:
            errors.append(f"{name}: frontmatter name must match its directory")
        if not re.search(r"^description:[ \t]*\S", header, re.MULTILINE):
            errors.append(f"{name}: missing description")
        if re.search(r"^disable-model-invocation:[ \t]*true[ \t]*$", header, re.MULTILINE):
            policy = folder / "agents/openai.yaml"
            if not policy.is_file() or not re.search(
                r"^\s+allow_implicit_invocation:[ \t]*false[ \t]*$",
                policy.read_text(encoding="utf-8"), re.MULTILINE
            ):
                errors.append(f"{name}: missing matching explicit-only Codex policy")

        alias = root / ".claude/skills" / name
        if not alias.is_symlink() or alias.resolve() != folder.resolve():
            errors.append(f"{name}: Claude adapter must symlink to .agents/skills/{name}")

    adapters = root / ".claude/skills"
    if adapters.is_dir():
        for alias in adapters.iterdir():
            if alias.name not in canonical:
                errors.append(f"Claude adapter has no canonical skill: {alias.name}")

    if (root / "CLAUDE.md").read_text(encoding="utf-8").strip() != "@AGENTS.md":
        errors.append("CLAUDE.md must import the canonical AGENTS.md")
    for relative in (
        "AGENTS.md", "CONTEXT.md", "Project-Charter.md", "docs/architecture.md",
        "docs/engineering.md", "docs/agents/skills.md", "docs/agents/domain.md",
        "docs/agents/issue-tracker.md", "docs/agents/triage-labels.md",
    ):
        if not (root / relative).is_file():
            errors.append(f"Missing referenced guidance: {relative}")
    return errors


def main() -> int:
    try:
        errors = check_setup(ROOT)
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"Agent setup check failed: {error}", file=sys.stderr)
        return 1
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("Agent setup OK: pinned skill files, license, metadata, and adapters match.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
