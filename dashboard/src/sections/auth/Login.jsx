// "use client";
// import { useAuth } from "@/context/userContext";
// import ApiRequest from "@/utils/apiRequest";
// import {
//   Box,
//   Button,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useFormik } from "formik";
// import { useRouter } from "next/navigation";
// import { useSnackbar } from "notistack";
// import { useEffect, useState } from "react";
// import * as Yup from "yup";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password should be of minimum 6 characters length")
//     .required("Password is required"),
// });

// const LoginPage = () => {
//   const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     if (isAuthenticated && typeof window !== "undefined") {
//       router.push("/");
//     }
//   }, [isAuthenticated, router]);

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const res = await ApiRequest.post("/user/login", values);
//         const { loggedInUser } = res?.data?.data;

//         if (loggedInUser?.role === "admin") {
//           setIsAuthenticated(true);
//           localStorage.setItem(
//             "token",
//             JSON.stringify(res?.data?.data?.refreshToken)
//           );
//           setUser(loggedInUser);
//           enqueueSnackbar("Login Successful", {
//             variant: "success",
//           });
//           router.push("/");
//         } else {
//           enqueueSnackbar("Not Authorized", {
//             variant: "error",
//           });
//         }
//       } catch (error) {
//         enqueueSnackbar("Failed to Login!", { variant: "error" });
//         setIsAuthenticated(false);
//         setErrorMessage(error.response?.data?.message);
//       }
//     },
//   });

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//       }}
//     >
//       <Paper
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "white",
//           borderRadius: "10px",
//           padding: 6,
//         }}
//       >
//         <Typography variant="h4" sx={{ mb: 3 }}>
//           Login
//         </Typography>
//         <Typography variant="subtitle1" sx={{ mb: 3, color: "red" }}>
//           ** Only Admins are allowed to access this page
//         </Typography>
//         <Box
//           component="form"
//           onSubmit={formik.handleSubmit}
//           sx={{ width: "100%", maxWidth: "400px" }}
//         >
//           <Stack spacing={2}>
//             <TextField
//               fullWidth
//               id="email"
//               name="email"
//               placeholder="Email Address"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               error={formik.touched.email && Boolean(formik.errors.email)}
//               helperText={formik.touched.email && formik.errors.email}
//             />
//             <TextField
//               fullWidth
//               id="password"
//               name="password"
//               type="password"
//               placeholder="Password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//             />
//             <Button color="primary" variant="contained" fullWidth type="submit">
//               Login
//             </Button>
//           </Stack>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default LoginPage;

//dashboard\src\sections\auth\Login.jsx
"use client";
import { useAuth } from "@/context/userContext";
import ApiRequest from "@/utils/apiRequest";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
});

const LoginPage = () => {
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
         const res = await ApiRequest.post("/user/login", values);
          // the backend returns your admin under `user`, not `loggedInUser` 
          const { user, refreshToken } = res.data.data;

           if (user.role === "admin") {
            setIsAuthenticated(true); 
            // store the refreshToken you just pulled out 
          localStorage.setItem("token", JSON.stringify(refreshToken));
          // set the actual user object
          setUser(user);
          enqueueSnackbar("Login Successful", {
            variant: "success",
          });
          router.push("/");
        } else {
          enqueueSnackbar("Not Authorized", {
            variant: "error",
          });
        }
      } catch (error) {
        enqueueSnackbar("Failed to Login!", { variant: "error" });
        setIsAuthenticated(false);
        setErrorMessage(error.response?.data?.message);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: 6,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Login
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: "red" }}>
          ** Only Admins are allowed to access this page
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%", maxWidth: "400px" }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
              Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;


// // ─── Login.jsx (dashboard/src/sections/auth/Login.jsx) ───────────────────
// "use client";
// import { useAuth } from "@/context/userContext";
// import ApiRequest from "@/utils/apiRequest";
// import {
//   Box,
//   Button,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useFormik } from "formik";
// import { useRouter } from "next/navigation";
// import { useSnackbar } from "notistack";
// import { useEffect } from "react";
// import * as Yup from "yup";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Min 6 characters")
//     .required("Password is required"),
// });

// export default function LoginPage() {
//   const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push("/");
//     }
//   }, [isAuthenticated, router]);

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const res = await ApiRequest.post("/user/login", values);
//         const { user } = res.data.data;

//         if (user.role === "admin") {
//           setUser(user);
//           setIsAuthenticated(true);
//           enqueueSnackbar("Login successful", { variant: "success" });
//           router.push("/");
//         } else {
//           enqueueSnackbar("Not authorized", { variant: "error" });
//         }
//       } catch (err) {
//         enqueueSnackbar(err.response?.data?.message || "Login failed", {
//           variant: "error",
//         });
//         setIsAuthenticated(false);
//       }
//     },
//   });

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         background: "#f5f5f5",
//       }}
//     >
//       <Paper
//         sx={{
//           p: 6,
//           borderRadius: 2,
//           maxWidth: 400,
//           width: "100%",
//         }}
//       >
//         <Typography variant="h4" align="center" mb={3}>
//           Admin Login
//         </Typography>
//         <Typography
//           variant="body2"
//           align="center"
//           color="textSecondary"
//           mb={3}
//         >
//           ** Only Admins may log in here
//         </Typography>
//         <form onSubmit={formik.handleSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               fullWidth
//               id="email"
//               name="email"
//               label="Email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               error={
//                 formik.touched.email && Boolean(formik.errors.email)
//               }
//               helperText={formik.touched.email && formik.errors.email}
//             />
//             <TextField
//               fullWidth
//               id="password"
//               name="password"
//               label="Password"
//               type="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={
//                 formik.touched.password &&
//                 Boolean(formik.errors.password)
//               }
//               helperText={
//                 formik.touched.password && formik.errors.password
//               }
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               size="large"
//             >
//               Login
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// }
