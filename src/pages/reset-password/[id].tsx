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

const validationSchema = yup.object({
  password: yup.string().required(),
  repeatedPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Rózne hasła")
    .required(),
});

const ResetPasswordPage: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RequestRenewPassword>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: RequestRenewPassword) => {
    console.log({ values });
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
            <Button htmlType="submit" type="primary">
              Ustaw hasło
            </Button>
          </Box>
        </form>
      </CoreView>
    </>
  );
};

export default ResetPasswordPage;
