---
name: artistic-mdri-flow
description: Transform raw medical device regulations into comprehensive summaries, professional reports, and reusable AI skills. Use this skill when the user provides regulatory text (e.g., FDA guidances, ISO standards) and wants a structured, research-grounded intelligence report.
---

# Artistic MDRI Flow

A specialized workflow for Medical Device Regulation Intelligence (MDRI) that uses a 3-step agentic chain to ensure accuracy, professional formatting, and knowledge persistence.

## Workflow Overview

1.  **Web Research & Summary**: Transform raw input into a 2000-word summary grounded in current web data using `googleSearch`.
2.  **Report Generation**: Align the summary with a professional template (e.g., FDA PMA/HDE format).
3.  **Skill Creation**: Analyze the process and generate a `skill.md` file for future reuse of the specific regulatory logic.

## Step 1: Web Research & Summary

When triggered with regulatory text:
- Use `googleSearch` to find the latest related guidances from FDA, EU MDR, or other relevant bodies.
- Extract key requirements, risks, and global context.
- Output a comprehensive Markdown summary including an "Evidence Map" (table of sources).

## Step 2: Professional Report Generation

Take the summary from Step 1 and:
- Align it with the user-provided template or the default FDA QMSR template.
- Ensure professional tone and strict adherence to headings.
- Include "Small Conclusions" (小結) for each major section.

## Step 3: Skill Meta-Cognition

Analyze the successful report generation:
- Identify the specific prompts, search queries, and logic that worked.
- Generate a `skill.md` file that allows another agent to replicate this specific regulatory task.

## Quality Checklist

- [ ] Does the summary cite at least 3 external web sources?
- [ ] Does the report follow the template headings exactly?
- [ ] Is the language consistent (English or Traditional Chinese) as requested?
- [ ] Does the `skill.md` include clear triggers and methodology?
