import { useUpdateState } from "@/hooks/useUpdateState";
import { Loader2 } from "lucide-react";
import { MouseEventHandler } from "react";
import { Promisify } from "../routes/org/[organisationId]/settings/tabs/DetailsTab";

export function useClickProps({ onClick, buttonText }: {
  onClick: Promisify<MouseEventHandler>;
  buttonText: string;
}) {
  const [state, updateState] = useUpdateState({ isLoading: false });
  const handleClick: MouseEventHandler = async (...args) => {
    updateState({ isLoading: true });
    await onClick(...args);
    updateState({ isLoading: false });
  };
  return {
    onClick: handleClick,
    children: (
      <>
        {state.isLoading ? <Loader2 className="animate-spin" color="white" /> : buttonText}
      </>
    )
  };
}

export function useSubmitProps() {
  return ({ isLoading, buttonText }: {
    isLoading: boolean,
    buttonText: string
  }) => ({
    type: "submit" as const,
    children: (
      <>
        {isLoading ? <Loader2 className="animate-spin" color="white" /> : buttonText}
      </>
    )
  })
}
