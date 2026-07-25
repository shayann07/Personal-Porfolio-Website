import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listProjects from "./tools/list-projects";
import getStack from "./tools/get-stack";
import getContact from "./tools/get-contact";

export default defineMcp({
  name: "shayan-portfolio-mcp",
  title: "Muhammad Shayan — Portfolio MCP",
  version: "0.1.0",
  instructions:
    "Public tools that describe Muhammad Shayan's portfolio. Use `get_profile` for the headline bio and stats, `list_projects` for featured work, `get_stack` for technologies, and `get_contact` for public contact links.",
  tools: [getProfile, listProjects, getStack, getContact],
});