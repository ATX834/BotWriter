import React from "react";
import { useParams } from "react-router-dom";
import UserForm from "../../components/UserForm";
import { SignActions } from "../../enum/SignActions";

export default function Reset() {
    const { token } = useParams()
  return (
    <>
      <UserForm action={SignActions.reset} token={token}/>
    </>
  );
}
