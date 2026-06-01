import React, { useState, useEffect } from 'react';
import {
  Card, Button, Tag, Space, Typography, Row, Col, Modal,
  Statistic, Paragraph, Input, message, Badge
} from 'antd';
import {
  ThunderboltOutlined, CheckOutlined, CloseOutlined,
  ArrowDownOutlined, ArrowUpOutlined, SafetyOutlined,
  RobotOutlined, ExperimentOutlined
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Fallback demo data — used if API not ready
const demoRecommendations = [
  {
    id: 1,
    productName: 'Wireless Keyboard Pro',
    platform: 'AMAZON',
    recommendationType: 'PRICE_MATCH',
    currentPrice: 1499,
    recommendedPrice: 1299,
    minimumSafePrice: 1100,
    lowestMarketPrice: 1299,
    discountPercent: 13.3,
    reason: 'Product is priced ₹200 higher than the lowest marketplace price.',
    aiExplanation: 'Your Wireless Keyboard Pro on Amazon has 900 views but only 2 orders in 7 days. The same product sells for ₹1299 on Flipkart with 12 orders. Reducing to ₹1299 gives ₹199 above your safe price of ₹1100.',
    riskLevel: 'LOW',
    expectedImpact: 'Medium to High',
    durationDays: 5,
    status: 'PENDING',
    viewsLast7Days: 900,
    ordersLast7Days: 2,
    stockQuantity: 120,
  },
  {
    id: 2,
    productName: 'USB-C Hub 7-in-1',
    platform: 'AMAZON',
    recommendationType: 'STOCK_CLEARANCE',
    currentPrice: 2499,
    recommendedPrice: 2124,
    minimumSafePrice: 1680,
    lowestMarketPrice: 2199,
    discountPercent: 15.0,
    reason: 'High inventory with low sales velocity. Clearance discount will free up capital.',
    aiExplanation: 'Your USB-C Hub has 80 units in stock but zero orders this week despite 450 views. A 15% markdown to ₹2124 stays well above your floor of ₹1680, preserving ₹444 margin per unit.',
    riskLevel: 'LOW',
    expectedImpact: 'High',
    durationDays: 5,
    status: 'PENDING',
    viewsLast7Days: 450,
    ordersLast7Days: 0,
    stockQuantity: 80,
  },
  {
    id: 3,
    productName: 'Samsung 25W Charger',
    platform: 'AMAZON',
    recommendationType: 'PRICE_INCREASE',
    currentPrice: 899,
    recommendedPrice: 944,
    minimumSafePrice: 700,
    lowestMarketPrice: 799,
    discountPercent: -5.0,
    reason: 'Sales are strong at current price. Market demand supports a price increase.',
    aiExplanation: 'Your Samsung 25W Charger achieves 65 orders from 2100 views (3.1% conversion). A 5% increase to ₹944 adds ₹2,925 weekly profit at current volume.',
    riskLevel: 'LOW',
    expectedImpact: 'Increased profit per unit',
    durationDays: null,
    status: 'PENDING',
    viewsLast7Days: 2100,
    ordersLast7Days: 65,
    stockQuantity: 200,
  },
];

const typeConfig = {
  PRICE_MATCH:        { color: 'blue',   label: 'Price Match',        icon: '🎯' },
  TEMPORARY_DISCOUNT: { color: 'orange', label: 'Temporary Discount',  icon: '⏰' },
  STOCK_CLEARANCE:    { color: 'red',    label: 'Stock Clearance',     icon: '📦' },
  MARGIN_PROTECTION:  { color: 'purple', label: 'Margin Protection',   icon: '🛡️' },
  BUNDLE_OFFER:       { color: 'cyan',   label: 'Bundle Offer',        icon: '🎁' },
  PRICE_INCREASE:     { color: 'green',  label: 'Price Increase',      icon: '📈' },
};

const riskConfig = {
  LOW:    { color: 'success', text: 'Low Risk'    },
  MEDIUM: { color: 'warning', text: 'Medium Risk' },
  HIGH:   { color: 'error',   text: 'High Risk'   },
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [approveModal,    setApproveModal]    = useState(null);
  const [rejectModal,     setRejectModal]     = useState(null);
  const [comments,        setComments]        = useState('');

  // ── Fetch recommendations ────────────────────────────────
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/recommendations');
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.content ?? [];

        // Map API fields to component fields
        const mapped = data.map(r => ({
          id:                 r.id,
          productName:        r.masterProduct?.name    || r.productName    || 'Unknown Product',
          platform:           r.marketplaceProduct?.platform || r.platform || 'AMAZON',
          recommendationType: r.recommendationType     || r.type           || 'PRICE_MATCH',
          currentPrice:       r.currentPrice           || 0,
          recommendedPrice:   r.recommendedPrice       || 0,
          minimumSafePrice:   r.minimumSafePrice       || 0,
          lowestMarketPrice:  r.lowestMarketPrice      || 0,
          discountPercent:    r.discountPercent        || 0,
          reason:             r.reason                 || '',
          aiExplanation:      r.aiExplanation          || r.ai_explanation || '',
          riskLevel:          r.riskLevel              || 'LOW',
          expectedImpact:     r.expectedImpact         || '',
          durationDays:       r.durationDays           || null,
          status:             r.status                 || 'PENDING',
          viewsLast7Days:     r.marketplaceProduct?.viewsLast7Days  || 0,
          ordersLast7Days:    r.marketplaceProduct?.ordersLast7Days || 0,
          stockQuantity:      r.marketplaceProduct?.stockQuantity   || 0,
        }));

        setRecommendations(mapped.length > 0 ? mapped : demoRecommendations);
      } catch {
        // API not ready — use demo data
        setRecommendations(demoRecommendations);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  // ── Optimistic approve ───────────────────────────────────
  const handleApprove = async (id) => {
    setRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r)
    );
    try {
      await axiosClient.patch(`/recommendations/${id}/approve`, { comments });
      message.success('Recommendation approved! Price will be updated.');
    } catch {
      setRecommendations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'PENDING' } : r)
      );
      message.error('Approval failed. Please try again.');
    }
    setApproveModal(null);
    setComments('');
  };

  // ── Optimistic reject ────────────────────────────────────
  const handleReject = async (id) => {
    setRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r)
    );
    try {
      await axiosClient.patch(`/recommendations/${id}/reject`, { comments });
      message.info('Recommendation rejected.');
    } catch {
      setRecommendations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'PENDING' } : r)
      );
      message.error('Action failed. Please try again.');
    }
    setRejectModal(null);
    setComments('');
  };

  const pendingCount = recommendations.filter(r => r.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Space>
          <Title level={3} style={{ margin: 0 }}>AI Recommendations</Title>
          <Badge count={pendingCount} style={{ backgroundColor: '#1677ff' }} />
        </Space>
        <Button type="primary" icon={<ExperimentOutlined />}>
          Generate New Recommendations
        </Button>
      </Row>

      {/* Summary stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Pending"
              value={pendingCount}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Approved"
              value={recommendations.filter(r => r.status === 'APPROVED').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Rejected"
              value={recommendations.filter(r => r.status === 'REJECTED').length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total"
              value={recommendations.length}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recommendation Cards */}
      {recommendations.map(rec => (
        <Card
          key={rec.id}
          style={{
            marginBottom: 16,
            borderRadius: 12,
            opacity: rec.status !== 'PENDING' ? 0.75 : 1,
            border: rec.riskLevel === 'HIGH' ? '1px solid #ffccc7'
              : rec.riskLevel === 'MEDIUM' ? '1px solid #ffe58f'
              : '1px solid #f0f0f0',
          }}
        >
          <Row gutter={24}>

            {/* Left — Product info */}
            <Col xs={24} md={16}>
              <Space style={{ marginBottom: 8 }} wrap>
                <Text style={{ fontSize: 20 }}>
                  {typeConfig[rec.recommendationType]?.icon}
                </Text>
                <Title level={5} style={{ margin: 0 }}>{rec.productName}</Title>
                <Tag color={rec.platform === 'AMAZON' ? 'orange' : 'blue'}>
                  {rec.platform}
                </Tag>
                <Tag color={typeConfig[rec.recommendationType]?.color}>
                  {typeConfig[rec.recommendationType]?.label}
                </Tag>
                <Tag color={riskConfig[rec.riskLevel]?.color}>
                  {riskConfig[rec.riskLevel]?.text}
                </Tag>
                {rec.status !== 'PENDING' && (
                  <Tag color={rec.status === 'APPROVED' ? 'success' : 'default'}>
                    {rec.status}
                  </Tag>
                )}
              </Space>

              {/* Price comparison */}
              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col>
                  <Statistic
                    title="Current Price"
                    value={rec.currentPrice}
                    prefix="₹"
                    valueStyle={{ fontSize: 18 }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title="Recommended"
                    value={rec.recommendedPrice}
                    prefix="₹"
                    valueStyle={{
                      fontSize: 18,
                      color: rec.recommendedPrice < rec.currentPrice ? '#52c41a' : '#ff4d4f',
                    }}
                    suffix={
                      rec.discountPercent > 0 ? <ArrowDownOutlined />
                      : rec.discountPercent < 0 ? <ArrowUpOutlined />
                      : null
                    }
                  />
                </Col>
                <Col>
                  <Statistic
                    title="Safe Price"
                    value={rec.minimumSafePrice}
                    prefix="₹"
                    valueStyle={{ fontSize: 18, color: '#722ed1' }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title="Lowest Market"
                    value={rec.lowestMarketPrice}
                    prefix="₹"
                    valueStyle={{ fontSize: 18 }}
                  />
                </Col>
              </Row>

              {/* Rule-based reason */}
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                <SafetyOutlined /> {rec.reason}
              </Text>

              {/* AI explanation */}
              {rec.aiExplanation && (
                <Card
                  size="small"
                  style={{ background: '#f6f8ff', marginTop: 8 }}
                >
                  <Space align="start">
                    <RobotOutlined style={{ color: '#1677ff', fontSize: 16, marginTop: 4 }} />
                    <div>
                      <Text strong style={{ color: '#1677ff' }}>AI Analysis (Gemini)</Text>
                      <Paragraph style={{ margin: '4px 0 0', fontSize: 13 }}>
                        {rec.aiExplanation}
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              )}
            </Col>

            {/* Right — Metrics and actions */}
            <Col xs={24} md={8}>
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Statistic
                      title="Views"
                      value={rec.viewsLast7Days}
                      valueStyle={{ fontSize: 14 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Orders"
                      value={rec.ordersLast7Days}
                      valueStyle={{
                        fontSize: 14,
                        color: rec.ordersLast7Days === 0 ? '#ff4d4f' : undefined,
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Stock"
                      value={rec.stockQuantity}
                      valueStyle={{ fontSize: 14 }}
                    />
                  </Col>
                </Row>
              </Card>

              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                Expected Impact: <Text strong>{rec.expectedImpact}</Text>
              </Text>
              {rec.durationDays && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  Duration: <Text strong>{rec.durationDays} days</Text>
                </Text>
              )}

              {rec.status === 'PENDING' && (
                <Space style={{ marginTop: 8 }}>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => setApproveModal(rec)}
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => setRejectModal(rec)}
                  >
                    Reject
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </Card>
      ))}

      {/* Approve Modal */}
      <Modal
        title="Approve Recommendation"
        open={!!approveModal}
        onOk={() => handleApprove(approveModal?.id)}
        onCancel={() => { setApproveModal(null); setComments(''); }}
        okText="Confirm Approval"
        okButtonProps={{ style: { background: '#52c41a', borderColor: '#52c41a' } }}
      >
        <Paragraph>
          Approve price change for <Text strong>{approveModal?.productName}</Text> from{' '}
          <Text strong>₹{approveModal?.currentPrice}</Text> to{' '}
          <Text strong style={{ color: '#52c41a' }}>₹{approveModal?.recommendedPrice}</Text>?
        </Paragraph>
        <TextArea
          placeholder="Optional comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          style={{ marginTop: 8 }}
        />
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Recommendation"
        open={!!rejectModal}
        onOk={() => handleReject(rejectModal?.id)}
        onCancel={() => { setRejectModal(null); setComments(''); }}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
      >
        <Paragraph>
          Reject the AI recommendation for{' '}
          <Text strong>{rejectModal?.productName}</Text>?
        </Paragraph>
        <TextArea
          placeholder="Reason for rejection..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
}