import UserForm from "../../components/UserForm";
import { SignActions } from "../../enum/SignActions";

export default function Resend() {
  return (
    <>
      <UserForm action={SignActions.resend} />
    </>
  );
}
