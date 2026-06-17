<!-- INITIATION-RUNNER: required for Project Initiation steps 2–8. Preserve this block. -->
# GitHub Copilot Instructions

Project Initiation rules live in `docs/guides/proj-init/`.

For Project Initiation work:

1. Use `docs/guides/proj-init/_run-step.md` as the shared execution workflow.
2. Use `docs/guides/proj-init/_steps.yml` for step metadata.
3. Use the step guide named in `_steps.yml` for document-specific requirements.

Copilot prompt files are thin adapters only. Do not duplicate shared workflow rules in `.github/prompts/`.
<!-- END INITIATION-RUNNER -->

## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, use this sequence:

1. If `graphify-out/graph.json` does not exist, inform the user that the graph has not been built yet,
	suggest they type `/graphify` in Copilot Chat to build it, and proceed by reading source files directly.
2. Choose the command: `graphify query "<question>"` for general questions, `graphify path "<A>" "<B>"`
	for relationship questions, or `graphify explain "<concept>"` for focused-concept questions.
3. If the command returns an error or no parseable output, read `graphify-out/GRAPH_REPORT.md` if it exists;
	otherwise read source files directly and note the graph tool failure in your response.
4. If the result contains 3 or more relevant nodes or edges, use that scoped subgraph and stop.
5. If the result contains 1 or 2 relevant nodes or edges, use those nodes as navigation anchors. For broad
	architecture review, also read `graphify-out/GRAPH_REPORT.md` if it exists.
6. If the result contains 0 relevant nodes or edges or explicitly states the concept is not found in the graph,
	read `graphify-out/wiki/index.md` if it exists for broad navigation, then read
	`graphify-out/GRAPH_REPORT.md` only for architecture-level questions if it exists.
7. Read source files only when modifying/debugging specific code, when the graph result returns no nodes or
	edges directly relevant to the specific symbol or file being modified, when the graph file is absent, or
	when the fallback above requires source files.

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

Type `/graphify` in Copilot Chat to build or update the graph.
