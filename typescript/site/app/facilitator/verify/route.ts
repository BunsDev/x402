import { PaymentRequirements, PaymentRequirementsSchema, evm } from "x402/types";
import { verify } from "x402/facilitator";

type VerifyRequest = {
  payload: string;
  details: PaymentRequirements;
};

const client = evm.createClientSepolia();

/**
 * Handles POST requests to verify x402 payments
 *
 * @param req - The incoming request containing payment verification details
 * @returns A JSON response indicating whether the payment is valid
 */
export async function POST(req: Request) {
  const body: VerifyRequest = await req.json();

  const paymentRequirements = PaymentRequirementsSchema.parse(body.details);

  // @ts-expect-error - Type instantiation is excessively deep
  const valid = await verify(client, body.payload, paymentRequirements);

  return Response.json(valid);
}

/**
 * Provides API documentation for the verify endpoint
 *
 * @returns A JSON response describing the verify endpoint and its expected request body
 */
export async function GET() {
  return Response.json({
    endpoint: "/verify",
    description: "POST to verify x402 payments",
    body: {
      payload: "string",
      details: "PaymentRequirements",
    },
  });
}
