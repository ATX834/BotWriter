import React from "react";
import UserForm from "../../components/UserForm";
import { SignActions } from "../../enum/SignActions";

export default function Login() {
  return (
    <>
      <UserForm action={SignActions.login} />
    </> 
  );
}
