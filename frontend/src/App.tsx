import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ProductDetail from "./pages/ProductDetail";
import Projects from "./pages/Projects";
import Academy from "./pages/Academy";
import AcademyDetail from "./pages/AcademyDetail";

// Admin imports
import { AuthProvider } from "./admin/context/AuthContext";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProjectList from "./admin/pages/ProjectList";
import ProjectFormPage from "./admin/pages/ProjectForm";
import AcademyList from "./admin/pages/AcademyList";
import AcademyFormPage from "./admin/pages/AcademyForm";
import ProductList from "./admin/pages/ProductList";
import ProductFormPage from "./admin/pages/ProductForm";
import CategoryList from "./admin/pages/CategoryList";
import TechStackList from "./admin/pages/TechStackList";
import LandingEditor from "./admin/pages/LandingEditor";
import SiteSettings from "./admin/pages/SiteSettings";
import MediaLibrary from "./admin/pages/MediaLibrary";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:slug" element={<AcademyDetail />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={
            <AuthProvider><AdminLogin /></AuthProvider>
          } />
          <Route path="/admin" element={
            <AuthProvider><AdminLayout /></AuthProvider>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/create" element={<ProjectFormPage />} />
            <Route path="projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="academy" element={<AcademyList />} />
            <Route path="academy/create" element={<AcademyFormPage />} />
            <Route path="academy/:id/edit" element={<AcademyFormPage />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="tech-stacks" element={<TechStackList />} />
            <Route path="landing" element={<LandingEditor />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="media" element={<MediaLibrary />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
