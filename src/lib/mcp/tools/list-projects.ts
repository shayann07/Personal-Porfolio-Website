import { defineTool } from "@lovable.dev/mcp-js";

const PROJECTS = [
  {
    id: "01",
    title: "AI Trust Ledger",
    tag: "Fintech",
    role: "Kotlin · Firebase · MVVM",
    description: "ROI cycles, portfolio tracking, and resilient financial flows.",
    stack: ["Kotlin", "Firebase", "MVVM"],
    metric: { value: "99.8%", label: "Crash-free" },
  },
  {
    id: "02",
    title: "LeafBloom",
    tag: "AgriTech",
    role: "Flutter · TFLite · CameraX",
    description: "On-device plant identification with an offline-first field workflow.",
    stack: ["Flutter", "TFLite", "CameraX"],
    metric: { value: "10k+", label: "Installs" },
  },
  {
    id: "03",
    title: "GitPulse",
    tag: "DevTools",
    role: "Kotlin · GraphQL · Compose",
    description: "Repository insights, contribution rhythm, and commit intelligence.",
    stack: ["Kotlin", "GraphQL", "Compose"],
    metric: { value: "60%", label: "Perf gain" },
  },
  {
    id: "04",
    title: "Medicare",
    tag: "Healthcare",
    role: "Flutter · Riverpod · Firebase",
    description: "Patient care, medication tracking, and secure records.",
    stack: ["Flutter", "Riverpod", "Firebase"],
    metric: { value: "HIPAA", label: "Aligned" },
  },
];

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description: "List the featured portfolio projects with tag, stack, description, and headline metric.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PROJECTS, null, 2) }],
    structuredContent: { projects: PROJECTS },
  }),
});