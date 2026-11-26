import { useTranslation } from "react-i18next";
import Button from "./Button";

function ConfirmMessage({ onConfirm, message, disabled, onCloseModal }) {
  const [t] = useTranslation();

  const handleConfirm = async () => {
    await onConfirm?.();
    onCloseModal?.();
  };

  return (
    <div className="flex flex-col gap-[1.2rem] p-[20px] text-textColor">
      <p className="mb-[1.2rem]">{message}</p>

      <div className="flex justify-end gap-[1.2rem]">
        <Button disabled={disabled} onClick={handleConfirm}>
          {t("general.yes")}
        </Button>
        <Button
          variation="secondary"
          onClick={onCloseModal}
          disabled={disabled}
        >
          {t("general.cancel")}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmMessage;
