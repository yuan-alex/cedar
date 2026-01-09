import type { Tool } from "ai";
import { tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";

interface WebSearchResult {
  title: string;
  url: string;
  text?: string; // Full content (from fetchWebContent)
  snippet?: string; // Preview snippet (from webSearch with contents: false)
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
 * Gets or creates an Exa client instance.
 * Lazy initialization to avoid creating the client if web search is not used.
 */
function getExaClient(): Exa {
  const apiKey = Bun.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("EXA_API_KEY is not configured");
  }
  return new Exa(apiKey);
}

/**
 * Creates a cleaned web search tool using the Exa SDK directly.
 * Returns results with metadata only (no content) to reduce costs.
 *
 * @param options - Web search options (type and number of results)
 * @returns A web search tool with cleaned output
 */
export function createCleanedWebSearch(options?: {
  type?: "fast" | "neural";
  numResults?: number;
}): Tool<{ query: string }, unknown> {
  return tool({
    description:
      "Search the web for current information. Returns relevant web pages with metadata (title, URL, author, published date). Use this to find up-to-date information, recent articles, or current facts. Use fetchWebContent to get full text content for specific URLs.",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant web pages"),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        const exa = getExaClient();
        // Cap at 25 to avoid expensive tier (26-100 results costs $25 vs $5 for 1-25)
        const numResults = Math.min(options?.numResults ?? 15, 25);

        const response = await exa.search(query, {
          type: options?.type ?? "fast",
          numResults,
          moderation: true,
        });

        // Transform Exa SDK response to our cleaned format
        const cleanedResults: WebSearchResult[] = (response.results || [])
          .filter(
            (item): item is typeof item & { title: string } =>
              item.title !== null &&
              typeof item.title === "string" &&
              typeof item.url === "string",
          )
          .map((item) => ({
            title: item.title,
            url: item.url,
            ...(item.publishedDate
              ? { publishedDate: item.publishedDate }
              : {}),
            ...(item.author ? { author: item.author } : {}),
          }));

        return {
          results: cleanedResults,
        } as WebSearchResponse;
      } catch (error) {
        console.error("Error performing web search:", error);
        throw error;
      }
    },
  } as Tool<{ query: string }, unknown>);
}

/**
 * Creates a tool to fetch full content for specific URLs.
 * This should be called selectively after webSearch to get detailed content
 * only for the most relevant results (typically 1-3 URLs).
 *
 * @returns A tool that fetches content from specified URLs
 */
export function createFetchWebContentTool(): Tool<{ urls: string[] }, unknown> {
  return tool({
    description:
      "Fetch full content from specific URLs. Use this after webSearch to get detailed content for the most relevant results. Only fetch content when you need detailed information beyond what the snippets provide.",
    inputSchema: z.object({
      urls: z
        .array(z.url())
        .min(1)
        .max(10)
        .describe("Array of URLs to fetch full content from."),
    }),
    execute: async ({ urls }: { urls: string[] }) => {
      try {
        const exa = getExaClient();
        // Only fetch text content - NOT highlights or summaries (they cost the same)
        const response = await exa.getContents(urls, {
          text: true,
          // Explicitly NOT requesting highlights or summary to avoid unnecessary costs
        });

        // Handle response structure - Exa SDK returns results array
        // Type assertion needed as SDK types may vary
        type ExaContentResult = {
          id?: string;
          title?: string | null;
          url: string;
          text?: string;
          publishedDate?: string;
          author?: string;
        };

        type ExaContentResponse = {
          results?: ExaContentResult[];
          statuses?: Array<{
            id: string;
            status: string;
            error?: { tag?: string; httpStatusCode?: number };
          }>;
        };

        const responseData = response as ExaContentResponse;

        const responseResults = responseData.results || [];

        const results: WebSearchResult[] = responseResults
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
              item.title !== null &&
              typeof item.url === "string" &&
              typeof item.text === "string",
          )
          .map((item) => ({
            title: item.title ?? "Untitled",
            url: item.url,
            text: item.text ?? "",
            ...(item.publishedDate
              ? { publishedDate: item.publishedDate }
              : {}),
            ...(item.author ? { author: item.author } : {}),
          }));

        // Check for errors in statuses if available
        const statuses = responseData.statuses;
        const errors = statuses?.filter((s) => s.status === "error");
        if (errors && errors.length > 0) {
          console.warn(
            "Some URLs failed to fetch:",
            errors.map((e) => `${e.id}: ${e.error?.tag || "unknown"}`),
          );
        }

        return {
          results,
        };
      } catch (error) {
        console.error("Error fetching web content:", error);
        throw error;
      }
    },
  } as Tool<{ urls: string[] }, unknown>);
}
