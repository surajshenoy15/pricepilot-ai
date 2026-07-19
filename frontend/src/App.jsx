import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Space,
  ConfigProvider,
  theme as antTheme,
  Menu,
  Button,
  App as AntdApp,
  Drawer,
  Grid,
  Badge,
  Popover,
  Modal,
  Input,
  Tag,
  Divider,
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  AuditOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  MenuOutlined,
  SearchOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  CodeOutlined,
} from '@ant-design/icons';

import Login from './pages/Login';
import Landing from './pages/Landing';
import PricePilotLogo from './components/common/Logo';
import BrandLoader from './components/common/BrandLoader';
import PageLoader from './components/common/PageLoader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const Reports = lazy(() => import('./pages/Reports'));
const MarketplaceAccounts = lazy(() => import('./pages/MarketplaceAccounts'));
import './styles/app-shell.css';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard', hint: 'Overview and performance' },
  { key: '/products', icon: <ShoppingOutlined />, label: 'Products', hint: 'Catalog and listings' },
  { key: '/recommendations', icon: <ThunderboltOutlined />, label: 'AI Recommendations', hint: 'Pricing decisions' },
  { key: '/marketplace-accounts', icon: <AppstoreOutlined />, label: 'Marketplaces', hint: 'Connected channels' },
  { key: '/users', icon: <TeamOutlined />, label: 'User Management', hint: 'Roles and access' },
  { key: '/reports', icon: <FileTextOutlined />, label: 'Reports', hint: 'Analytics and exports' },
  { key: '/audit-log', icon: <AuditOutlined />, label: 'Audit Log', hint: 'Activity timeline' },
];

const pageMeta = {
  '/dashboard': { title: 'Dashboard', eyebrow: 'Command center' },
  '/products': { title: 'Product Catalog', eyebrow: 'Commerce operations' },
  '/recommendations': { title: 'AI Recommendations', eyebrow: 'Decision intelligence' },
  '/marketplace-accounts': { title: 'Marketplaces', eyebrow: 'Channel connections' },
  '/users': { title: 'User Management', eyebrow: 'Workspace administration' },
  '/reports': { title: 'Reports & Analytics', eyebrow: 'Business intelligence' },
  '/audit-log': { title: 'Audit Log', eyebrow: 'Governance and traceability' },
};

const getActiveKey = (pathname) => {
  if (pathname.startsWith('/products/')) return '/products';
  return menuItems.find((item) => pathname.startsWith(item.key))?.key || '/dashboard';
};

const notificationItems = [
  {
    icon: <ThunderboltOutlined />,
    className: 'ai',
    title: 'New pricing actions available',
    copy: 'Three recommendations are waiting for review.',
    time: 'Just now',
  },
  {
    icon: <CheckCircleFilled />,
    className: 'success',
    title: 'Marketplace sync completed',
    copy: 'Amazon catalog data is now up to date.',
    time: '12 min ago',
  },
  {
    icon: <SafetyCertificateOutlined />,
    className: 'secure',
    title: 'Margin guard is active',
    copy: 'All monitored listings remain above safe price.',
    time: '1 hr ago',
  },
];

function NavigationMenu({ location, navigate, collapsed, onNavigate }) {
  return (
    <Menu
      mode="inline"
      selectedKeys={[getActiveKey(location.pathname)]}
      items={menuItems.map(({ key, icon, label }) => ({ key, icon, label }))}
      onClick={({ key }) => {
        navigate(key);
        onNavigate?.();
      }}
      inlineCollapsed={collapsed}
      className="pp-nav-menu"
    />
  );
}

