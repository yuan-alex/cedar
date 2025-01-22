import type React from "react";

import { providers } from "@/utils/inference";

export function ModelSelector(props: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
  return (
    <select className="px-3 py-2 text-sm rounded-lg cursor-pointer" {...props}>
      {providers.map((provider) => (
        <optgroup key={provider.name} label={provider.name}>
          {provider.models.map((model) => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
