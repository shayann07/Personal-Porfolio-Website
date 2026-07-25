import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact",
  title: "Get contact info",
  description: "Return public contact links (email, GitHub, LinkedIn) for the portfolio owner.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const contact = {
      email: "shayan@example.com",
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
      status: "Open to select mobile engineering work",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
      structuredContent: contact,
    };
  },
});