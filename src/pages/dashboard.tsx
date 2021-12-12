import type { NextPage } from "next";
import CoreView from "layouts/CoreView";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import { useAppDispatch } from "common/store/hooks";
import { logout } from "core/store/userSlice";
import { useRouter } from "next/router";
import { PATHS_CORE } from "common/constants/paths";
import { Button } from "antd";

const DashboardPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logout());

      router.push(PATHS_CORE.LOGIN);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <HeadDecorator title="dashbaord" description="Strona dashbaordu" />

      <PrivateRoute>
        <CoreView title="dashbaord">
          dashbaord here
          <Button onClick={handleLogout}>Wyloguj</Button>
        </CoreView>
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
