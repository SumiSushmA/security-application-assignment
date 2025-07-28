// src/app/page.jsx
"use client";

import { useAuth } from "@/context/userContext";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// dynamically load your dashboard view (no SSR)
const UserView = dynamic(() => import("@/views/user/UserView"), {
  ssr: false,
  loading: () => <CircularProgress />,
});

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // this runs only in the browser
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setHydrated(true);
    }
  }, [isAuthenticated, router]);

  // while we haven’t confirmed auth, show a loader
  if (!hydrated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // once hydrated & authenticated, render your dashboard
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <UserView />
    </Box>
  );
}
