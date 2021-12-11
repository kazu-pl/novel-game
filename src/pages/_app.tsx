import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import CreateGlobalStyle from "common/styles/globalStyles.styled";

import store from "../common/store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CreateGlobalStyle />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
