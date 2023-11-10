import { Form, useActionData, useNavigation } from "react-router-dom";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import { InputField } from "../../molecules/InputField/InputField";

export const Auth = () => {
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <Form method="post" action="/auth">
      <Typography level="h2">Send log in code</Typography>
      <div className="grid grid-cols-1 gap-2 mb-2 justify-between items-center">
        <InputField
          label="email"
          issues={actionData?.error?.issues?.email}
          name="email"
          type="email"
        />
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
    </Form>
  );
};
