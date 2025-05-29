import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/lib/auth";

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch("http://localhost:3001/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch user info", response.statusText);
        return;
      }

      const user = await response.json();

      if (idToken) localStorage.setItem("token", idToken);

      login({
        id: user.id,
        name: user.full_name,
        email: user.email,
        picture: user.picture,
      });
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error fetching user info", error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        text="continue_with"
        onError={() => console.error("Login Failed")}
      />
    </div>
  );
};

export default SignIn;
