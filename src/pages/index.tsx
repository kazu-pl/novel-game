import type { NextPage } from "next";
import Head from "next/head";
import Button from "antd/lib/button";
import CoreView from "layouts/CoreView";
import { useForm } from "react-hook-form";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import Box from "components/Box";

const SignupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

interface FormValues {
  email: string;
  password: string;
}

const IndexPage: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (values: FormValues) => {
    console.log({ values });
  };

  return (
    <>
      <Head>
        <title>Logowanie</title>
      </Head>

      <CoreView title="Logowanie">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box marginBottom={15}>
            <InputReactHookForm
              name="email"
              control={control}
              placeholder="e-mail"
              error={errors.email}
              label="Wprowadź email"
            />
          </Box>

          <Box marginBottom={15}>
            <InputReactHookForm
              name="password"
              control={control}
              placeholder="password"
              error={errors.password}
              type="password"
              label="Wprowadź hasło"
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button htmlType="submit" type="primary">
              Zaloguj się
            </Button>
          </Box>
        </form>
      </CoreView>
    </>
  );
};

export default IndexPage;
