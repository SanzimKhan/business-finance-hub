import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import Index from "./pages/Index";
import RentPage from "./pages/RentPage";
import SalaryPage from "./pages/SalaryPage";
import MarketingPage from "./pages/MarketingPage";
import ExpensesPage from "./pages/ExpensesPage";
import StockPage from "./pages/StockPage";
import PrintingPage from "./pages/PrintingPage";
import CoursesPage from "./pages/CoursesPage";
import SchoolPage from "./pages/SchoolPage";
import ProjectsPage from "./pages/ProjectsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/3d-printing" element={<PrintingPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
