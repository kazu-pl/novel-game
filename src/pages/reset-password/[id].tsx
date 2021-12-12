import type { NextPage } from "next";
import Button from "antd/lib/button";
import CoreView from "layouts/CoreView";
import { useForm } from "react-hook-form";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import Box from "components/Box";
import { RequestRenewPassword } from "types/novel-server.types";
import HeadDecorator from "components/HeadDecorator";
import { resetUserPassword } from "core/store/userSlice";
import { useAppDispatch } from "common/store/hooks";
import { useRouter } from "next/router";
import { PATHS_CORE } from "common/constants/paths";

const validationSchema = yup.object({
  password: yup.string().required(),
  repeatedPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Rózne hasła")
    .required(),
});

const ResetPasswordPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestRenewPassword>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RequestRenewPassword) => {
    try {
      const response = await dispatch(
        resetUserPassword({ ...values, userId: router.query.id as string })
      );
      router.push(PATHS_CORE.LOGIN);
    } catch (error) {}
  };

  return (
    <>
      <HeadDecorator title="Ustaw nowe hasło" description="Strona logowania" />

      <CoreView title="Ustaw nowe hasło">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={15}>
            <InputReactHookForm
              name="password"
              control={control}
              error={errors.password}
              type="password"
              label="Wprowadź hasło"
            />
          </Box>

          <Box marginBottom={15}>
            <InputReactHookForm
              name="repeatedPassword"
              control={control}
              error={errors.repeatedPassword}
              type="password"
              label="Ponownie wprowadź hasło"
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              Ustaw hasło
            </Button>
          </Box>
        </form>
      </CoreView>
    </>
  );
};

export default ResetPasswordPage;
