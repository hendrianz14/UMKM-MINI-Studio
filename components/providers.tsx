"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import type { Messages } from "@/lib/i18n/get-messages";
import { I18nProvider } from "@/lib/i18n/context";

export function AppProviders({
  children,
  messages
}: {
  children: React.ReactNode;
  messages: Messages;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <I18nProvider messages={messages}>
          {children}
          <Toaster richColors position="top-right" />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
