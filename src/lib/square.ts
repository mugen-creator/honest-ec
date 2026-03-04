import { SquareClient, SquareEnvironment } from "square";

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === "production" ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

export const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID || "";
export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || "";
