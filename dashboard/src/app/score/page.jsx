"use client";
import ScoreComponent from "@/components/ScoreComponent";
import { useAuth } from "@/context/userContext";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <Box sx={{ ml: 8, mt: -5 }}>
      <ScoreComponent />
    </Box>
  );
};

export default page;
