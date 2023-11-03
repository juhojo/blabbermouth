import { useRef } from "react";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";
import { Typography } from "../../atoms/Typography";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { ListItem } from "../../molecules/ListItem";
import { List } from "../../organisms/List/List";

function Configs() {
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
            <label className="flex flex-col">
              <Typography level="sm">name</Typography>
              <Input name="name" type="text" />
            </label>
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
}

export default Configs;
