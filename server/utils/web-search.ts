import { webSearch } from "@exalabs/ai-sdk";
import type { Tool, ToolExecutionOptions } from "ai";

interface WebSearchResult {
  title: string;
  url: string;
  text: string;
  publishedDate?: string;
  author?: string;
}

interface WebSearchResponse {
  results: WebSearchResult[];
}

/**
 * Checks if web search is available by verifying the EXA_API_KEY environment variable.
 *
 * @returns true if web search is available, false otherwise
 */
export function isWebSearchAvailable(): boolean {
  return !!Bun.env.EXA_API_KEY;
}

/**
 * Creates a cleaned web search tool that removes unnecessary metadata
 * from the search results, keeping only essential fields for the LLM.
 *
 * @param options - Web search options (type and number of results)
 * @returns A web search tool with cleaned output
 */
export function createCleanedWebSearch(options?: {
  type?: "fast" | "neural";
  numResults?: number;
}): Tool<{ query: string }, unknown> {
  const baseTool = webSearch(options);

  // Wrap the execute function to transform the output
  const originalExecute = baseTool.execute;
  if (originalExecute) {
    baseTool.execute = async (
      args: { query: string },
      options: ToolExecutionOptions,
    ) => {
      const result = await originalExecute(args, options);

      // Transform the output to remove unnecessary metadata
      if (
        result &&
        typeof result === "object" &&
        "results" in result &&
        Array.isArray(result.results)
      ) {
        const cleanedResults: WebSearchResult[] = (
          result.results as Array<{
            title?: string;
            url?: string;
            text?: string;
            publishedDate?: string;
            author?: string;
          }>
        )
          .filter(
            (
              item,
            ): item is {
              title: string;
              url: string;
              text: string;
              publishedDate?: string;
              author?: string;
            } =>
              typeof item.title === "string" &&
              typeof item.url === "string" &&
              typeof item.text === "string",
          )
          .map((item) => ({
            title: item.title,
            url: item.url,
            text: item.text,
            ...(item.publishedDate
              ? { publishedDate: item.publishedDate }
              : {}),
            ...(item.author ? { author: item.author } : {}),
          }));

        return {
          results: cleanedResults,
        } as WebSearchResponse;
      }

      return result;
    };
  }

  return baseTool;
}
