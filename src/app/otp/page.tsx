"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import GoogleIcon from "@/components/GoogleIcon";
import ColorSchemeToggle from "@/components/ThemeRegistry/ColorSchemeToggle";
import { useRouter } from "next/navigation";
import Avatar from "@mui/joy/Avatar";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { verifyOtp } from "@/services/user";
import { authStorageService } from "@/utils/indexDb";
import { toast, ToastContainer } from "react-toastify";

const OTPInput = ({ value, onChange, onFocusNext }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 1) {
      onChange(val);
      onFocusNext();
    } else {
      onChange("");
    }
  };

  return (
    <Input
      type="text"
      maxLength={1}
      value={value}
      onChange={handleChange}
      sx={{ width: "40px", textAlign: "center" }}
    />
  );
};

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function otpVerify() {
  const router = useRouter();
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChangeOtp = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const focusNext = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      let authData = await authStorageService.getAuthData();

      const payload = {
        otp: otp.join(""),
        email: authData?.email,
      };

      const verifyOtpRes = await verifyOtp(payload);
      const publicKey = verifyOtpRes?.data?.publicKey;
      const privateKey = verifyOtpRes?.data?.privateKey;
      const loginToken = verifyOtpRes?.data?.token;
      if (loginToken) {
        localStorage.setItem("loginToken", loginToken);
      }
      await authStorageService?.savePrivateKey(privateKey, publicKey);
      await authStorageService?.getAuthData();
      toast.success(`OTP verified successfully`);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
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
              <form onSubmit={handleSubmit}>
                <FormLabel>Enter OTP</FormLabel>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  {otp.map((value, index) => (
                    <OTPInput
                      key={index}
                      index={index}
                      value={value}
                      onChange={(val) => handleChangeOtp(index, val)}
                      onFocusNext={() => focusNext(index)}
                      onFocusPrev={() => focusPrev(index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </Box>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    onClick={handleSubmit}
                    startDecorator={<PlayArrowIcon />}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </Stack>
              </form>
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
