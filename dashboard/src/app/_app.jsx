"use client";

import { SnackbarProvider } from "notistack";

const MyApp = ({ children }) => {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
};

export default MyApp;
