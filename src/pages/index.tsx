import type { NextPage } from "next";
import Button from "antd/lib/button";
import CoreView from "layouts/CoreView";
import { useForm } from "react-hook-form";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import Box from "components/Box";
import Link from "next/link";
import { PATHS_CORE, PATHS_DASHBOARD } from "common/constants/paths";
import { RequestLoginCredentials } from "types/novel-server.types";
import HeadDecorator from "components/HeadDecorator";
import { useAppDispatch } from "common/store/hooks";
import { login } from "core/store/userSlice";
import { useRouter } from "next/router";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestLoginCredentials>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RequestLoginCredentials) => {
    try {
      await dispatch(login(values));

      router.push(PATHS_DASHBOARD.DASHBOARD);
    } catch (error) {
      alert(error);
    }
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
            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              Zaloguj się
            </Button>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={8}>
            <Link href={PATHS_CORE.REGISTER}>
              <a>Załóż konto</a>
            </Link>

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
