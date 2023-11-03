import { Form, useActionData, useNavigation } from "react-router-dom";
import { Input } from "../../atoms/Input";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";

function Auth() {
  const actionData = useActionData();
  const navigation = useNavigation();
  return (
    <Form method="post" action="/auth">
      <Typography level="h2">Send log in code</Typography>
      <div className="grid grid-cols-1 gap-2 mb-2 justify-between items-center">
        <label className="flex flex-col">
          <Typography level="sm">email</Typography>
          <Input type="email" name="email" />
        </label>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={navigation.state === "submitting"}
          variant="outlined"
        >
          Send
        </Button>
      </div>
      {actionData?.error && <p>{actionData?.error.message}</p>}
    </Form>
  );
}

export default Auth;
