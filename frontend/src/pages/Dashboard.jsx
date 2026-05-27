import { Row, Col, Typography, Alert, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import {
  ShoppingOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import StatCard from '../components/common/StatCard';
import { getDashboardStats } from '../api/salesApi';
import { formatCurrencyShort } from '../utils/formatters';

const { Title, Text } = Typography;

const Dashboard = () => {

  // ── 3-state pattern — use this every time you call an API ──
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>

      {/* ── Page header ──────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Overview of your pricing performance across all marketplaces
        </Text>
      </div>

      {/* ── Error state ──────────────────────────────────── */}
      {error && (
        <Alert
          message="Failed to load dashboard data"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 20, borderRadius: 8 }}
          onClose={() => setError(null)}
        />
      )}

      {/* ── Stat Cards ───────────────────────────────────── */}
      <Row gutter={[16, 16]}>

        <Col xs={24} sm={12} lg={6}>
          {loading ? <Skeleton active /> : (
            <StatCard
              title="Total Products"
              value={stats?.totalProducts ?? 0}
              icon={<ShoppingOutlined style={{ color: '#1677ff' }} />}
            />
          )}
        </Col>

        <Col xs={24} sm={12} lg={6}>
          {loading ? <Skeleton active /> : (
            <StatCard
              title="Pending Recommendations"
              value={stats?.pendingRecommendations ?? 0}
              icon={<RobotOutlined style={{ color: '#fa8c16' }} />}
            />
          )}
        </Col>

        <Col xs={24} sm={12} lg={6}>
          {loading ? <Skeleton active /> : (
            <StatCard
              title="Approved This Week"
              value={stats?.approvedThisWeek ?? 0}
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          )}
        </Col>

        <Col xs={24} sm={12} lg={6}>
          {loading ? <Skeleton active /> : (
            <StatCard
              title="Revenue Recovered"
              value={formatCurrencyShort(stats?.revenueRecovered ?? 0)}
              icon={<DollarOutlined style={{ color: '#722ed1' }} />}
            />
          )}
        </Col>

      </Row>

      {/* ── Charts placeholder ───────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: 24,
            border: '1px dashed #d9d9d9', textAlign: 'center',
            height: 280, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#bbb', fontSize: 14,
          }}>
            📈 Sales Trend Chart — coming Day 18
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: 24,
            border: '1px dashed #d9d9d9', textAlign: 'center',
            height: 280, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#bbb', fontSize: 14,
          }}>
            🥧 Marketplace Pie — coming Day 18
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;