export const parseMiddleware = async (data, schema, next) => {
  const { success } = await schema.safeParseAsync(data);

  if (!success) {
    throw new HTTPException(400);
  }

  next();
};
