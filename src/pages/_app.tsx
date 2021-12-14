import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import CreateGlobalStyle from "common/styles/globalStyles.styled";
import "antd/dist/antd.css";

import store from "../common/store/store";
import theme from "common/styles/theme";
import { ThemeProvider } from "styled-components";
import { notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

notification.config({
  closeIcon: <CloseCircleOutlined />,
  placement: "bottomLeft",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CreateGlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
