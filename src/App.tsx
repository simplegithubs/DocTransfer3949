import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Pricing from './Pricing'
import Checkout from './Checkout'
import PaymentSuccess from './PaymentSuccess'
import DataRoom from './DataRoom'
import DocumentSharing from './DocumentSharing'
import SettingsPage from './pages/SettingsPage'
import ViewDocument from './ViewDocument'
import SignDocument from './SignDocument'
import ProtectedRoute from './components/ProtectedRoute'
import TemplateRouteWrapper from './pages/TemplateRouteWrapper'
import SEOCategoryPage from './pages/SEOCategoryPage'
import ComparisonsDirectory from './pages/ComparisonsDirectory'
import AlternativesDirectory from './pages/AlternativesDirectory'
import BlogDirectory from './pages/BlogDirectory'
import BlogPostDetail from './pages/BlogPostDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/view/:shareLink" element={<ViewDocument />} />
      <Route path="/sign/:signingLink" element={<SignDocument />} />
      <Route path="/templates/:slug" element={<TemplateRouteWrapper />} />

      {/* SEO Category Routes */}
      <Route path="/comparisons" element={<ComparisonsDirectory />} />
      <Route path="/alternatives" element={<AlternativesDirectory />} />
      <Route path="/alternatives/:slug" element={<SEOCategoryPage category="alternatives" />} />
      <Route path="/comparisons/:slug" element={<SEOCategoryPage category="comparisons" />} />
      <Route path="/how-to/:slug" element={<SEOCategoryPage category="how-to" />} />
      <Route path="/industry/:slug" element={<SEOCategoryPage category="industry" />} />
      <Route path="/gen-z/:slug" element={<SEOCategoryPage category="gen-z" />} />

      {/* Blog Routes */}
      <Route path="/blog" element={<BlogDirectory />} />
      <Route path="/blog/:slug" element={<BlogPostDetail />} />

      {/* Application Routes */}
      <Route
        path="/dataroom"
        element={
          <ProtectedRoute>
            <DataRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document-sharing"
        element={
          <ProtectedRoute>
            <DocumentSharing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
