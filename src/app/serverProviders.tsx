import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";

export function ServerProviders({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      {children}
    </TRPCReactProvider>
  );
}
