import React from "react"
import UserForm from "../../components/UserForm";
import { SignActions } from "../../enum/SignActions";

export default function Signup() {
  return (
    <>
      <UserForm action={SignActions.signup} />
    </>
  );
}
