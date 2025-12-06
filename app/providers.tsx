"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ModalProvider } from "@/components/ModalContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useMemo } from "react";

function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: "/api/graphql",
    });

    const authLink = setContext((_, { headers }) => {
      // Get the token from session if available
      const token = (session as any)?.accessToken;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "network-only",
        },
        query: {
          fetchPolicy: "network-only",
        },
      },
    });
  }, [session]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>
        <ModalProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ModalProvider>
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
