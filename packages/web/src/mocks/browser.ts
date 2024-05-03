import { tenant } from "@/models/tenant";
import { handlers } from "msw-sp";
import { setupWorker } from "msw/browser";

export const worker = setupWorker(...handlers(tenant));
