import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { Analytics } from '@vercel/analytics/react';
import { Toaster as Sonner } from "@/components/ui/sonner"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Index />
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
