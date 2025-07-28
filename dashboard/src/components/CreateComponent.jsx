import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CreateCategory from "@/views/create/CreateCategory";
import CreateQuiz from "@/views/create/CreateQuiz";
import CreateQuestions from "@/views/create/CreateQuestions";

const CreateComponent = () => {
  const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: isSmallDevice ? "auto" : "84vh",
        display: "flex",
        flexDirection: isSmallDevice ? "column" : "row",
      }}
    >
      <Box
        sx={{
          flex: "1 1 100%",
          overflowY: "auto",
          height: isSmallDevice ? "60vh" : "auto",
          borderRight: isSmallDevice ? "none" : "1px solid #ccc",
          borderBottom: isSmallDevice ? "1px solid #ccc" : "none",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Create Category</Typography>
          <CreateCategory />
        </Box>
      </Box>
      <Box
        sx={{
          flex: "1 1 100%",
          overflowY: "auto",
          hheight: isSmallDevice ? "60vh" : "auto",

          borderRight: isSmallDevice ? "none" : "1px solid #ccc",
          borderBottom: isSmallDevice ? "1px solid #ccc" : "none",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Create Quiz</Typography>
          <CreateQuiz />
        </Box>
      </Box>
      <Box
        sx={{
          flex: "1 1 100%",
          overflowY: "auto",
          height: isSmallDevice ? "60vh" : "auto",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Create Question</Typography>
          <CreateQuestions />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateComponent;
