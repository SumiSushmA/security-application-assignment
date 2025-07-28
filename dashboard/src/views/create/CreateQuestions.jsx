import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/userContext";

const validationSchema = Yup.object().shape({
  questionTitle: Yup.string().required("Question Title is required"),
  options: Yup.array()
    .of(Yup.string().required("Option cannot be empty"))
    .min(4, "At least 4 options are required")
    .max(4, "No more than 4 options allowed"),
  correct_option: Yup.string().required("Correct Option is required"),
  quiz: Yup.string().required("Quiz is required"),
  category: Yup.string().required("Category is required"),
});

const CreateQuestions = () => {
  const { categories, fetchCategories, addQuestion } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      questionTitle: "",
      coverImage: null,
      options: ["", "", "", ""],
      correct_option: "",
      category: "",
      quiz: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.options.indexOf(values.correct_option) === -1) {
          enqueueSnackbar("Correct option must be one of the options", {
            variant: "error",
          });
          return;
        }

        const formData = new FormData();
        formData.append("questionTitle", values.questionTitle);

        if (values.coverImage) {
          formData.append("coverImage", values.coverImage);
        }

        values.options.forEach((option, index) => {
          formData.append(`options[${index}]`, option);
        });
        formData.append("correct_option", values.correct_option);
        formData.append("category", values.category);
        formData.append("quiz", values.quiz);

        let response;
        if (selectedQuestion) {
          response = await ApiRequest.patch(
            `/question/${selectedQuestion._id}`,
            formData
          );
          enqueueSnackbar("Question updated successfully", {
            variant: "success",
          });
        } else {
          response = await ApiRequest.post("/question", formData);
          enqueueSnackbar("Question added successfully", {
            variant: "success",
          });
        }

        addQuestion(response.data.data.question);
        resetForm();
        setSelectedQuestion(null);
        setImagePreview(null);
      } catch (error) {
        console.error("Error adding/updating question:", error);
        enqueueSnackbar("Failed to add/update question", { variant: "error" });
      }
    },
  });

  const handleOptionChange = (index, event) => {
    const newOptions = [...formik.values.options];
    newOptions[index] = event.target.value;
    formik.setFieldValue("options", newOptions);
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryId = event.target.value;
    formik.setFieldValue("category", selectedCategoryId);
    console.log(selectedCategoryId);

    try {
      const response = await ApiRequest.get(`/category/${selectedCategoryId}`);
      console.log(response);
      const categoryQuizzes = response.data.data.category.quizzes || [];
      setQuizzes(categoryQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };
  console.log(quizzes);

  const handleImageChange = (event) => {
    formik.setFieldValue("coverImage", event.currentTarget.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(event.currentTarget.files[0]);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    formik.setValues({
      questionTitle: question.questionTitle,
      options: question.options,
      correct_option: question.correct_option,
      category: question.category._id,
      quiz: question.quiz._id,
    });
    if (question.coverImage) {
      setImagePreview(question.coverImage);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="questionTitle"
          label="Question Title"
          fullWidth
          sx={{ mb: 2 }}
          value={formik.values.questionTitle}
          onChange={formik.handleChange}
          error={
            formik.touched.questionTitle && Boolean(formik.errors.questionTitle)
          }
          helperText={
            formik.touched.questionTitle && formik.errors.questionTitle
          }
        />
        <Stack sx={{ mb: 2 }}>
          <input
            accept="image/*"
            id="coverImageQuestion"
            name="coverImage"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="coverImageQuestion">
            <Button
              variant="outlined"
              component="span"
              sx={{
                mt: 2,
                textTransform: "none",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f8f8",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Upload Cover Image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Cover Preview"
                style={{ maxWidth: "120px", maxHeight: "120px" }}
              />
            </Box>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          {[0, 1].map((index) => (
            <TextField
              key={index}
              name={`options[${index}]`}
              label={`Option ${index + 1}`}
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.options[index]}
              onChange={(event) => handleOptionChange(index, event)}
              error={
                formik.touched.options &&
                formik.touched.options[index] &&
                Boolean(formik.errors.options?.[index])
              }
              helperText={
                formik.touched.options &&
                formik.touched.options[index] &&
                formik.errors.options?.[index]
              }
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {[2, 3].map((index) => (
            <TextField
              key={index}
              name={`options[${index}]`}
              label={`Option ${index + 1}`}
              fullWidth
              sx={{ mb: 2 }}
              value={formik.values.options[index]}
              onChange={(event) => handleOptionChange(index, event)}
              error={
                formik.touched.options &&
                formik.touched.options[index] &&
                Boolean(formik.errors.options?.[index])
              }
              helperText={
                formik.touched.options &&
                formik.touched.options[index] &&
                formik.errors.options?.[index]
              }
            />
          ))}
        </Stack>
        <Stack spacing={2} my={2}>
          <TextField
            name="correct_option"
            label="Correct Option"
            fullWidth
            sx={{ mb: 2 }}
            value={formik.values.correct_option}
            onChange={formik.handleChange}
            error={
              formik.touched.correct_option &&
              Boolean(formik.errors.correct_option)
            }
            helperText={
              formik.touched.correct_option && formik.errors.correct_option
            }
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              id="select-category"
              name="category"
              fullWidth
              value={formik.values.category}
              onChange={handleCategoryChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              displayEmpty
              renderValue={
                formik.values.category !== ""
                  ? undefined
                  : () => <em>Select Category</em>
              }
              sx={{ mb: 2 }}
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Category available</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              id="select-quiz"
              name="quiz"
              fullWidth
              value={formik.values.quiz}
              onChange={formik.handleChange}
              error={formik.touched.quiz && Boolean(formik.errors.quiz)}
              displayEmpty
              // disabled={!selectedCategoryId}
              renderValue={
                formik.values.quiz !== ""
                  ? undefined
                  : () => <em>Select Quiz</em>
              }
              sx={{ mb: 2 }}
            >
              <MenuItem disabled value="">
                <em>Select Quiz</em>
              </MenuItem>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <MenuItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No quizzes available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
        <Button type="submit" variant="contained" color="primary">
          {selectedQuestion ? "Update" : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateQuestions;
