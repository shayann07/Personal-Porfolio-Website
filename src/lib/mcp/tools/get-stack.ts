import { defineTool } from "@lovable.dev/mcp-js";

const STACK = ["Kotlin", "Compose", "Flutter", "TFLite", "Firebase", "GraphQL", "Room", "CI/CD", "ML Kit", "Fastlane", "Riverpod", "Testing"];

export default defineTool({
  name: "get_stack",
  title: "Get tech stack",
  description: "Return the technologies Muhammad Shayan works with.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: STACK.join(", ") }],
    structuredContent: { stack: STACK },
  }),
});