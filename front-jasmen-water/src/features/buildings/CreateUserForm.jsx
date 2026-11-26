import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isOnlySpaces } from "../../utils/helpers";
import {
  EMAIL_REGEX,
  MAX_INPUT_LENGTH,
  MIN_INPUT_LENGTH,
  NUMBER_INPUT_REGEX,
} from "../../utils/constants";

import Input from "../../ui/Input";
import Button from "../../ui/Button";

function CreateUserForm({ onSubmit, isSubmitting, onCloseModal }) {
  const { t } = useTranslation();

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      mobile: "",
      roomNumber: "",
      consumption: 0,
      flowRate: 0,
      limit: 0,
      status: false,
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data, () => {
      reset();
      onCloseModal?.();
    });
  };

  const { errors } = formState;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4 text-textColor"
      >
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-textColor">
            {t("buildings.addUserToBuilding")}
          </h2>
          <p className="text-sm text-textColor opacity-70">
            {t("buildings.createUserInBuilding")}
          </p>
        </div>

        <Input
          placeholder={t("general.name")}
          disabled={isSubmitting}
          error={errors?.userName?.message}
          {...register("userName", {
            required: t("general.nameRequired"),
            validate: {
              noOnlySpaces: (value) =>
                !isOnlySpaces(value) || t("general.onlySpaces"),
            },
            minLength: {
              value: MIN_INPUT_LENGTH,
              message: t("general.minLength"),
            },
            maxLength: {
              value: MAX_INPUT_LENGTH,
              message: t("general.maxLength"),
            },
          })}
        />

        <Input
          placeholder={t("general.email")}
          disabled={isSubmitting}
          error={errors?.email?.message}
          {...register("email", {
            required: t("general.emailIsRequired"),
            validate: {
              noOnlySpaces: (value) =>
                !isOnlySpaces(value) || t("general.onlySpaces"),
            },
            pattern: {
              value: EMAIL_REGEX,
              message: t("general.emailPattern"),
            },
            minLength: {
              value: MIN_INPUT_LENGTH,
              message: t("general.minLength"),
            },
            maxLength: {
              value: MAX_INPUT_LENGTH,
              message: t("general.maxLength"),
            },
          })}
        />

        <Input
          placeholder={t("general.passwordPlaceholder")}
          type="password"
          disabled={isSubmitting}
          error={errors?.password?.message}
          {...register("password", {
            required: t("general.passwordIsRequired"),
            minLength: {
              value: 8,
              message: t("general.passwordLength"),
            },
          })}
        />

        <Input
          placeholder={t("users.mobile")}
          disabled={isSubmitting}
          error={errors?.mobile?.message}
          {...register("mobile", {
            required: t("general.mobileRequired"),
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
          placeholder={t("users.roomNumber")}
          disabled={isSubmitting}
          error={errors?.roomNumber?.message}
          {...register("roomNumber", {
            required: t("general.roomNumberRequired"),
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder={t("users.limit")}
            type="number"
            disabled={isSubmitting}
            error={errors?.limit?.message}
            {...register("limit", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: t("general.minValue"),
              },
            })}
          />

          <Input
            placeholder={t("users.consumption")}
            type="number"
            disabled={isSubmitting}
            error={errors?.consumption?.message}
            {...register("consumption", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: t("general.minValue"),
              },
            })}
          />
        </div>

        <Input
          placeholder={t("users.flowRate")}
          type="number"
          disabled={isSubmitting}
          error={errors?.flowRate?.message}
          {...register("flowRate", {
            valueAsNumber: true,
            min: {
              value: 0,
              message: t("general.minValue"),
            },
          })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="status"
            {...register("status")}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="status" className="text-sm text-textColor">
            {t("users.status")} ({t("general.on")})
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t("general.loading") : t("buildings.createUser")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
