import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import DashboardWrapper from "common/wrappers/DashboardWrapper";
import Box from "components/Box";

const DashboardPage: NextPage = () => {
  return (
    <>
      <HeadDecorator title="dashbaord" description="Strona dashbaordu" />

      <PrivateRoute>
        <DashboardWrapper title="Dashboard">
          <Box minHeight={"500vh"}>dashboard</Box>
        </DashboardWrapper>
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
