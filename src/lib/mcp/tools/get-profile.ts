import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Return the portfolio owner's name, role, short bio, and headline stats.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      name: "Muhammad Shayan",
      role: "Mobile Engineer",
      focus: "Android · Flutter · offline-first mobile apps, on-device ML, and polished product systems.",
      metrics: [
        { value: "3+", label: "Apps shipped" },
        { value: "10k+", label: "Installs" },
        { value: "99%+", label: "Stable releases" },
        { value: "60%", label: "Perf gains" },
      ],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});