'use client'

import apolloClient from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import React from "react";

const MyApp = ({ children }: React.PropsWithChildren) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default MyApp;
