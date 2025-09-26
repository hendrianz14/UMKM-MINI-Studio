import { NextResponse } from "next/server";
import { HttpError } from "./errors";

type Handler<T> = (request: Request, context: T) => Promise<NextResponse>;

type RouteHandler<T> = (request: Request, context: T) => Promise<NextResponse>;

export function handleApi<T = Record<string, never>>(handler: Handler<T>): RouteHandler<T> {
  return async (request: Request, context: T) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
