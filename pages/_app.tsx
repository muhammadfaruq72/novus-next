import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/components/CreateContext";
import { SessionProvider } from "next-auth/react";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BACKEND,
  cache: new InMemoryCache(),
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <AuthProvider>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
