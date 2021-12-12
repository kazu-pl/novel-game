import { getTokens, isTokenExpired } from "common/auth/tokens";
import { PATHS_CORE } from "common/constants/paths";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";
import { Spin } from "antd";
import Box from "components/Box";
import { refreshAccessToken } from "core/store/userSlice";

export interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const tokens = getTokens();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useLayoutEffect(() => {
    const handleRefreshToken = async () => {
      try {
        await refreshAccessToken();
        setIsCheckingAuth(false);
      } catch (err) {
        router.push(PATHS_CORE.LOGIN);
      }
    };

    if (
      typeof window !== "undefined" &&
      tokens &&
      isTokenExpired(tokens.accessToken) &&
      !isTokenExpired(tokens.refreshToken)
    ) {
      setIsCheckingAuth(true);
      handleRefreshToken();
    } else {
      setIsCheckingAuth(false);
    }
  }, [isCheckingAuth, router, tokens, setIsCheckingAuth]);

  if (typeof window !== "undefined" && !tokens) {
    router.push(PATHS_CORE.LOGIN);
  }

  if (
    typeof window !== "undefined" &&
    tokens &&
    isTokenExpired(tokens.refreshToken) &&
    isTokenExpired(tokens.accessToken)
  ) {
    router.push(PATHS_CORE.LOGIN);
  }

  if (isCheckingAuth) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spin size="large" />
      </Box>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
