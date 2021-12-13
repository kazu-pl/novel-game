import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import DashboardWrapper from "common/wrappers/DashboardWrapper";
import Box from "components/Box";
import { Avatar, Typography } from "antd";
import {
  deleteUserAvatar,
  fetchUserData,
  selectUserProfile,
  updateUserAvatar,
} from "core/store/userSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

import { API_URL } from "common/constants/env";

const { Paragraph } = Typography;

const DashboardPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const userData = useAppSelector(selectUserProfile);

  const [isUpdateAvatarBtnLoading, setIsUpdateAvatarBtnLoading] =
    useState(false);
  const [isDeleteAvatarBtnLoading, setIsDeleteAvatarBtnLoading] =
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
    } catch (err) {
      setIsDeleteAvatarBtnLoading(false);
    }
  };

  return (
    <>
      <HeadDecorator title="dashbaord" description="Strona dashbaordu" />

      <PrivateRoute>
        <DashboardWrapper title="Dashboard">
          <Paragraph strong>Zmień Avatar</Paragraph>
          <Box paddingTop={16} paddingBottom={16} maxWidth={700}>
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
        </DashboardWrapper>
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
