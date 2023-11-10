import { useEffect, useRef } from "react";
import { redirect, useLoaderData } from "react-router";
import { Link, useFetcher } from "react-router-dom";
import { z } from "zod";
import { Typography } from "../../../atoms/Typography";
import { Button } from "../../../atoms/Button";
import { Input } from "../../../atoms/Input";
import { ArrowLeft, Copy } from "../../../tokens";
import { ListItem } from "../../../molecules/ListItem";
import { List } from "../../../organisms/List/List";
import api, { validatedApiCall } from "../../../../api";
import { InputField } from "../../../molecules/InputField/InputField";

export const ConfigLoader = async ({ params }) => {
  const { data, error } = await api.getConfig(params.cid);
  if (api.isNotFound(error)) {
    throw redirect("/configs");
  }
  return { data, error };
};

export const ConfigAction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE":
      return await api.deleteConfig(params.cid);
    case "PATCH":
      const data = Object.fromEntries(await request.formData());

      return await validatedApiCall(
        api.updateConfig.bind(this, params.cid),
        z.object({
          name: z.string().min(2, "Name must be 2 or more characters long"),
        }),
      )(data);
    default:
      return null;
  }
};

export const Config = () => {
  const listHeadingRef = useRef();
  const formRef = useRef();
  const fetcher = useFetcher();
  const { data, error } = useLoaderData();

  useEffect(() => {
    if (fetcher.state === "idle" && formRef.current) {
      formRef.current.reset();
    }
  }, [fetcher.state, formRef]);

  const handleCopyFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    navigator.clipboard.writeText(formData.get("value"));
  };

  if (error) {
    // TODO: Show some error component
    return null;
  }

  return (
    <div>
      <div className="flex">
        <Link to="..">
          <div className="flex gap-1 py-1 px-2 hover:underline">
            <ArrowLeft />
            <Typography>back</Typography>
          </div>
        </Link>
      </div>
      <div>
        <Typography level="h1">{data.name}</Typography>
      </div>
      <div className="mb-8">
        <form onSubmit={handleCopyFormSubmit}>
          <label className="flex flex-col">
            <Typography level="sm">config key</Typography>
            <div className="flex gap-2">
              <Input name="value" readOnly value={data.key.value} />
              {/* TODO: Use popover when React supports Popover API
                  see: https://github.com/facebook/react/pull/27480 */}
              <Button variant="outlined" aria-label="copy">
                <Copy />
              </Button>
            </div>
          </label>
        </form>
      </div>

      <div>
        <fetcher.Form ref={formRef} method="post" action="fields">
          <Typography level="h2">create a field</Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 justify-between">
            <InputField
              label="key"
              issues={fetcher.data?.error?.issues?.key}
              name="key"
              type="text"
            />
            <InputField
              label="value"
              issues={fetcher.data?.error?.issues?.value}
              name="value"
              type="text"
            />
            <div className="flex justify-end col-span-full">
              <Button type="submit" variant="outlined">
                create
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </div>

      {Boolean(data.fields.length) && (
        <>
          <Typography ref={listHeadingRef} level="h2" tabIndex="0">
            config fields
          </Typography>
          <List total={data.fields.length}>
            {data.fields.map((field) => (
              <ListItem
                key={field.id}
                getText={(fetcher) => {
                  const key = fetcher.formData?.get("key") || field.key;
                  const value = fetcher.formData?.get("value") || field.value;
                  return `${key}: ${value.length ? value : "<Empty value>"}`;
                }}
                inputs={[
                  {
                    name: "key",
                    value: field.key,
                    readOnly: true,
                  },
                  {
                    name: "value",
                    value: field.value,
                    autoFocus: true,
                  },
                ]}
                item={{
                  id: field.id,
                  actions: {
                    patch: `fields/${field.id}`,
                    delete: `fields/${field.id}`,
                  },
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
  );
};
