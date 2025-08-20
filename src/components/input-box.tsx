import { type TextareaHTMLAttributes, useEffect, useRef } from "react";
import { McpSelector } from "@/components/mcp-selector";
import { ModelPopover } from "@/components/model-popover";

export function InputBox(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the natural height
      textarea.style.height = "auto";
      // Set height to scrollHeight, but ensure it doesn't go below min-height
      const newHeight = Math.max(textarea.scrollHeight, 40); // 40px matches min-h-10 (2.5rem)
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Immediately adjust height when Shift+Enter is pressed
    if (e.key === "Enter" && e.shiftKey) {
      // Let the newline be inserted (don't prevent default)
      // Use setTimeout to adjust height after the new line is inserted
      setTimeout(adjustHeight, 0);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      // Adjust height after backspace/delete operations
      setTimeout(adjustHeight, 0);
    }
    props.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);
    // Use setTimeout to ensure the DOM is updated before adjusting height
    setTimeout(adjustHeight, 0);
  };

  useEffect(() => {
    adjustHeight();
    // biome-ignore lint/correctness/useExhaustiveDependencies: adjustHeight function is stable
  }, [adjustHeight]);

  return (
    <>
      <textarea
        ref={textareaRef}
        className="w-full px-5 py-4 rounded-xl resize-none min-h-10 border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-hidden"
        placeholder="What can I help you with?"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        // biome-ignore lint: intentional UX decision for chat input
        autoFocus
        {...props}
      />
      <div className="flex gap-2 mt-1">
        <ModelPopover />
        <McpSelector />
      </div>
    </>
  );
}
