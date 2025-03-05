"use client";

import { type TextareaHTMLAttributes, useEffect, useRef } from "react";

export function InputBox(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
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
    }
    props.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);
    adjustHeight();
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      className="w-full px-5 py-4 rounded-2xl resize-none min-h-10 shadow border dark:border-zinc-800 dark:bg-zinc-900 focus:outline-hidden"
      placeholder="Send assistant a message…"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
}
