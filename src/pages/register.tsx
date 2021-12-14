import type { NextPage } from "next";
import Button from "antd/lib/button";
import CoreView from "layouts/CoreView";
import { useForm } from "react-hook-form";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import Box from "components/Box";
import { PATHS_CORE } from "common/constants/paths";
import {
  RequestRegisterCredentials,
  SuccessfulReqMsg,
} from "types/novel-server.types";
import { notification } from "antd";
import HeadDecorator from "components/HeadDecorator";
import { useAppDispatch } from "common/store/hooks";
import { register } from "core/store/userSlice";
import { useRouter } from "next/router";
import Link from "next/link";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  repeatedPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Rózne hasła")
    .required(),
  name: yup.string().required(),
  surname: yup.string().required(),
});

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestRegisterCredentials>({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      repeatedPassword: "",
      name: "",
      surname: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RequestRegisterCredentials) => {
    try {
      const response = await dispatch(register(values));
      const { message } = response.payload as SuccessfulReqMsg;
      notification.success({
        message: null,
        description: message,
      });
      router.push(PATHS_CORE.LOGIN);
    } catch (error) {
      notification.error({
        message: null,
        description: error as string,
      });
    }
  };

  return (
    <>
      <HeadDecorator title="Rejestracja" description="Strona rejestracji" />

      <CoreView title="Rejestracja">
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

          <Box marginBottom={15}>
            <InputReactHookForm
              name="repeatedPassword"
              control={control}
              placeholder="password"
              error={errors.repeatedPassword}
              type="password"
              label="Wprowadź ponownie hasło"
            />
          </Box>

          <Box marginBottom={15}>
            <InputReactHookForm
              name="name"
              control={control}
              placeholder="Imię"
              error={errors.name}
              type="text"
              label="Wprowadź Twoje imię"
            />
          </Box>

          <Box marginBottom={15}>
            <InputReactHookForm
              name="surname"
              control={control}
              placeholder="surname"
              error={errors.surname}
              type="text"
              label="Wprowadź Twoje nazwisko"
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              Załóż konto
            </Button>
          </Box>

          <Box display="flex" justifyContent="flex-start" marginTop={8}>
            <Link href={PATHS_CORE.LOGIN}>
              <a>Zaloguj się</a>
            </Link>
          </Box>
        </form>
      </CoreView>
    </>
  );
};

export default IndexPage;
