import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Typography, Tag, Progress, Table,
  Skeleton, Alert, Button, Descriptions, Statistic, Space, Badge
} from 'antd';
import {
  ArrowLeftOutlined, ShoppingOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const platformColor = {
  AMAZON: 'orange', FLIPKART: 'blue', SHOPIFY: 'green',
  MEESHO: 'pink', MYNTRA: 'purple', WOOCOMMERCE: 'cyan', OTHER: 'default'
};

const StatusBadge = ({ status }) => {
  const config = {
    PENDING:  { color: 'orange',  label: 'Pending'  },
    APPROVED: { color: 'green',   label: 'Approved' },
    REJECTED: { color: 'red',     label: 'Rejected' },
    APPLIED:  { color: 'blue',    label: 'Applied'  },
    EXPIRED:  { color: 'default', label: 'Expired'  },
  };
  const c = config[status] || { color: 'default', label: status };
  return <Tag color={c.color}>{c.label}</Tag>;
};

const HealthCircle = ({ score }) => {
  const s = score || 0;
  const color = s > 70 ? '#52c41a' : s > 40 ? '#faad14' : '#ff4d4f';
  const status = s > 70 ? 'success' : s > 40 ? 'normal' : 'exception';
  return (
    <div style={{ textAlign: 'center' }}>
      <Progress
        type="circle"
        percent={s}
        size={120}
        status={status}
        strokeColor={color}
        format={(p) => (
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{p}</div>
            <div style={{ fontSize: 11, color: '#888' }}>/ 100</div>
          </div>
        )}
      />
      <div style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {s > 70 ? '✅ Healthy' : s > 40 ? '⚠️ Needs attention' : '🔴 Critical'}
        </Text>
      </div>
    </div>
  );
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <Card style={{ borderRadius: 12 }}>
      <Skeleton active paragraph={{ rows: 8 }} />
    </Card>
  );

  if (error) return (
    <Alert
      type="error"
      message={error}
      showIcon
      action={
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      }
    />
  );

  if (!product) return null;

  const listings = product.listings || [];

  const listingColumns = [
    {
      title: 'Platform',
      dataIndex: 'platform',
      render: (p) => <Tag color={platformColor[p] || 'default'}>{p}</Tag>
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      render: (v) => <Text strong>₹{Number(v || 0).toLocaleString('en-IN')}</Text>
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      render: (v) => (
        <Text type={v === 0 ? 'danger' : v < 10 ? 'warning' : undefined}>
          {v ?? '—'}
        </Text>
      )
    },
    { title: 'Views (7d)', dataIndex: 'viewsLast7Days', render: (v) => v ?? '—' },
    {
      title: 'Orders (7d)',
      dataIndex: 'ordersLast7Days',
      render: (v) => <Text type={v === 0 ? 'danger' : undefined}>{v ?? '—'}</Text>
    },
    { title: 'Rating', dataIndex: 'rating', render: (v) => v ? `⭐ ${v}` : '—' },
    { title: 'SKU', dataIndex: 'platformSku', render: (v) => <Text type="secondary">{v || '—'}</Text> },
  ];

  return (
    <div>
      <Row align="middle" style={{ marginBottom: 16 }} gutter={16}>
        <Col>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
            Back
          </Button>
        </Col>
        <Col flex="auto">
          <Title level={3} style={{ margin: 0 }}>{product.name}</Title>
          <Text type="secondary">{product.brand} · {product.category}</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Product Overview" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <HealthCircle score={product.healthScore} />
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Brand">{product.brand || '—'}</Descriptions.Item>
              <Descriptions.Item label="Category">{product.category || '—'}</Descriptions.Item>
              <Descriptions.Item label="Model">{product.modelNumber || '—'}</Descriptions.Item>
              <Descriptions.Item label="Barcode">{product.barcode || '—'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Pricing Breakdown" style={{ borderRadius: 12, marginTop: 16 }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Cost Price">₹{Number(product.costPrice || 0).toLocaleString('en-IN')}</Descriptions.Item>
              <Descriptions.Item label="Commission">₹{Number(product.marketplaceCommission || 0).toLocaleString('en-IN')}</Descriptions.Item>
              <Descriptions.Item label="Shipping">₹{Number(product.shippingCost || 0).toLocaleString('en-IN')}</Descriptions.Item>
              <Descriptions.Item label="Packaging">₹{Number(product.packagingCost || 0).toLocaleString('en-IN')}</Descriptions.Item>
              <Descriptions.Item label="Tax %">{product.taxPercent || 0}%</Descriptions.Item>
              <Descriptions.Item label="Min Margin %">{product.minimumMarginPercent || 0}%</Descriptions.Item>
              <Descriptions.Item label="Min Safe Price">
                <Text strong style={{ color: '#52c41a' }}>₹{Number(product.minimumSafePrice || 0).toLocaleString('en-IN')}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Total Listings" value={listings.length} prefix={<ShoppingOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Orders (7d)" value={listings.reduce((s, l) => s + (l.ordersLast7Days || 0), 0)} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Views (7d)" value={listings.reduce((s, l) => s + (l.viewsLast7Days || 0), 0)} />
              </Col>
            </Row>
          </Card>

          <Card title="Marketplace Price Comparison" style={{ borderRadius: 12, marginBottom: 16 }}>
            {listings.length === 0 ? (
              <Text type="secondary">No marketplace listings found</Text>
            ) : (
              <Table
                dataSource={listings}
                columns={listingColumns}
                rowKey={(r) => r.id || r.platform}
                pagination={false}
                size="small"
                scroll={{ x: true }}
              />
            )}
          </Card>

          <Card
            title={<Space><ThunderboltOutlined style={{ color: '#1677ff' }} />AI Recommendations</Space>}
            style={{ borderRadius: 12 }}
          >
            {!product.recommendations || product.recommendations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Text type="secondary">No recommendations yet for this product.</Text>
                <br />
                <Button type="primary" ghost icon={<ThunderboltOutlined />} style={{ marginTop: 12 }}>
                  Generate AI Advice
                </Button>
              </div>
            ) : (
              <Table
                dataSource={product.recommendations}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Status', dataIndex: 'status', render: (s) => <StatusBadge status={s} /> },
                  { title: 'Type', dataIndex: 'recommendationType', render: (t) => <Tag>{t?.replace(/_/g, ' ')}</Tag> },
                  { title: 'Recommended Price', dataIndex: 'recommendedPrice', render: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—' },
                  { title: 'Risk', dataIndex: 'riskLevel', render: (r) => { const color = r === 'HIGH' ? 'red' : r === 'MEDIUM' ? 'orange' : 'green'; return r ? <Tag color={color}>{r}</Tag> : '—'; } },
                  { title: 'Explanation', dataIndex: 'aiExplanation', ellipsis: true, render: (t) => <Text type="secondary">{t || '—'}</Text> },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}