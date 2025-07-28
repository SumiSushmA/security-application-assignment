"use client";
import React from "react";
import { Button, TextField, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";

const validationSchema = Yup.object({
  fullname: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const AddAdminComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const initialValues = {
    fullname: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await ApiRequest.post("/user/create-admin", {
        ...values,
        role: "admin",
      });
      console.log(response);
      enqueueSnackbar("Admin Registered successfully", { variant: "success" });
      resetForm();
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error registering admin", { variant: "error" });
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex", // Corrected the typo here
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: { xs: 300, md: 800 },
              }}
            >
              <Field
                as={TextField}
                name="fullname"
                label="Full Name"
                variant="outlined"
                fullWidth
                error={touched.fullname && Boolean(errors.fullname)}
                helperText={touched.fullname && errors.fullname}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                Add Admin
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddAdminComponent;
