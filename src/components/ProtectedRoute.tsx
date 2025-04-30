"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
        
    if (!token) {
      router.push("/sign-up");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null;

  return <>{children}</>;
}
