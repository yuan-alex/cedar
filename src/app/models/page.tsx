import { providers } from "@/utils/inference"

export default function Models() {
  return <div className="flex flex-col space-y-5 max-w-5xl mx-auto my-10">
    <p className="text-xl">Supported Models</p>
    {providers.map((provider) => (
      <div key={provider.name} className="p-5 border rounded-lg">
        <p className="font-medium mb-2">{provider.name}</p>
        {provider.models.map((model) => (
          <div key={model.id}>
            <p className="text-md">{model.name}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
}
