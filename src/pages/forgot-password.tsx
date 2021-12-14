import type { NextPage } from "next";
import CoreView from "layouts/CoreView";
import Box from "components/Box";
import Link from "next/link";
import { PATHS_CORE } from "common/constants/paths";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import yup from "common/yup";
import { Button } from "antd";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  RequestRemindPasswordCredentials,
  SuccessfulReqMsg,
} from "types/novel-server.types";
import HeadDecorator from "components/HeadDecorator";
import { sendEmailToRemindPassword } from "core/store/userSlice";
import { useAppDispatch } from "common/store/hooks";
import { notification } from "antd";

const validationSchema = yup.object({
  email: yup.string().email().required(),
});

const ForgotPassword: NextPage = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestRemindPasswordCredentials>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RequestRemindPasswordCredentials) => {
    try {
      const response = await dispatch(sendEmailToRemindPassword(values));
      const { message } = response.payload as SuccessfulReqMsg;
      notification.success({
        message: null,
        description: message,
      });
    } catch (error) {
      notification.error({
        message: null,
        description: error as string,
      });
    }
  };
  return (
    <>
      <HeadDecorator
        title="Przypomnij hasło"
        description="Strona do przypomnienia hasła"
      />
      <CoreView
        title="Zapomniałem hasła"
        description="Zapomniałeś hasła? Podaj twój email. Wyślemy na niego link do resetowania hasła."
      >
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

          <Box display="flex" justifyContent="flex-end">
            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              Wyślij link
            </Button>
          </Box>
        </form>
        <Box display="flex" justifyContent="flex-start" marginTop={8}>
          <Link href={PATHS_CORE.LOGIN}>
            <a>
              <span>
                <ArrowLeftOutlined />
              </span>
              Zaloguj się
            </a>
          </Link>
        </Box>
      </CoreView>
    </>
  );
};
export default ForgotPassword;
