import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/userContext";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
});

const CreateCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { addCategory } = useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await ApiRequest.post("/category", values);
      addCategory(response.data.data.category);
      resetForm();
      enqueueSnackbar("Category added successfully", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to add category", { variant: "error" });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="name"
              placeholder="Category Name"
              fullWidth
              sx={{ mb: 2 }}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateCategory;
