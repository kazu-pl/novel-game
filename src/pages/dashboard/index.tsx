import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import DashboardWrapper from "common/wrappers/DashboardWrapper";
import { useAppSelector } from "common/store/hooks";
import { selectUserProfile } from "core/store/userSlice";
import { Typography } from "antd";

const DashboardPage: NextPage = () => {
  const userData = useAppSelector(selectUserProfile);
  return (
    <>
      <HeadDecorator title="dashbaord" description="Strona dashbaordu" />

      <PrivateRoute>
        <DashboardWrapper title="Dashboard">
          <Typography.Title level={5} style={{ fontWeight: "normal" }}>
            Hello {userData?.name} {userData?.surname}!
          </Typography.Title>
        </DashboardWrapper>
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
