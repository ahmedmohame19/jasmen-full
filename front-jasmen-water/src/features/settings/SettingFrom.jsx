import { useTranslation } from "react-i18next";
import { useUpdateSettings } from "./useUpdateSettings";
import { useForm } from "react-hook-form";
import { isOnlySpaces } from "../../utils/helpers";
import { MAX_INPUT_LENGTH, NUMBER_INPUT_REGEX } from "../../utils/constants";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import toast from "react-hot-toast";

function SettingFrom({ settings, onCloseModal }) {
  const [t] = useTranslation();

  const { isUpdating, updateSettings } = useUpdateSettings();

  const {
    meterPrice = "",
    facebook = "",
    whatsAppNumber = "",
    Instagram = "",
    _id = "",
  } = settings || {};

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      meterPrice,
      facebook,
      whatsAppNumber,
      Instagram,
    },
  });
  const { errors } = formState;

  function onSubmit(data) {
    updateSettings(
      {
        id: _id,
        data,
      },
      {
        onSuccess: () => {
          toast.success(t("settings.updatedSuccessfully"));
          onCloseModal?.();
        },
        onError: () => {
          toast.error(t("settings.updateFailed"));
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[10px] surface-card p-[10px] text-textColor"
    >
      <h2 className="my-[10px] text-xl capitalize">
        {t("settings.updateSettings")}
      </h2>

      <Input
        placeholder={t("users.meterPrice")}
        disabled={isUpdating}
        error={errors?.meterPrice?.message}
        {...register("meterPrice", {
          required: t("general.metersPriceRequired"),
          validate: {
            noOnlySpaces: (value) =>
              !isOnlySpaces(value) || t("general.onlySpaces"),
          },
          pattern: {
            value: NUMBER_INPUT_REGEX,
            message: t("general.numbersOnly"),
          },

          maxLength: {
            value: MAX_INPUT_LENGTH,
            message: t("general.maxLength"),
          },
        })}
      />

      <Input
        placeholder={t("users.facebook")}
        disabled={isUpdating}
        error={errors?.facebook?.message}
        {...register("facebook", {
          required: t("general.facebookPageRequired"),
          validate: {
            noOnlySpaces: (value) =>
              !isOnlySpaces(value) || t("general.onlySpaces"),
          },
        })}
      />

      <Input
        placeholder={t("users.instagram")}
        disabled={isUpdating}
        error={errors?.Instagram?.message}
        {...register("Instagram", {
          required: t("general.instagramPageRequired"),
          validate: {
            noOnlySpaces: (value) =>
              !isOnlySpaces(value) || t("general.onlySpaces"),
          },
        })}
      />

      <Input
        placeholder={t("users.whatsAppNumber")}
        disabled={isUpdating}
        error={errors?.whatsAppNumber?.message}
        {...register("whatsAppNumber", {
          required: t("general.whatsAppNumberRequired"),
          validate: {
            noOnlySpaces: (value) =>
              !isOnlySpaces(value) || t("general.onlySpaces"),
          },
          pattern: {
            value: NUMBER_INPUT_REGEX,
            message: t("general.numbersOnly"),
          },

          maxLength: {
            value: MAX_INPUT_LENGTH,
            message: t("general.maxLength"),
          },
        })}
      />

      <div className="mt-[20px] flex w-[40%] flex-col gap-[10px] self-end">
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          {t("general.cancel")}
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {t("settings.updateSettings")}
        </Button>
      </div>
    </form>
  );
}

export default SettingFrom;
