import { useRef } from "react";
import { redirect, useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";
import { z } from "zod";
import { Typography } from "../../atoms/Typography";
import { Button } from "../../atoms/Button";
import { ListItem } from "../../molecules/ListItem";
import { InputField } from "../../molecules/InputField/InputField";
import { List } from "../../organisms/List/List";
import { isTokenValid } from "../../../stores/auth-store";
import api, { validatedApiCall } from "../../../api";

export const ConfigsLoader = async () => {
  if (!(await isTokenValid())) {
    throw redirect("/auth");
  }
  const { data, error } = await api.getConfigs();
  return { data, error };
};

export const ConfigsAction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const data = Object.fromEntries(await request.formData());

      return await validatedApiCall(
        api.createConfig,
        z.object({
          name: z.string().min(2, "Name must be 2 or more characters long"),
        }),
      )(data);
    default:
      return null;
  }
};

export const Configs = () => {
  const listHeadingRef = useRef();
  const fetcher = useFetcher();
  const { data, error } = useLoaderData();

  if (error) {
    // TODO: Show some error component
    return null;
  }

  return (
    <div>
      <div>
        <fetcher.Form method="post">
          <Typography level="h2">create a config</Typography>
          <div className="grid grid-cols-1 gap-2 mb-2 justify-between items-center">
            <InputField
              label="name"
              issues={fetcher.data?.error?.issues?.name}
              name="name"
              type="text"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="outlined">
                create
              </Button>
            </div>
          </div>
        </fetcher.Form>
        {Boolean(data.items.length) && (
          <>
            <Typography ref={listHeadingRef} level="h2" tabIndex="0">
              your configs
            </Typography>
            <List total={data.count}>
              {data.items.map((config) => (
                <ListItem
                  key={config.id}
                  getText={(fetcher) =>
                    fetcher.formData?.get("name") || config.name
                  }
                  inputs={[
                    {
                      autoFocus: true,
                      name: "name",
                      value: config.name,
                    },
                  ]}
                  item={{
                    id: config.id,
                    link: true,
                    actions: { patch: config.id, delete: config.id },
                    handlers: {
                      onDelete: () => {
                        listHeadingRef?.current?.focus();
                      },
                    },
                  }}
                />
              ))}
            </List>
          </>
        )}
      </div>
    </div>
  );
};
