# Graph Report - cs-kickstart  (2026-06-17)

## Corpus Check
- 60 files · ~29,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 503 nodes · 524 edges · 56 communities (34 shown, 22 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2cdce1e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Proj-Init Commands & Source Docs|Proj-Init Commands & Source Docs]]
- [[_COMMUNITY_Graphify Pipeline Core|Graphify Pipeline Core]]
- [[_COMMUNITY_Proj-Init Governance & Enforcement|Proj-Init Governance & Enforcement]]
- [[_COMMUNITY_Proj-Init Steps 3-8 & Outputs|Proj-Init Steps 3-8 & Outputs]]
- [[_COMMUNITY_Extraction Rules & WatchHooks|Extraction Rules & Watch/Hooks]]
- [[_COMMUNITY_Repo Adapters & Merge-is-Final|Repo Adapters & Merge-is-Final]]
- [[_COMMUNITY_GitHub Copilot Proj-Init Prompts|GitHub Copilot Proj-Init Prompts]]
- [[_COMMUNITY_Graphify Query & MCP Access|Graphify Query & MCP Access]]
- [[_COMMUNITY_Doc StatusUpdate Workflow|Doc Status/Update Workflow]]
- [[_COMMUNITY_TypeScript Source Stub|TypeScript Source Stub]]
- [[_COMMUNITY_Claude Settings & Enforcement Hook|Claude Settings & Enforcement Hook]]
- [[_COMMUNITY_Graph DB Cypher Exports|Graph DB Cypher Exports]]
- [[_COMMUNITY_SVGGraphML Export|SVG/GraphML Export]]
- [[_COMMUNITY_Wiki Export|Wiki Export]]
- [[_COMMUNITY_Explain Node|Explain Node]]
- [[_COMMUNITY_Shortest Path|Shortest Path]]
- [[_COMMUNITY_Cluster-Only Rerun|Cluster-Only Rerun]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]

## God Nodes (most connected - your core abstractions)
1. `Shared Project Initiation Runner` - 14 edges
2. `PRD.md — Product Requirements Document` - 14 edges
3. `Design: Standardized Output Templates for Project-Initiation Documents` - 13 edges
4. `Graphify Pipeline` - 13 edges
5. `_steps.yml (step registry/metadata)` - 12 edges
6. `What You Must Do When Invoked` - 11 edges
7. `Step 6: AI Tool Guide` - 11 edges
8. `AI-TOOL-GUIDE.md — Rules for AI Tools` - 11 edges
9. `/graphify` - 10 edges
10. `ARCHITECTURE.md — System Architecture` - 10 edges

## Surprising Connections (you probably didn't know these)
- `graphify Skill Pointer (.claude)` --conceptually_related_to--> `graphify query-first workflow for codebase questions`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `doc-status.md shared workflow` --conceptually_related_to--> `Merge-is-final governance (no draft files, no status flags)`  [INFERRED]
  docs/guides/proj-init/doc-status.md → README.md
- `doc-update.md shared workflow (impact analyzer)` --conceptually_related_to--> `Five-move branch -> PR -> merge step loop`  [INFERRED]
  docs/guides/proj-init/doc-update.md → README.md
- `CS Project Kickstart README` --references--> `_steps.yml (step registry/metadata)`  [EXTRACTED]
  README.md → docs/guides/proj-init/_steps.yml
- `Lean header block template anatomy` --rationale_for--> `Merge-is-final governance (no draft files, no status flags)`  [EXTRACTED]
  docs/superpowers/specs/2026-06-13-proj-init-doc-templates-design.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Step commands load runner + steps.yml + step guide as unified workflow** — commands_proj_init_product, proj_init_run_step, proj_init_steps_yml [EXTRACTED 1.00]
