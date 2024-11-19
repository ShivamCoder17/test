// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "react-use-cart";
import Wrapper from "@/Layout/Wrapper/Wrapper";
import { ColorModeProvider } from "@/ThemeContext";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ColorModeProvider>
    </QueryClientProvider>
  );
}
