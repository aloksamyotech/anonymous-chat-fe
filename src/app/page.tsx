"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import { useColorScheme } from "@mui/joy/styles";
import IconButton from "@mui/joy/IconButton";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useRouter } from "next/navigation"; 
import Hero from "@/components/Hero";

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <IconButton
      id="toggle-mode"
      size="lg"
      variant="soft"
      color="neutral"
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
      sx={{
        position: "fixed",
        zIndex: 999,
        top: "1rem",
        right: "1rem",
        borderRadius: "50%",
        boxShadow: "sm",
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <>
      <ColorSchemeToggle />
      <Box
        sx={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          "& > div": {
            scrollSnapAlign: "start",
          },
        }}
      >
      </Box>
    </>
  );
}
