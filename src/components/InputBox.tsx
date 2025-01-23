"use client";

import { type TextareaHTMLAttributes, useEffect, useRef } from "react";

export function InputBox(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto first to handle text removal
      textarea.style.height = "auto";
      // Set height to scrollHeight to accommodate all content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  interface HandleKeyDownEvent
    extends React.KeyboardEvent<HTMLTextAreaElement> {}
  const handleKeyDown = (e: HandleKeyDownEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
    props.onKeyDown?.(e);
  };

  interface HandleChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
  const handleChange = (e: HandleChangeEvent) => {
    props.onChange?.(e);
    adjustHeight();
  };

  // Adjust height on mount and when content changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <textarea
      ref={textareaRef}
      className="w-full px-5 py-4 rounded-xl resize-none min-h-10 bg-zinc-100 dark:bg-zinc-800 focus:outline-hidden"
      placeholder="Send assistant a message…"
      rows={1}
      value={props.value}
      onChange={(e) => handleChange(e)}
      onKeyDown={handleKeyDown}
      autoFocus
      {...props}
    />
  );
}
