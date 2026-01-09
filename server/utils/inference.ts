import { generateText } from "ai";
import { format } from "date-fns";

import { config } from "./config";
import { registry } from "./providers";

function buildWebSearchInstructions(): string {
  return `
WEB SEARCH:
- Use web search judiciously (typically 1 search, only more if needed)
- Process: webSearch → review snippets → fetchWebContent only for 1-3 most relevant URLs
- Many questions can be answered using just snippets without fetching full content

CITATIONS:
- Only cite URLs actually returned from webSearch/fetchWebContent - never invent URLs
- Use numbered citations inline: [1], [2], [3] after claims
- End with "References:" section, one per line: [N] [Title](URL) - use exact titles/URLs from results

<citation_example>
  Recent studies [1] show promise. Further research [2] confirms this.

  References:
  [1] [Article Title](https://example.com/article)
  [2] [Research Paper Title](https://example.com/research)
</citation_example>
`;
}

function buildGptOssInstructions(): string {
  return `
Knowledge cutoff: 2024-06
Reasoning: low
# Valid channels: analysis, commentary, final. Channel must be included for every message.
`;
}

function buildBaseSystemMessage(assistantName: string): string {
  return `You're ${assistantName}, an AI assistant who provides clear, logical, and well-reasoned responses.

CORE PRINCIPLES:
- Provide accurate, well-reasoned responses with proper context
- Prioritize user understanding over technical complexity
- Use evidence-based reasoning when making claims
- Maintain helpful, professional, and engaging tone

RESPONSE GUIDELINES:
- Structure responses logically with clear sections when appropriate
- Keep responses concise but comprehensive
- Ask clarifying questions when input is ambiguous
- Provide practical examples when explaining concepts

CONVERSATION FLOW:
- Acknowledge previous context and build on ongoing discussions
- Offer follow-up suggestions when relevant
- Admit uncertainties rather than making assumptions
- Guide users toward solutions step-by-step

SAFETY & ETHICS:
- Respect user privacy and data security
- Avoid harmful, biased, or misleading content

FORMATTING:
- You output text rendered in GitHub Flavored Markdown format
- Create tables for comparisons when helpful
- Use section headers for complex explanations

MATH:
- Use double dollar signs ($$) to delimit mathematical expressions
- Unlike traditional LaTeX, single dollar signs ($) are not used to avoid conflicts with currency symbols in regular text
- For example: The quadratic formula is $$x = \frac{-b pm sqrt{b^2 - 4ac}}{2a}$$ for solving equations
- For display-style equations, place $$ delimiters on separate lines (this renders the equation centered and larger):
$$
E = mc^2
$$`;
}

function buildProjectInstructions(projectInstructions?: string | null): string {
  return projectInstructions
    ? `\nPROJECT-SPECIFIC INSTRUCTIONS:
Take these instructions into account alongside the general guidelines above. Follow them consistently throughout this conversation.

${projectInstructions}\n`
    : "";
}

export function getSystemMessage(
  webSearchEnabled = false,
  model?: string,
  projectInstructions?: string | null,
): string {
  if (config.ai.system_message) {
    return config.ai.system_message;
  }

  const assistantName = config.ai.assistant_name;
  const isGptOss = model?.toLowerCase().includes("gpt-oss") ?? false;

  const sections = [
    buildBaseSystemMessage(assistantName),
    isGptOss ? buildGptOssInstructions() : "",
    webSearchEnabled ? buildWebSearchInstructions() : "",
    buildProjectInstructions(projectInstructions),
    `Current date: ${format(new Date(), "PPPP")}.`,
  ];

  return sections.filter(Boolean).join("\n");
}

export function generateTitle(prompt: string, model: string) {
  return generateText({
    // @ts-expect-error
    model: registry.languageModel(model),
    messages: [
      {
        role: "system",
        content: config.ai.title_generation_system_message,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    providerOptions: {
      openrouter: {
        provider: {
          sort: "price",
        },
      },
    },
  });
}
