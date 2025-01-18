import { Button, Dialog, Select } from "@radix-ui/themes";

const providers = [
  {
    name: "OpenAI",
    models: [
      {
        id: "openai/o1-preview",
        name: "o1-preview",
      },
      {
        id: "openai/o1-mini",
        name: "o1 mini",
      },
      {
        id: "openai/chatgpt-4o-latest",
        name: "GPT-4o",
      },
      {
        id: "openai/gpt-4o-mini",
        name: "GPT-4o mini",
      },
    ],
  },
  {
    name: "Anthropic",
    models: [
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
      },
      {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
      },
      {
        id: "anthropic/claude-3-haiku",
        name: "Claude 3 Haiku",
      },
    ],
  },
  {
    name: "Google",
    models: [
      {
        id: "google/gemini-pro-1.5",
        name: "Gemini Pro 1.5",
      },
      {
        id: "google/gemini-flash-1.5",
        name: "Gemini Flash 1.5",
      },
      {
        id: "google/gemini-flash-1.5-8b",
        name: "Gemini Flash 1.5 8B",
      },
    ],
  },
  {
    name: "Meta",
    models: [
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
      },
      {
        id: "meta-llama/llama-3.2-90b-vision-instruct",
        name: "Llama 3.2 90B",
      },
      {
        id: "meta-llama/llama-3.2-11b-vision-instruct",
        name: "Llama 3.2 11B",
      },
      {
        id: "meta-llama/llama-3.1-8b-instruct",
        name: "Llama 3.1 8B",
      },
      {
        id: "meta-llama/llama-3.2-3b-instruct",
        name: "Llama 3.2 3B",
      },
    ],
  },
  {
    name: "Mistral AI",
    models: [
      {
        id: "mistralai/pixtral-12b",
        name: "Mistral Pixtral 12B",
      },
      {
        id: "mistralai/mistral-nemo",
        name: "Mistral Nemo",
      },
      {
        id: "mistralai/mixtral-8x22b-instruct",
        name: "Mixtral 8x22b",
      },
      {
        id: "mistralai/mixtral-8x7b-instruct",
        name: "Mixtral 8x7b",
      },
    ],
  },
  {
    name: "xAI",
    models: [
      {
        id: "x-ai/grok-2-1212",
        name: "Grok 2",
      },
      {
        id: "x-ai/grok-beta",
        name: "Grok Beta",
      },
    ],
  },
  {
    name: "Qwen",
    models: [
      {
        id: "qwen/qvq-72b-preview",
        name: "QwQ 72B Preview",
      },
      {
        id: "qwen/qwq-32b-preview",
        name: "QwQ 32B Preview",
      },
      {
        id: "qwen/qwen-2.5-72b-instruct",
        name: "Qwen 2.5 72B Instruct",
      },
      {
        id: "qwen/qwen-2.5-coder-32b-instruct",
        name: "Qwen 2.5 Coder 32B Instruct",
      },
      {
        id: "qwen/qwen-2.5-7b-instruct",
        name: "Qwen 2.5 7B Instruct",
      },
    ],
  },
  {
    name: "DeepSeek",
    models: [
      {
        id: "deepseek/deepseek-chat",
        name: "DeepSeek V3",
      },
    ],
  },
  {
    name: "Microsoft",
    models: [
      {
        id: "microsoft/phi-4",
        name: "Phi 4",
      },
    ],
  },
  {
    name: "Nvidia",
    models: [
      {
        id: "nvidia/llama-3.1-nemotron-70b-instruct",
        name: "Llama 3.1 Nemotron 70B Instruct",
      },
    ],
  },
];

export function ModelSelector(props) {
  return (
    <Select.Root {...props}>
      <Select.Trigger />
      <Select.Content>
        {providers.map((provider) => (
          <Select.Group key={provider.name}>
            <Select.Label>{provider.name}</Select.Label>
            {provider.models.map((model) => (
              <Select.Item key={model.id} value={model.id}>
                {model.name}
              </Select.Item>
            ))}
          </Select.Group>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
