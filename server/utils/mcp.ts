import {
  experimental_createMCPClient as createMCPClient,
  type experimental_MCPClient as MCPClient,
} from "@ai-sdk/mcp";
import { Experimental_StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";
import type { ToolSet } from "ai";

import { type Config, config } from "@/server/utils/config";

export class MCPClientManager {
  private clients: Record<string, MCPClient> = {};

  constructor() {
    this.clients = {};
    Object.keys(config.mcpServers)
      .filter((key) => {
        const serverConfig = config.mcpServers[key];
        return serverConfig?.enabled;
      })
      .forEach(async (key) => {
        const mcpConfig = config.mcpServers[key];
        if (!mcpConfig) return;
        const client = await this.createVercelMCPClient(mcpConfig, key);
        if (client) {
          this.clients[key] = client;
        }
      });
  }

  public async getAllTools(mcpServers: string[]): Promise<ToolSet> {
    const allTools: ToolSet = {};

    for (const serverName of mcpServers) {
      const client = this.clients[serverName];
      if (!client) continue;

      const toolSet = await client.tools();
      for (const [toolName, tool] of Object.entries(toolSet)) {
        allTools[`${serverName}__${toolName}`] = tool;
      }
    }
    return allTools;
  }

  private async createVercelMCPClient(
    mcpConfig: Config["mcpServers"][string],
    serverName: string,
  ): Promise<MCPClient | undefined> {
    if (mcpConfig.type === "http") {
      return createMCPClient({
        transport: {
          type: "http",
          url: mcpConfig.url,
        },
        name: serverName,
      });
    }

    if (mcpConfig.type === "sse") {
      return createMCPClient({
        transport: {
          type: "sse",
          url: mcpConfig.url,
        },
        name: serverName,
      });
    }

    if (mcpConfig.type === "stdio") {
      const stdioTransport = new Experimental_StdioMCPTransport({
        command: mcpConfig.command,
        args: mcpConfig.args,
        env: mcpConfig.env,
      });
      return createMCPClient({
        transport: stdioTransport,
        name: serverName,
      });
    }
  }
}
