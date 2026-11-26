import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";

const Input = React.forwardRef(function Input(
  { type = "text", placeholder, error, id, icon, ...inputProps },
  ref,
) {
  const [t] = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative w-full">
      <label
        htmlFor={inputId}
        className="mb-[7px] block px-[10px] text-start text-sm font-semibold"
      >
        {placeholder}{" "}
        {error && (
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        )}
      </label>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[50%] translate-y-[-50%] text-mutedText ltr:left-[12px] rtl:right-[12px]"
          >
            {icon}
          </span>
        )}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`form-input ${icon ? "ltr:pl-[36px] rtl:pr-[36px]" : ""}`}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute top-[50%] translate-y-[-50%] text-mutedText ltr:right-[12px] rtl:left-[12px]"
            onClick={toggleShowPassword}
            aria-label={
              showPassword
                ? t("general.hidePassword")
                : t("general.showPassword")
            }
          >
            {showPassword ? <FaRegEyeSlash /> : <MdOutlineRemoveRedEye />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-[3px] p-[2px] text-start text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
