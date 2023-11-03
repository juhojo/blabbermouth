import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router-dom";
import { Button } from "../../atoms/Button";
import { Pencil, Trash } from "../../tokens";
import { Input } from "../../atoms/Input";
import { Typography } from "../../atoms/Typography";

/**
 * ListItem
 *
 * @param {{
 *  item: {
 *    id: number,
 *    link?: boolean,
 *    actions: {
 *      put: string,
 *      delete: string,
 *    },
 *    handlers?: {
 *      onPut: () => void,
 *      onDelete: () => void,
 *    }
 *  },
 *  inputs: {
 *    autoFocus?: boolean,
 *    name: string,
 *    value: *,
 *    disabled?: boolean,
 *  }[],
 *  getText: (fetcher: import("react-router-dom").FetcherWithComponents<any>) => string
 * }} props
 * @returns
 */
export const ListItem = ({ item, inputs, getText }) => {
  const fetcher = useFetcher();
  const inputRef = useRef(null);
  const [showEditForm, setShowEditForm] = useState();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEditForm, inputRef.current]);

  useEffect(() => {
    if (
      showEditForm &&
      fetcher.state === "loading" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      setShowEditForm(!showEditForm);
    }
  }, [showEditForm, fetcher.data, fetcher.state]);

  useEffect(() => {
    if (
      fetcher.state === "loading" &&
      fetcher.data?.request?.method === "delete"
    ) {
      item.handlers?.onDelete();
    }
  }, [fetcher.data, fetcher.state]);

  const handleEditClick = () => {
    setShowEditForm(!showEditForm);
  };

  const text = getText(fetcher);

  return (
    <li className="flex justify-between px-3 py-1">
      {showEditForm ? (
        <fetcher.Form
          className="flex w-full justify-between gap-4"
          method="patch"
          action={`${item.actions.patch}`}
        >
          {inputs?.map((input) => (
            <Input
              key={input.name}
              ref={input.autoFocus ? inputRef : null}
              name={input.name}
              defaultValue={input.value}
              disabled={input.disabled}
            />
          ))}
          <div className="flex gap-2 justify-self-end">
            <Button type="button" onClick={handleEditClick} variant="text">
              cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              disabled={fetcher.state === "submitting"}
            >
              save
            </Button>
          </div>
        </fetcher.Form>
      ) : (
        <>
          {item.link ? (
            <Link
              key={item.id}
              to={`${item.id}`}
              className="flex self-center hover:underline"
            >
              {text}
            </Link>
          ) : (
            <Typography>{text}</Typography>
          )}
        </>
      )}
      {!showEditForm && (
        <div className="flex gap-1">
          <Button onClick={handleEditClick} aria-label="edit" variant="text">
            <Pencil />
          </Button>
          <fetcher.Form method="delete" action={`${item.actions.delete}`}>
            <Button aria-label="delete" variant="outlined">
              <Trash />
            </Button>
          </fetcher.Form>
        </div>
      )}
    </li>
  );
};
