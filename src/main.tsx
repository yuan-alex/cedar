import ReactDOM from "react-dom/client";

import { RouterWithContext } from "@/utils/router";

import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<RouterWithContext />);
}
