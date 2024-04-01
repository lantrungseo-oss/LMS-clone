import Mux from "@mux/mux-node";

export const myMux =  new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);