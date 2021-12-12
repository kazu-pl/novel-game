import type { NextPage } from "next";
import Button from "antd/lib/button";
import CoreView from "layouts/CoreView";
import { useForm } from "react-hook-form";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import Box from "components/Box";
import Link from "next/link";
import { PATHS_CORE } from "common/constants/paths";
import { RequestLoginCredentials } from "types/novel-server.types";
import HeadDecorator from "components/HeadDecorator";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const IndexPage: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RequestLoginCredentials>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: RequestLoginCredentials) => {
    console.log({ values });
  };

  return (
    <>
      <HeadDecorator title="Logowanie" description="Strona logowania" />

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

          <Box display="flex" justifyContent="flex-end" marginTop={8}>
            <Link href={PATHS_CORE.PASSWORD_FORGOT}>
              <a>Zapomniałem hasła</a>
            </Link>
          </Box>
        </form>
      </CoreView>
    </>
  );
};

export default IndexPage;
