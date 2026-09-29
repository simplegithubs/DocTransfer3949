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
import SEOHubDirectory from './pages/SEOHubDirectory'
import BlogDirectory from './pages/BlogDirectory'
import BlogPostDetail from './pages/BlogPostDetail'
import ResearchHub from './pages/ResearchHub'
import ResearchDetail from './pages/ResearchDetail'
import ToolsHub from './pages/tools/ToolsHub'
import PitchDeckAnalyzer from './pages/tools/PitchDeckAnalyzer'
import NDAGenerator from './pages/tools/NDAGenerator'
import RentAgreementGenerator from './pages/tools/RentAgreementGenerator'
import StampDutyCalculator from './pages/tools/StampDutyCalculator'
import RERACarpetAreaCalculator from './pages/tools/RERACarpetAreaCalculator'
import VDRCostCalculator from './pages/tools/VDRCostCalculator'
import PDFWatermarkTool from './pages/tools/PDFWatermarkTool'
import ESignComplianceChecker from './pages/tools/ESignComplianceChecker'
import DueDiligenceScorecard from './pages/tools/DueDiligenceScorecard'
import PDFEncryptionTool from './pages/tools/PDFEncryptionTool'
import ReadingTimeEstimator from './pages/tools/ReadingTimeEstimator'
import IntegrationsHub from './pages/IntegrationsHub'
import IntegrationDetail from './pages/IntegrationDetail'
import GlossaryHub from './pages/GlossaryHub'
import GlossaryDetail from './pages/GlossaryDetail'
import SolutionsHub from './pages/SolutionsHub'
import SolutionDetail from './pages/SolutionDetail'
import ConquestHub from './pages/ConquestHub'
import ConquestDetail from './pages/ConquestDetail'
import TemplatesHub from './pages/TemplatesHub'
import PressAndBadges from './pages/PressAndBadges'
import SecurityPage from './pages/SecurityPage'
import TransparencyPage from './pages/TransparencyPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import RefundPolicy from './pages/RefundPolicy'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
import RealEstateClosingRoom from './components/closing-rooms/RealEstateClosingRoom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/closing-room" element={<RealEstateClosingRoom />} />
      <Route path="/closing-room/:dealId" element={<RealEstateClosingRoom />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/transparency" element={<TransparencyPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/contact" element={<ContactPage />} />
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
      <Route path="/templates" element={<TemplatesHub />} />
      <Route path="/templates/:slug" element={<TemplateRouteWrapper />} />

      {/* SEO Category Routes */}
      <Route path="/sitemap-directory" element={<SEOHubDirectory />} />
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
      <Route path="/press" element={<PressAndBadges />} />

      {/* Research Routes */}
      <Route path="/research" element={<ResearchHub />} />
      <Route path="/research/:slug" element={<ResearchDetail />} />

      {/* Free Tools Routes */}
      <Route path="/tools" element={<ToolsHub />} />
      <Route path="/tools/rent-agreement-generator" element={<RentAgreementGenerator />} />
      <Route path="/tools/stamp-duty-calculator" element={<StampDutyCalculator />} />
      <Route path="/tools/rera-carpet-area-calculator" element={<RERACarpetAreaCalculator />} />
      <Route path="/tools/pitch-deck-analyzer" element={<PitchDeckAnalyzer />} />
      <Route path="/tools/nda-generator" element={<NDAGenerator />} />
      <Route path="/tools/vdr-cost-calculator" element={<VDRCostCalculator />} />
      <Route path="/tools/pdf-watermarking-tool" element={<PDFWatermarkTool />} />
      <Route path="/tools/esign-compliance-checker" element={<ESignComplianceChecker />} />
      <Route path="/tools/due-diligence-scorecard" element={<DueDiligenceScorecard />} />
      <Route path="/tools/pdf-encryption-tool" element={<PDFEncryptionTool />} />
      <Route path="/tools/reading-time-estimator" element={<ReadingTimeEstimator />} />

      {/* Integrations Routes */}
      <Route path="/integrations" element={<IntegrationsHub />} />
      <Route path="/integrations/:slug" element={<IntegrationDetail />} />

      {/* Glossary Routes */}
      <Route path="/glossary" element={<GlossaryHub />} />
      <Route path="/glossary/:slug" element={<GlossaryDetail />} />

      {/* Solutions / Use Cases Routes */}
      <Route path="/solutions" element={<SolutionsHub />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />

      {/* DocSend Conquest Routes */}
      <Route path="/docsend-alternative" element={<ConquestHub />} />
      <Route path="/docsend-alternative/:slug" element={<ConquestDetail />} />

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
        element={<SettingsPage />}
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
