import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { Input } from "../../../atoms/Input";
import { Button } from "../../../atoms/Button";
import { Typography } from "../../../atoms/Typography";
import { logIn } from "../../../../stores/auth-store";
import { InputField } from "../../../molecules/InputField/InputField";

export const LoginAction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const data = Object.fromEntries(await request.formData());
      return await logIn(data);
    default:
      return null;
  }
};

export const Login = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Form method="post" action="/auth/login">
      <Typography level="h2">Log in</Typography>
      <div className="mb-8">
        <Typography>You can find your passcode in your email</Typography>
      </div>
      <Input type="email" name="email" defaultValue={email} hidden />
      <div className="grid grid-cols-1 gap-2 mb-2 justify-between items-center">
        <InputField
          label="passcode (4 digits)"
          issues={actionData?.error?.issues?.passcode}
          type="text"
          name="passcode"
          inputMode="numeric"
          pattern="\d{4,4}"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={navigation.state === "submitting"}
          variant="outlined"
        >
          Log in
        </Button>
      </div>
      {actionData?.error && <p>{actionData?.error.message}</p>}
    </Form>
  );
};
