import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import DashboardWrapper from "common/wrappers/DashboardWrapper";
import Box from "components/Box";
import { Avatar, Typography } from "antd";
import {
  deleteUserAccount,
  deleteUserAvatar,
  fetchUserData,
  selectUserProfile,
  updateUserAvatar,
  updateUserData,
  updateUserPassword,
} from "core/store/userSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { Upload, Button, message, Modal, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "common/constants/env";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useForm } from "react-hook-form";
import {
  FailedReqMsg,
  RequestRenewPassword,
  RequestUpdateUser,
  SuccessfulReqMsg,
} from "types/novel-server.types";
import yup from "common/yup";
import InputReactHookForm from "components/reactHookForm/InputReactHookForm";
import { useRouter } from "next/router";
import { PATHS_CORE } from "common/constants/paths";

const { Paragraph } = Typography;

const validationBasicDataSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  surname: yup.string().required(),
});

const validationPasswordSchema = yup.object({
  password: yup.string().required(),
  repeatedPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Rózne hasła")
    .required(),
});

const DashboardPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const userData = useAppSelector(selectUserProfile);

  const [isUpdateAvatarBtnLoading, setIsUpdateAvatarBtnLoading] =
    useState(false);
  const [isDeleteAvatarBtnLoading, setIsDeleteAvatarBtnLoading] =
    useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onFileSubmit = async () => {
    if (
      !inputFileRef.current ||
      (inputFileRef.current as any).fileList.length === 0
    ) {
      message.info("Wybierz plik");
      return;
    }

    const fileFromInputRef = (inputFileRef.current as any).fileList[0]
      .originFileObj as File;
    setIsUpdateAvatarBtnLoading(true);
    const formData = new FormData();
    formData.append("file", fileFromInputRef);

    await dispatch(updateUserAvatar(formData));
    setIsUpdateAvatarBtnLoading(false);
    dispatch(fetchUserData());
  };

  const handleDeleteAvatar = async () => {
    setIsDeleteAvatarBtnLoading(true);
    try {
      await dispatch(deleteUserAvatar());
      dispatch(fetchUserData());
      setIsDeleteAvatarBtnLoading(false);
    } catch (error) {
      notification.error({
        message: null,
        description: error as string,
      });
      setIsDeleteAvatarBtnLoading(false);
    }
  };

  const {
    handleSubmit: handleBasicDataSubmit,
    control,
    reset,
    formState: { errors: basicDataErrors, isSubmitting: isBasicDataSubmitting },
  } = useForm<RequestUpdateUser>({
    mode: "all",
    defaultValues: {
      email: userData?.email || "",
      name: userData?.name || "",
      surname: userData?.surname || "",
    },
    resolver: yupResolver(validationBasicDataSchema),
  });

  useEffect(() => {
    if (userData?.email) {
      reset({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
      });
    }
  }, [userData, reset]);

  const onBasicDataSubmit = async (values: RequestUpdateUser) => {
    try {
      const response = await dispatch(updateUserData(values));
      const { message } = response.payload as SuccessfulReqMsg;
      notification.success({
        message: null,
        description: message,
      });
      dispatch(fetchUserData());
    } catch (error) {
      const { message } = error as FailedReqMsg;
      notification.error({
        message: null,
        description: message,
      });
    }
  };

  const {
    handleSubmit: handlePassowrdSubmit,
    control: passwordControll,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<RequestRenewPassword>({
    mode: "all",
    defaultValues: {
      password: "",
      repeatedPassword: "",
    },
    resolver: yupResolver(validationPasswordSchema),
  });

  const onPassowrdSubmit = async (values: RequestRenewPassword) => {
    try {
      const response = await dispatch(updateUserPassword(values));
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

  const handleDeleteAccount = async () => {
    try {
      const response = await dispatch(deleteUserAccount());
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
      <HeadDecorator title="dashbaord" description="Strona dashbaordu" />

      <PrivateRoute>
        <DashboardWrapper title="Dashboard">
          <Box paddingTop={16} paddingBottom={16} maxWidth={700}>
            <Paragraph strong>Zmień Avatar</Paragraph>

            <Box marginBottom={16}>
              <Avatar
                size={64}
                src={userData?.avatar ? API_URL + userData?.avatar : ""}
              />
            </Box>

            <Upload ref={inputFileRef}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            <Box
              paddingTop={18}
              alignSelf="flex-end"
              maxWidth="100%"
              width="100%"
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                type="primary"
                onClick={onFileSubmit}
                loading={isUpdateAvatarBtnLoading}
              >
                Aktualizuj
              </Button>

              <Button
                onClick={handleDeleteAvatar}
                type="primary"
                danger
                style={{ marginLeft: 25 }}
                loading={isDeleteAvatarBtnLoading}
              >
                Usuń
              </Button>
            </Box>
          </Box>

          <Box paddingTop={16} paddingBottom={16} maxWidth={700}>
            <Paragraph strong>Zmień dane konta</Paragraph>
            <form onSubmit={handleBasicDataSubmit(onBasicDataSubmit)}>
              <Box paddingTop={16}>
                <InputReactHookForm
                  name="email"
                  control={control}
                  placeholder="e-mail"
                  error={basicDataErrors.email}
                  label="Wprowadź email"
                />
              </Box>
              <Box paddingTop={16}>
                <InputReactHookForm
                  name="name"
                  control={control}
                  placeholder="Imię"
                  error={basicDataErrors.name}
                  label="Wprowadź imię"
                />
              </Box>
              <Box paddingTop={16}>
                <InputReactHookForm
                  name="surname"
                  control={control}
                  placeholder="Nazwisko"
                  error={basicDataErrors.surname}
                  label="Wprowadź nazwisko"
                />
              </Box>
              <Box paddingTop={16} display="flex" justifyContent="flex-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isBasicDataSubmitting}
                >
                  Aktualizuj
                </Button>
              </Box>
            </form>
          </Box>

          <Box paddingTop={16} paddingBottom={16} maxWidth={700}>
            <Paragraph strong>Zmień hasło</Paragraph>
            <form onSubmit={handlePassowrdSubmit(onPassowrdSubmit)}>
              <Box paddingTop={16}>
                <InputReactHookForm
                  name="password"
                  control={passwordControll}
                  placeholder="hasło"
                  type="password"
                  error={passwordErrors.password}
                  label="Wprowadź nowe hasło"
                />
              </Box>
              <Box paddingTop={16}>
                <InputReactHookForm
                  name="repeatedPassword"
                  control={passwordControll}
                  placeholder="hasło"
                  type="password"
                  error={passwordErrors.repeatedPassword}
                  label="Wprowadź ponownie hasło"
                />
              </Box>
              <Box paddingTop={16} display="flex" justifyContent="flex-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPasswordSubmitting}
                >
                  Aktualizuj
                </Button>
              </Box>
            </form>
          </Box>

          <Box paddingTop={32} paddingBottom={16} maxWidth={700}>
            <Paragraph strong>Usuń konto</Paragraph>

            <Box paddingTop={16} display="flex" justifyContent="flex-end">
              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteAccountModalVisible(true)}
              >
                Usuń konto
              </Button>
            </Box>
          </Box>
          <Modal
            title="Usuwanie konta"
            visible={isDeleteAccountModalVisible}
            onOk={handleDeleteAccount}
            cancelText="Anuluj"
            onCancel={() => setIsDeleteAccountModalVisible(false)}
            okButtonProps={{
              type: "primary",
              danger: true,
            }}
          >
            <Typography>
              Czy na pewno chcesz usunąć konto? Tej operacji nie można odwrócić
              a Twój postep w grze zostanie utracony.
            </Typography>
          </Modal>
        </DashboardWrapper>
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
