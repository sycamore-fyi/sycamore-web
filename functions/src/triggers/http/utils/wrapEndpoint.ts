import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodRawShape } from "zod";
import { authenticateUser } from "../middleware/authenticateUser";

const emptyObjectSchema = z.object({});
type EmptyObject = typeof emptyObjectSchema._type

interface EndpointSchema<
  ParamsSchema extends ZodRawShape,
  BodySchema extends ZodRawShape,
  QuerySchema extends ZodRawShape
> {
  body?: ZodObject<BodySchema>,
  params?: ZodObject<ParamsSchema>,
  query?: ZodObject<QuerySchema>
}

export function wrapEndpoint<
  ParamsSchema extends ZodRawShape,
  BodySchema extends ZodRawShape,
  QuerySchema extends ZodRawShape,
  T extends boolean = true,
>(
  schema: EndpointSchema<ParamsSchema, BodySchema, QuerySchema>,
  isAuthenticated?: T
) {
  const paramsSchema = (schema.params ?? emptyObjectSchema) as ZodObject<ParamsSchema>;
  const bodySchema = (schema.body ?? emptyObjectSchema) as ZodObject<BodySchema>;
  const querySchema = (schema.query ?? emptyObjectSchema) as ZodObject<QuerySchema>;

  type Params = typeof schema.params extends undefined ? EmptyObject : typeof paramsSchema._type
  type Body = typeof schema.body extends undefined ? EmptyObject : typeof bodySchema._type
  type Query = typeof schema.query extends undefined ? EmptyObject : typeof querySchema._type
  type BaseReq = Request<Params, any, Body, Query>
  type Req = T extends true ? (BaseReq & { user: { id: string, email: string, picture: string, displayName?: string } }) : BaseReq

  return (endpoint: (req: Req, res: Response) => Promise<Response> | Response) => {
    const handler = async (
      req: Req,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const endpointSchema = z.object({
          body: bodySchema,
          params: paramsSchema,
          query: querySchema,
        });
        const _parsed = endpointSchema.parse(req);
        _parsed.body;
        return await endpoint(req, res);
      } catch (err) {
        return next(err);
      }
    };
    return [
      ...((isAuthenticated ?? true) ? [authenticateUser] : []),
      handler,
    ];
  };
}
