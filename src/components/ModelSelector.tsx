import { Select } from "@radix-ui/themes";

import { providers } from "@/utils/inference";

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
