import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button, { DeleteConfirmButton } from "./Button";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) {
  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="animate-fadeIn absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-slideIn relative mx-4 w-full max-w-md rounded-lg border border-gray-200 bg-secondary p-6 shadow-xl dark:border-gray-700">
        {/* Header */}
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p>{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variation="secondary" onClick={onClose} className="px-6 py-2">
            {cancelText || t("general.cancel")}
          </Button>
          <DeleteConfirmButton
            variant="danger"
            onClick={onConfirm}
            className="px-6 py-2"
          >
            {confirmText || t("users.deleteChargeConfirm")}
          </DeleteConfirmButton>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
