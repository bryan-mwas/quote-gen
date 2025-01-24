import { createFileRoute } from "@tanstack/react-router";
import QuotationForm from "../views/QuotationForm";

export const Route = createFileRoute("/guest")({
  component: Guest,
});

// Reinitialize zustand state

function Guest() {
  return <QuotationForm />;
}
