import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import RentPage from "./pages/RentPage";
import SalaryPage from "./pages/SalaryPage";
import MarketingPage from "./pages/MarketingPage";
import ExpensesPage from "./pages/ExpensesPage";
import StockPage from "./pages/StockPage";
import PrintingPage from "./pages/PrintingPage";
import CoursesPage from "./pages/CoursesPage";
import SchoolPage from "./pages/SchoolPage";
import ProjectsPage from "./pages/ProjectsPage";
import MonthlyEntryPage from "./pages/MonthlyEntryPage";
import ShareholdersPage from "./pages/ShareholdersPage";
import LoansPage from "./pages/LoansPage";
import PredictionsPage from "./pages/PredictionsPage";
import EcosystemPage from "./pages/EcosystemPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FinanceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/rent" element={<ProtectedRoute><RentPage /></ProtectedRoute>} />
              <Route path="/salary" element={<ProtectedRoute><SalaryPage /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
              <Route path="/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
              <Route path="/3d-printing" element={<ProtectedRoute><PrintingPage /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
              <Route path="/school" element={<ProtectedRoute><SchoolPage /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
              <Route path="/monthly" element={<ProtectedRoute><MonthlyEntryPage /></ProtectedRoute>} />
              <Route path="/shareholders" element={<ProtectedRoute><ShareholdersPage /></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
              <Route path="/predictions" element={<ProtectedRoute><PredictionsPage /></ProtectedRoute>} />
              <Route path="/ecosystem" element={<ProtectedRoute><EcosystemPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FinanceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
