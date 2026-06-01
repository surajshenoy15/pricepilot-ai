import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Statistic, Typography, Tag,
  Table, Progress, Space, Skeleton, Alert
} from 'antd';
import {
  ShoppingOutlined, AlertOutlined, CheckCircleOutlined,
  ThunderboltOutlined, ArrowUpOutlined, ArrowDownOutlined,
  EyeOutlined
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try /dashboard/stats first, fall back to computing from /products
        try {
          const res = await axiosClient.get('/dashboard/stats');
          setStats(res.data);
        } catch {
          // /dashboard/stats not available — compute from products
          const productsRes = await axiosClient.get('/products');
          const products = Array.isArray(productsRes.data)
            ? productsRes.data
            : productsRes.data.content ?? [];

          const allListings = products.flatMap(p => p.listings || []);
          const noSale  = allListings.filter(l => (l.ordersLast7Days || 0) === 0).length;
          const lowSale = allListings.filter(l =>
            (l.ordersLast7Days || 0) > 0 && (l.ordersLast7Days || 0) < 5
          ).length;

          setStats({
            totalProducts:    products.length,
            totalListings:    allListings.length,
            noSaleProducts:   noSale,
            lowSaleProducts:  lowSale,
            pendingApprovals: 0,
            activeDiscounts:  0,
          });
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;

  if (error) return (
    <Alert
      type="error"
      message={error}
      showIcon
      style={{ borderRadius: 8 }}
    />
  );

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <ShoppingOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
      color: '#e6f4ff',
    },
    {
      title: 'Total Listings',
      value: stats?.totalListings || 0,
      icon: <EyeOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
      color: '#e6fffb',
    },
    {
      title: 'Low-Sale Products',
      value: stats?.lowSaleProducts || 0,
      icon: <ArrowDownOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#fffbe6',
    },
    {
      title: 'No-Sale Products',
      value: stats?.noSaleProducts || 0,
      icon: <AlertOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />,
      color: '#fff2f0',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: <ThunderboltOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
    },
    {
      title: 'Active Discounts',
      value: stats?.activeDiscounts || 0,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
    },
  ];

  const alertColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (p) => (
        <Tag color={
          p === 'AMAZON' || p === 'Amazon' ? 'orange'
          : p === 'FLIPKART' || p === 'Flipkart' ? 'blue'
          : 'green'
        }>
          {p}
        </Tag>
      ),
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
      render: (t) => <Text type="danger">{t}</Text>,
    },
    {
      title: 'Views (7d)',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Health Score',
      dataIndex: 'healthScore',
      key: 'healthScore',
      render: (score) => (
        <Progress
          percent={score}
          size="small"
          status={score < 40 ? 'exception' : score < 60 ? 'normal' : 'success'}
          format={(p) => `${p}/100`}
        />
      ),
    },
  ];

  // Build alert data from real stats if available, else show placeholder
  const alertData = (stats?.alerts || []).length > 0
    ? stats.alerts
    : [
        { key: 1, product: 'Check products page', platform: 'All', issue: 'View real product alerts in Products section', views: 0, healthScore: 50 },
      ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard Overview</Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={12} md={8} lg={4} key={idx}>
            <Card style={{ background: card.color, borderRadius: 12 }}>
              <Space>
                {card.icon}
                <Statistic title={card.title} value={card.value} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Summary cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Products Health Summary" style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Total Products"
                  value={stats?.totalProducts || 0}
                  valueStyle={{ color: '#1677ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Low Sale"
                  value={stats?.lowSaleProducts || 0}
                  valueStyle={{ color: '#faad14' }}
                  suffix={<ArrowDownOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="No Sale"
                  value={stats?.noSaleProducts || 0}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="AI Recommendations" style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Pending"
                  value={stats?.pendingApprovals || 0}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Active Discounts"
                  value={stats?.activeDiscounts || 0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Total Listings"
                  value={stats?.totalListings || 0}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Alerts Table */}
      <Card title="Product Alerts — Needs Attention" style={{ borderRadius: 12 }}>
        <Table
          dataSource={alertData}
          columns={alertColumns}
          pagination={false}
          size="middle"
          locale={{ emptyText: 'No alerts — all products performing well' }}
        />
      </Card>
    </div>
  );
}