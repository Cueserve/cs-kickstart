# Graph Report - .  (2026-06-17)

## Corpus Check
- Corpus is ~24,199 words - fits in a single context window. You may not need a graph.

## Summary
- 142 nodes · 194 edges · 17 communities (9 shown, 8 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.81)
- Token cost: 185,135 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `_run-step.md (shared runner)` - 13 edges
2. `Graphify Pipeline` - 13 edges
3. `_steps.yml (step registry/metadata)` - 12 edges
4. `Product Owner Role Context` - 9 edges
5. `Step Metadata Registry (_steps.yml)` - 9 edges
6. `Solution Architect Role Context` - 8 edges
7. `Proj-Init Shared Runner (_run-step.md)` - 8 edges
8. `Design: Standardized proj-init Doc Templates` - 7 edges
9. `Extraction Subagent Prompt` - 7 edges
10. `Proj-Init Step Metadata (_steps.yml)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Repo CLAUDE.md (graphify adapter)` --semantically_similar_to--> `GitHub Copilot Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → .github/copilot-instructions.md
- `Thin adapter pattern (commands/prompts defer to shared runner)` --rationale_for--> `/proj-init-product command (Step 2)`  [INFERRED]
  README.md → .claude/commands/proj-init-product.md
- `doc-update.md shared workflow (impact analyzer)` --conceptually_related_to--> `Five-move branch -> PR -> merge step loop`  [INFERRED]
  docs/guides/proj-init/doc-update.md → README.md
- `graphify Skill Pointer (.claude)` --conceptually_related_to--> `graphify query-first workflow for codebase questions`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `/proj-init-readme command (Step 7)` --references--> `_run-step.md (shared runner)`  [EXTRACTED]
  .claude/commands/proj-init-readme.md → docs/guides/proj-init/_run-step.md

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

## Communities (17 total, 8 thin omitted)

### Community 0 - "Proj-Init Commands & Source Docs"
Cohesion: 0.15
Nodes (26): /proj-init-aitoolguide command (Step 6), /proj-init-architecture command (Step 4), /proj-init-backlog command (Step 8), /proj-init-doc-update command, /proj-init-prd command (Step 3), /proj-init-product command (Step 2), /proj-init-readme command (Step 7), /proj-init-techstack command (Step 5) (+18 more)

### Community 1 - "Graphify Pipeline Core"
Cohesion: 0.09
Nodes (25): graphify add URL Ingest, Token Reduction Benchmark, GitHub Repo Clone, Cross-Repo Graph Merge, Audit Trail (EXTRACTED/INFERRED/AMBIGUOUS), Community Detection / Clustering, Cumulative Cost Tracker, Detect Files Step (+17 more)

### Community 2 - "Proj-Init Governance & Enforcement"
Cohesion: 0.15
Nodes (19): Step 1: Repo Setup, Step 2: Product Concept, Project Initiation Guide Overview, Shared Project Initiation Runner, PR/MR Approval Gate, Architect / Tech Lead Role, Branch-vs-main as Draft-vs-Final, Branch-per-step Workflow (init/<step>) (+11 more)

### Community 3 - "Proj-Init Steps 3-8 & Outputs"
Cohesion: 0.18
Nodes (19): Step 3: Product Requirements Document, Step 4: Architecture, Step 5: Tech Stack, Step 6: AI Tool Guide, Step 7: README, Step 8: Initial Backlog, Step Metadata Registry (_steps.yml), Acceptance Criteria (definition of done) (+11 more)

### Community 4 - "Extraction Rules & Watch/Hooks"
Cohesion: 0.18
Nodes (11): Watcher Debounce, Folder Watcher (--watch), Calls Edge Direction Rule, Confidence Score Rubric, Hyperedges, Node ID Format Rule, Semantic Similarity Edges, Extraction Subagent Prompt (+3 more)

### Community 5 - "Repo Adapters & Merge-is-Final"
Cohesion: 0.24
Nodes (10): graphify Skill Pointer (.claude), /proj-init-doc-status command, Five-move branch -> PR -> merge step loop, graphify query-first workflow for codebase questions, Merge-is-final governance (no draft files, no status flags), Thin adapter pattern (commands/prompts defer to shared runner), Repo CLAUDE.md (graphify adapter), CS Project Kickstart README (+2 more)

### Community 6 - "GitHub Copilot Proj-Init Prompts"
Cohesion: 0.33
Nodes (10): Proj-Init AI Tool Guide (Step 6), Proj-Init Architecture (Step 4), Proj-Init Backlog (Step 8), Proj-Init PRD (Step 3), Proj-Init Precedence Rule, Proj-Init Product (Step 2), Proj-Init README (Step 7), Proj-Init Shared Runner (_run-step.md) (+2 more)

### Community 7 - "Graphify Query & MCP Access"
Cohesion: 0.33
Nodes (7): Graphify MCP Server, Fast Path Query (existing graph), graph.json Output, Native CLAUDE.md Integration, save-result Feedback Loop, Graph Query Traversal (BFS/DFS), Constrained Query Vocabulary Expansion

### Community 8 - "Doc Status/Update Workflow"
Cohesion: 0.67
Nodes (3): Proj-Init Doc Status, Proj-Init Doc Update, Proj-Init Review Gate (PR)

## Knowledge Gaps
- **34 isolated node(s):** `graphify Skill Pointer (.claude)`, `/proj-init-doc-status command`, `/proj-init-doc-update command`, `AI-TOOL-GUIDE.md (source-of-truth doc)`, `Knowledge Graph` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graphify Pipeline` connect `Graphify Pipeline Core` to `Extraction Rules & Watch/Hooks`, `Graphify Query & MCP Access`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `Step Metadata Registry (_steps.yml)` connect `Proj-Init Steps 3-8 & Outputs` to `Proj-Init Governance & Enforcement`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `graphify Skill Pointer (.claude)`, `/proj-init-doc-status command`, `/proj-init-doc-update command` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Proj-Init Commands & Source Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Should `Graphify Pipeline Core` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Proj-Init Governance & Enforcement` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._