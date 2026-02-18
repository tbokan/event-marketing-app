import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormWizard } from "@/components/FormWizard";
import { ClosedMessage } from "@/components/ClosedMessage";
import { useDeadline } from "@/hooks/useDeadline";

const queryClient = new QueryClient();

function AppContent() {
  const { isPastDeadline } = useDeadline();
  return isPastDeadline ? <ClosedMessage /> : <FormWizard />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
