import React from "react";

interface InputErrorProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
}

export default function InputError({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
}: InputErrorProps) {
  return (
    <fieldset
      className={`
        w-full rounded-lg
        bg-zinc-800/50
        border
        ${error ? "border-red-500" : "border-zinc-700"}
      `}
    >
      {error && (
        <legend className="px-2 text-[11px] text-red-400">
          {error}
        </legend>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className="
          w-full py-3.5 px-3.5
          bg-transparent
          text-sm text-white
          rounded-lg
          outline-none
        "
      />
    </fieldset>
  );
}
