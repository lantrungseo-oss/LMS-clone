import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

export const routeErrorHandler = (routeHandler: (...params: any[]) => any | Promise<any>) => {
  return async (...params:  any[]) => {
    try {
      const res = await routeHandler(...params);
      return res;
    } catch(error) {
      if(error instanceof ApiError) {
        return error.buildNextResponse();
      }
      console.error(error);
      return NextResponse.json({
        message: 'Unknown error',
      }, { status: 500 });
    }
  }
  
}