- **Product Owner and Architect co-review Step 4 ARCHITECTURE via shared steps.yml gate** — roles_product_owner, roles_solution_architect, proj_init_architecture_doc, proj_init_steps_yml [EXTRACTED 1.00]
- **Template standardization wires templates into runner, steps.yml, and lean header governance** — specs_proj_init_doc_templates_design, proj_init_run_step, proj_init_steps_yml, concept_lean_header_block [EXTRACTED 1.00]
- **Project Initiation Step Prompts (Steps 2-8)** — prompts_proj_init_product, prompts_proj_init_prd, prompts_proj_init_architecture, prompts_proj_init_techstack, prompts_proj_init_aitoolguide, prompts_proj_init_readme, prompts_proj_init_backlog [EXTRACTED 1.00]
- **Proj-Init Three-Source Workflow** — prompts_proj_init_runner, prompts_proj_init_steps_yml, prompts_proj_init_precedence [EXTRACTED 1.00]
- **Graphify AST + Semantic Extraction Merge Flow** — graphify_skill_structural_extraction, graphify_skill_semantic_extraction, graphify_skill_extraction_cache, graphify_skill_subagent_dispatch [EXTRACTED 1.00]
- **Project Initiation Document Derivation Chain** — proj_init_product_md, proj_init_prd_md, proj_init_architecture_md, proj_init_tech_stack_md, proj_init_ai_tool_guide_md, proj_init_readme_md, proj_init_backlog_md [EXTRACTED 1.00]
- **Shared Runner / Registry / Guide Execution Model** — proj_init__run_step, proj_init__steps_yml, proj_init__overview, proj_init_five_move_loop [EXTRACTED 1.00]
- **Step 1 Governance Gate Mechanisms** — proj_init_branch_protection, proj_init_required_reviewer_policy, proj_init_preflight_checks, proj_init_approval_gate [EXTRACTED 1.00]

## Communities (56 total, 22 thin omitted)

### Community 0 - "Proj-Init Commands & Source Docs"
Cohesion: 0.07
Nodes (34): graphify Skill Pointer (.claude), Project Init AI Tool Guide, Project Init Architecture, Project Init Backlog, /proj-init-doc-status — Project Initiation Status, /proj-init-doc-update — Update a source-of-truth document, Project Init PRD, Project Init Product (+26 more)

### Community 1 - "Graphify Pipeline Core"
Cohesion: 0.07
Nodes (34): graphify add URL Ingest, Watcher Debounce, Folder Watcher (--watch), Token Reduction Benchmark, Calls Edge Direction Rule, Confidence Score Rubric, Hyperedges, Node ID Format Rule (+26 more)

### Community 2 - "Proj-Init Governance & Enforcement"
Cohesion: 0.09
Nodes (25): Goal, Objective, Reviewer checklist, Rules, Step 2: Product Concept, What This Document Covers, Why This Matters, PR/MR Approval Gate (+17 more)

### Community 3 - "Proj-Init Steps 3-8 & Outputs"
Cohesion: 0.06
Nodes (39): Goal, Objective, Reviewer checklist, Rules, Step 5: Tech Stack, Top Up CONTRIBUTING.md (Tooling Layer), What This Document Covers, Why This Matters (+31 more)

### Community 4 - "Extraction Rules & Watch/Hooks"
Cohesion: 0.08
Nodes (25): Project Initiation Guide Overview, Branch-vs-main as Draft-vs-Final, Branch-per-step Workflow (init/<step>), In-progress branches, "Next" callout rules, Nothing else, Open PRs, Project Initiation Document Status (+17 more)

### Community 5 - "Repo Adapters & Merge-is-Final"
Cohesion: 0.08
Nodes (24): Audit Trail (EXTRACTED/INFERRED/AMBIGUOUS), For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands (+16 more)

### Community 6 - "GitHub Copilot Proj-Init Prompts"
Cohesion: 0.33
Nodes (10): Proj-Init AI Tool Guide (Step 6), Proj-Init Architecture (Step 4), Proj-Init Backlog (Step 8), Proj-Init PRD (Step 3), Proj-Init Precedence Rule, Proj-Init Product (Step 2), Proj-Init README (Step 7), Proj-Init Shared Runner (_run-step.md) (+2 more)

### Community 7 - "Graphify Query & MCP Access"
Cohesion: 0.33
Nodes (7): Graphify MCP Server, Fast Path Query (existing graph), graph.json Output, Native CLAUDE.md Integration, save-result Feedback Loop, Graph Query Traversal (BFS/DFS), Constrained Query Vocabulary Expansion

