import { NextResponse } from "next/server";

export enum EApiErrorCode {

}

export interface IApiErrorBody {
  statusCode: number;
  message: string;
  errorCode?: EApiErrorCode
}

export class ApiError extends Error{
  constructor(private body: IApiErrorBody) {
    super(`[${body.statusCode} - ${body.errorCode}]: ${body.message}`)
  }

  getBody() {
    return this.body;
  }

  buildNextResponse() {
    return NextResponse.json({
      message: this.body.message,
      errorCode: this.body.errorCode
    }, { status: this.body.statusCode })
  }
}