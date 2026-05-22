import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShopOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ROUTES } from '../../utils/constants';

// ─── Menu item definitions ─────────────────────────────────────
// key must match the route path exactly — this is how active highlight works
const menuItems = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: ROUTES.PRODUCTS,
    icon: <ShoppingOutlined />,
    label: 'Products',
  },
  {
    key: ROUTES.RECOMMENDATIONS,
    icon: <RobotOutlined />,
    label: 'Recommendations',
  },
  {
    key: ROUTES.APPROVALS,
    icon: <CheckCircleOutlined />,
    label: 'Approvals',
  },
  {
    key: ROUTES.REPORTS,
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
  {
    type: 'divider', // visual separator line
  },
  {
    key: ROUTES.USERS,
    icon: <TeamOutlined />,
    label: 'Users',
  },
  {
    key: ROUTES.MARKETPLACE_ACCOUNTS,
    icon: <ShopOutlined />,
    label: 'Marketplaces',
  },
  {
    key: ROUTES.SETTINGS,
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

const Sidebar = ({ collapsed }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // This reads the current URL and highlights the matching menu item
  // If URL is /products, the Products menu item gets highlighted automatically
  const activeKey = '/' + location.pathname.split('/')[1];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <>
      {/* Logo area at the top of the sidebar */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32,
          height: 32,
          background: '#1677ff',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}>
          PP
        </div>
        {/* Hide text when sidebar is collapsed */}
        {!collapsed && (
          <span style={{
            marginLeft: 10,
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            whiteSpace: 'nowrap',
          }}>
            PricePilot AI
          </span>
        )}
      </div>

      {/* Navigation menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          flex: 1,
          borderRight: 0,
          paddingTop: 8,
          overflow: 'auto',
        }}
      />
    </>
  );
};

export default Sidebar;