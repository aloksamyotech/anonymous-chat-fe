"use client";
import React from "react";
import Box from "@mui/joy/Box";
import MyMessages from "@/components/MyMessages";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar />
        <Header />
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
          <MyMessages />
        </Box>
      </Box>
    </ProtectedRoute>
  );
}

export default page;
