import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './utils/constants';

// ─── Placeholder Pages ─────────────────────────────────────────
// These are temporary. You will replace each one with the real page file.
// Having them here now means your routing is fully wired up from day one.

const Login               = () => <div style={{ padding: 40 }}>📄 Login Page</div>;
const Dashboard           = () => <div style={{ padding: 40 }}>📊 Dashboard</div>;
const Products            = () => <div style={{ padding: 40 }}>📦 Products</div>;
const ProductDetail       = () => <div style={{ padding: 40 }}>🔍 Product Detail</div>;
const Recommendations     = () => <div style={{ padding: 40 }}>🤖 Recommendations</div>;
const RecommendationDetail= () => <div style={{ padding: 40 }}>🤖 Recommendation Detail</div>;
const Approvals           = () => <div style={{ padding: 40 }}>✅ Approvals</div>;
const Reports             = () => <div style={{ padding: 40 }}>📈 Reports</div>;
const Users               = () => <div style={{ padding: 40 }}>👥 Users</div>;
const MarketplaceAccounts = () => <div style={{ padding: 40 }}>🛍️ Marketplace Accounts</div>;
const Settings            = () => <div style={{ padding: 40 }}>⚙️ Settings</div>;

// ─── App ───────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route — no auth needed */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Protected routes — will add auth guard on Day 4 */}
        <Route path={ROUTES.DASHBOARD}             element={<Dashboard />} />
        <Route path={ROUTES.PRODUCTS}              element={<Products />} />
        <Route path={ROUTES.PRODUCT_DETAIL}        element={<ProductDetail />} />
        <Route path={ROUTES.RECOMMENDATIONS}       element={<Recommendations />} />
        <Route path={ROUTES.RECOMMENDATION_DETAIL} element={<RecommendationDetail />} />
        <Route path={ROUTES.APPROVALS}             element={<Approvals />} />
        <Route path={ROUTES.REPORTS}               element={<Reports />} />
        <Route path={ROUTES.USERS}                 element={<Users />} />
        <Route path={ROUTES.MARKETPLACE_ACCOUNTS}  element={<MarketplaceAccounts />} />
        <Route path={ROUTES.SETTINGS}              element={<Settings />} />

        {/* Any unknown URL → redirect to login */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;