### Community 8 - "Doc Status/Update Workflow"
Cohesion: 0.67
Nodes (3): Proj-Init Doc Status, Proj-Init Doc Update, Proj-Init Review Gate (PR)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (20): 10. Out of scope, 11. Impact surface, 12. Amended during build (2026-06-17), 1. Problem, 2. Goal, 3. Decisions locked during brainstorming, 4. File layout, 5. Standard template anatomy (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (20): 1. Required-reviewer policy *(host-enforced mode only)*, 2. Branch protection on `main`, 3. `CONTRIBUTING.md` — governance layer, Azure DevOps (`az repos`), Bitbucket (REST API or web UI), Enforcement modes, Evidence required, GitHub (`gh`) (+12 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (14): 10. Dependencies & Assumptions, 11. Constraints (Non-Architectural), 12. Risks & Edge Cases, 1. Overview, 2. Target Users, 3. Problem Statements, 4. Features / Capabilities, 5. User Stories (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (11): 10. Workflow Conventions, 1. Project Context, 2. Coding Conventions, 3. Scope Boundaries, 4. Banned Patterns, 5. Testing Rules, 6. Documentation Rules, 7. Decision Escalation (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (11): Challenge sequence, During Document Creation, During Document Updates, During PR/MR Review, During Step 4 co-review, Hard Limits, More pointers to avoid assumptions, PR/MR block conditions (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (11): Challenge sequence, Decision Format, During Document Creation, During Document Updates, During PR/MR Review, During Step 4 co-review with Product Owner, Hard Limits, Metadata Source of Truth (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): 1. System Architecture, 2. Data Design, 3. Data Flow & Interactions, 4. Key Design Decisions, 5. Implementation Conventions, 6. Integration Points, 7. Security Posture & Data Classification, 8. Non-Functional Approach (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (6): normalize(), repoRoot, steps, stepsPath, STRUCTURAL, templateHeadings()

### Community 25 - "Community 25"
Cohesion: 0.20
Nodes (9): 1. Overview, 2. Target Users, 3. Purpose, 4. Scope (In / Out), 5. Success Criteria, 6. Anti-Patterns, In scope, Out of scope (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (9): Environment Setup, Further Reading, Install & Run, Key Concepts, Prerequisites, [Project Name], Project Overview, Project Structure (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.20
Nodes (9): Acronyms, Markdownlint, Measurability, Metadata block, Placeholders, Priority scale — MoSCoW, Requirement language (RFC 2119), Tone (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): Approval continuity (required in Step 1), Check where you are, How to run a step, Keeping docs current, Key Rules, Project Initiation Guide — Overview, Who does what, Workflow

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (8): After Initiation, CS Project Kickstart, How It Works, Keeping docs current, Prerequisites, Repository Structure, 🚀 Start Here, The Steps

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (7): 1. Languages & Frameworks, 2. Datastores, 3. Cloud & Infrastructure Services, 4. Key Libraries / Tools, 5. Selection Trade-offs, 6. Versions & Constraints, TECH-STACK.md — Approved Technologies

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (6): cs-kickstart — working on this repo, graphify, Keep layers in sync, No build toolchain, Protected blocks — do not rewrite, The one rule that matters: source of truth vs. adapters

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (7): Goal, Objective, Reviewer checklist, Rules, Step 3: Product Requirements Document (PRD), What This Document Covers, Why This Matters

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (7): Goal, Objective, Reviewer checklist, Rules, Step 4: Architecture, What This Document Covers, Why This Matters

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (7): Goal, Objective, Reviewer checklist, Rules, Step 8: Initial Backlog, What This Document Covers, Why This Matters

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (6): Drift check, How the runner consumes a template, Inventory, Project-Initiation Output Templates, The inject marker, The layer model

### Community 37 - "Community 37"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 38 - "Community 38"
Cohesion: 0.33
Nodes (5): 1. Summary, 2. Epics, 3. Stories, 4. Out-of-Scope Notes, BACKLOG.md — Initial Backlog Manifest

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **304 isolated node(s):** `repoRoot`, `stepsPath`, `STRUCTURAL`, `steps`, `graphify` (+299 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Shared Project Initiation Runner` connect `Proj-Init Governance & Enforcement` to `Proj-Init Commands & Source Docs`, `Proj-Init Steps 3-8 & Outputs`, `Extraction Rules & Watch/Hooks`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Step Metadata Registry (_steps.yml)` connect `Proj-Init Steps 3-8 & Outputs` to `Proj-Init Governance & Enforcement`, `Extraction Rules & Watch/Hooks`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Project Initiation Guide Overview` connect `Extraction Rules & Watch/Hooks` to `Proj-Init Governance & Enforcement`, `Proj-Init Steps 3-8 & Outputs`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `repoRoot`, `stepsPath`, `STRUCTURAL` to the rest of the system?**
  _315 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Proj-Init Commands & Source Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.07123034227567067 - nodes in this community are weakly interconnected._
- **Should `Graphify Pipeline Core` be split into smaller, more focused modules?**
  _Cohesion score 0.0659536541889483 - nodes in this community are weakly interconnected._
- **Should `Proj-Init Governance & Enforcement` be split into smaller, more focused modules?**
  _Cohesion score 0.08547008547008547 - nodes in this community are weakly interconnected._