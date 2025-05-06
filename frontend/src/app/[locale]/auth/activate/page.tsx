"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "utils/api";

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("激活链接无效或缺少 token。");
      return;
    }
    api
      .post("/api/users/activate", { token })
      .then(() => {
        setStatus("success");
        setMessage("激活成功！即将跳转到登录页。");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.detail || "激活失败，请检查链接或联系管理员。"
        );
      });
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <h2>账户激活</h2>
      {status === "pending" && <p>正在激活，请稍候...</p>}
      {status !== "pending" && <p>{message}</p>}
    </div>
  );
}
