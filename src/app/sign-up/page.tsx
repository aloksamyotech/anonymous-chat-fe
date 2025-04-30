"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import ColorSchemeToggle from "@/components/ThemeRegistry/ColorSchemeToggle";
import { loginFunction } from "@/services/user";
import { authStorageService, saveToIndexedDB } from "@/utils/indexDb";
import { ToastContainer, toast } from "react-toastify";
import { statusCodes } from "@/utils/statusCodes";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (values: { email: string }) => {
    try {
      const loginUser = await loginFunction(values);
      if (loginUser?.statusCode == statusCodes.Created) {
        toast.success(`OTP sent to email`);
        router.push(`/otp?email=${encodeURIComponent(values.email)}`);
      } else if (
        loginUser?.statusCode == statusCodes["Internal Server Error"]
      ) {
        toast.error(`Error to send email`);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px",
            "--Cover-width": "50vw",
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <Avatar
                onClick={() => router.push("/")}
                alt="company"
                sx={{ borderRadius: "10%", height: "2rem", width: "2rem" }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRABMFpu67LsuOACJ0DAeJDHkqtUWNDiwfQaw&s"
              />
              <Typography level="title-lg">Samyotech</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mt: 2 }}>
              <Formik
                initialValues={{
                  email: "",
                  persistent: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <FormControl required>
                      <FormLabel>Enter Your Email </FormLabel>
                      <Field
                        name="email"
                        type="email"
                        as={Input}
                        error={touched.email && !!errors.email}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </FormControl>

                    <Stack gap={4} sx={{ mt: 2 }}>
                      <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? "Generating...." : "Generate OTP"}{" "}
                        <PlayArrowIcon />
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>

          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © All Rights Reserved {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </>
  );
}