function SidebarContent({ collapsed, location, navigate, onNavigate }) {
  return (
    <div className="pp-sidebar-inner">
      <Link to="/dashboard" className={`pp-sidebar-brand ${collapsed ? 'is-collapsed' : ''}`} onClick={onNavigate}>
        <PricePilotLogo size={40} collapsed={collapsed} />
      </Link>

      {!collapsed && (
        <div className="pp-sidebar-label">Workspace</div>
      )}

      <NavigationMenu
        collapsed={collapsed}
        location={location}
        navigate={navigate}
        onNavigate={onNavigate}
      />

      <div className="pp-sidebar-spacer" />

      {!collapsed ? (
        <div className="pp-engine-card">
          <div className="pp-engine-topline">
            <span className="pp-engine-orb"><ThunderboltOutlined /></span>
            <span className="pp-engine-status"><i /> AI engine online</span>
          </div>
          <div className="pp-engine-title">Pricing intelligence is active</div>
          <div className="pp-engine-copy">Monitoring products, listings, and margin signals.</div>
          <Link to="/recommendations" onClick={onNavigate} className="pp-engine-link">
            Review signals <RightOutlined />
          </Link>
        </div>
      ) : (
        <Link to="/recommendations" className="pp-collapsed-engine" title="AI engine online">
          <Badge status="processing" />
          <ThunderboltOutlined />
        </Link>
      )}

      <div className={`pp-sidebar-footer ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="pp-version-dot" />
        {!collapsed && <span>PricePilot AI · v1.0</span>}
      </div>
    </div>
  );
}

function NotificationPanel({ navigate }) {
  return (
    <div className="pp-notification-panel">
      <div className="pp-notification-header">
        <div>
          <Title level={5}>Notifications</Title>
          <Text>Operational updates from your workspace</Text>
        </div>
        <Tag bordered={false}>3 new</Tag>
      </div>
      <div className="pp-notification-list">
        {notificationItems.map((item) => (
          <button key={item.title} type="button" className="pp-notification-item">
            <span className={`pp-notification-icon ${item.className}`}>{item.icon}</span>
            <span className="pp-notification-copy">
              <strong>{item.title}</strong>
              <span>{item.copy}</span>
              <small>{item.time}</small>
            </span>
          </button>
        ))}
      </div>
      <Button type="text" block onClick={() => navigate('/audit-log')} className="pp-notification-action">
        Open activity log <RightOutlined />
      </Button>
    </div>
  );
}

function CommandPalette({ open, onClose, navigate }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menuItems;
    return menuItems.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={610}
      centered
      closeIcon={<CloseOutlined />}
      className="pp-command-modal"
      title={null}
    >
      <div className="pp-command-search">
        <SearchOutlined />
        <Input
          autoFocus
          bordered={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pages and workspace actions..."
        />
        <kbd>ESC</kbd>
      </div>
      <Divider />
      <div className="pp-command-caption">Navigate to</div>
      <div className="pp-command-results">
        {results.map((item) => (
          <button
            type="button"
            key={item.key}
            onClick={() => {
              navigate(item.key);
              onClose();
            }}
            className="pp-command-item"
          >
            <span className="pp-command-icon">{item.icon}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.hint}</small>
            </span>
            <RightOutlined />
          </button>
        ))}
        {results.length === 0 && <div className="pp-command-empty">No matching workspace page.</div>}
      </div>
    </Modal>
  );
}

function AppLayout({ isDark, toggleDark }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const activeKey = getActiveKey(location.pathname);
  const currentMeta = location.pathname.startsWith('/products/')
    ? { title: 'Product Details', eyebrow: 'Commerce operations' }
    : pageMeta[activeKey] || pageMeta['/dashboard'];

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'identity',
        disabled: true,
        label: (
          <div className="pp-profile-menu-head">
            <strong>{user.name || 'Workspace Admin'}</strong>
            <span>{user.email || 'admin@pricepilot.ai'}</span>
          </div>
        ),
      },
      { type: 'divider' },
      { key: 'profile', icon: <UserOutlined />, label: 'Profile & preferences' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Workspace settings' },
      { key: 'support', icon: <QuestionCircleOutlined />, label: 'Help & support' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', danger: true, onClick: handleLogout },
    ],
  };

  return (
    <Layout className={`pp-app-shell ${isDark ? 'is-dark' : ''}`}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={266}
          collapsedWidth={84}
          trigger={null}
          className="pp-sidebar"
        >
          <SidebarContent collapsed={collapsed} location={location} navigate={navigate} />
        </Sider>
      )}

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={286}
        closable={false}
        className="pp-mobile-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <SidebarContent
          collapsed={false}
          location={location}
          navigate={navigate}
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      <Layout className="pp-main-layout">
        <Header className="pp-topbar">
          <div className="pp-topbar-left">
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileOpen(true)}
                className="pp-icon-button pp-mobile-menu-button"
                aria-label="Open navigation"
              />
            ) : (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed((value) => !value)}
                className="pp-icon-button"
                aria-label="Toggle navigation"
              />
            )}

            <div className="pp-page-context">
              <span>{currentMeta.eyebrow}</span>
              <strong>{currentMeta.title}</strong>
            </div>
          </div>

          <div className="pp-topbar-actions">
            <button type="button" className="pp-command-trigger" onClick={() => setCommandOpen(true)}>
              <SearchOutlined />
              <span>Search workspace</span>
              <kbd><CodeOutlined /> K</kbd>
            </button>

            <Popover
              trigger="click"
              placement="bottomRight"
              arrow={false}
              content={<NotificationPanel navigate={navigate} />}
              overlayClassName="pp-notification-popover"
            >
              <Badge dot offset={[-6, 7]}>
                <Button type="text" icon={<BellOutlined />} className="pp-icon-button" aria-label="Notifications" />
              </Badge>
            </Popover>

            <Button
              type="text"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleDark}
              className="pp-icon-button pp-theme-button"
              aria-label="Toggle color theme"
            />

            <div className="pp-topbar-divider" />

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']} overlayClassName="pp-user-dropdown">
              <button type="button" className="pp-user-trigger">
                <Avatar className="pp-user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'P'}
                </Avatar>
                <span className="pp-user-copy">
                  <strong>{user.name || 'Admin'}</strong>
                  <small>{user.role?.replaceAll('_', ' ') || 'Tenant Admin'}</small>
                </span>
                <RightOutlined className="pp-user-chevron" />
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="pp-content">
          <div className="pp-content-grid" aria-hidden="true" />
          <div key={location.pathname} className="pp-route-stage">
            <Suspense fallback={<PageLoader text="Loading workspace module..." />}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/audit-log" element={<AuditLog />} />
                <Route path="/marketplace-accounts" element={<MarketplaceAccounts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Content>
      </Layout>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} navigate={navigate} />
    </Layout>
  );
}

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1050);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location.pathname]);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (booting) return <BrandLoader />;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          colorInfo: '#2563eb',
          colorSuccess: '#059669',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          borderRadius: 12,
          borderRadiusLG: 18,
          fontFamily: "'Inter', 'Manrope', 'Segoe UI', system-ui, sans-serif",
          controlHeight: 40,
          controlHeightLG: 46,
          boxShadowSecondary: '0 18px 48px rgba(15,23,42,.12)',
        },
        components: {
          Button: { fontWeight: 700, primaryShadow: '0 10px 24px rgba(37,99,235,.22)' },
          Card: { headerFontSize: 15 },
          Menu: { itemBorderRadius: 12, itemHeight: 46, iconSize: 17 },
          Modal: { borderRadiusLG: 24 },
          Table: { headerBg: isDark ? '#111827' : '#f8fafc' },
        },
      }}
    >
      <AntdApp>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <AppLayout isDark={isDark} toggleDark={toggleDark} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
