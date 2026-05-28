import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Button,
  Progress, Descriptions, Alert, Skeleton, Tag, Empty, Table
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getProductById } from '../api/productApi';
import { getRecommendationsByProduct } from '../api/recommendationApi';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrencyShort, formatDate, getHealthScoreColor } from '../utils/formatters';
import { ROUTES } from '../utils/constants';

const { Title, Text } = Typography;

// ── Health Score Card ────────────────────────────────────────
const HealthScoreCard = ({ score }) => {
  const color = getHealthScoreColor(score);
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Attention' : 'Critical';

  return (
    <Card style={{ borderRadius: 12, textAlign: 'center' }}>
      <Text type="secondary" style={{ fontSize: 13 }}>Product Health Score</Text>
      <div style={{ margin: '16px 0' }}>
        <Progress
          type="circle"
          percent={score}
          strokeColor={color}
          size={100}
          format={() => (
            <span style={{ fontSize: 22, fontWeight: 800, color }}>{score}</span>
          )}
        />
      </div>
      <Tag color={score >= 70 ? 'success' : score >= 40 ? 'warning' : 'error'}
           style={{ borderRadius: 6, fontWeight: 600 }}>
        {label}
      </Tag>
    </Card>
  );
};

// ── Marketplace Price Comparison Table ───────────────────────
const PriceComparisonCard = ({ prices = [], minSafePrice }) => {
  const columns = [
    {
      title: 'Marketplace',
      dataIndex: 'marketplace',
      key: 'marketplace',
      render: (m) => (
        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{m}</span>
      ),
    },
    {
      title: 'Current Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => (
        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>
          {formatCurrencyShort(price)}
        </span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'right',
      render: (stock) => (
        <Tag color={stock > 50 ? 'success' : stock > 10 ? 'warning' : 'error'}>
          {stock} units
        </Tag>
      ),
    },
    {
      title: 'vs Min Safe',
      dataIndex: 'price',
      key: 'margin',
      align: 'right',
      render: (price) => {
        const diff   = price - (minSafePrice || 0);
        const isSafe = diff >= 0;
        return (
          <span style={{ fontWeight: 600, color: isSafe ? '#52c41a' : '#ff4d4f' }}>
            {isSafe ? '+' : ''}{formatCurrencyShort(diff)}
          </span>
        );
      },
    },
  ];

  return (
    <Card title="Marketplace Price Comparison" style={{ borderRadius: 12 }}>
      {minSafePrice && (
        <div style={{
          background: '#fffbe6', border: '1px solid #ffe58f',
          borderRadius: 8, padding: '8px 16px', marginBottom: 16, fontSize: 13,
        }}>
          🛡️ Minimum Safe Price: <strong>{formatCurrencyShort(minSafePrice)}</strong>
          &nbsp;— pricing below this risks profit loss
        </div>
      )}
      <Table
        dataSource={prices}
        columns={columns}
        rowKey="marketplace"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

// ── Recommendations section ───────────────────────────────────
const ProductRecommendations = ({ productId }) => {
  const [recs,    setRecs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRecommendationsByProduct(productId)
      .then(setRecs)
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <Skeleton active />;
  if (!recs.length) return (
    <Card style={{ borderRadius: 12 }}>
      <Empty description="No recommendations for this product yet" />
    </Card>
  );

  return (
    <Card title="AI Recommendations" style={{ borderRadius: 12 }}>
      {recs.map(rec => (
        <div
          key={rec.id}
          onClick={() => navigate(`/recommendations/${rec.id}`)}
          style={{
            padding: '12px 16px', borderRadius: 8,
            border: '1px solid #f0f0f0', marginBottom: 8,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong style={{ fontSize: 13 }}>
                {rec.type?.replace(/_/g, ' ')}
              </Text>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {formatCurrencyShort(rec.currentPrice)} → {formatCurrencyShort(rec.recommendedPrice)}
              </div>
            </div>
            <StatusBadge status={rec.status} />
          </div>
        </div>
      ))}
    </Card>
  );
};

// ── Main ProductDetail page ───────────────────────────────────
const ProductDetail = () => {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div>
      <Skeleton active style={{ marginBottom: 16 }} />
      <Skeleton active />
    </div>
  );

  if (error) return (
    <Alert message="Failed to load product" description={error}
      type="error" showIcon
      action={<Button onClick={() => navigate(ROUTES.PRODUCTS)}>Back to Products</Button>}
    />
  );

  return (
    <div>

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.PRODUCTS)}
        >
          Back
        </Button>
        <div>
          <Title level={4} style={{ margin: 0 }}>{product.name}</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            SKU: {product.sku} · Last updated: {formatDate(product.updatedAt)}
          </Text>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={product.status} />
        </div>
      </div>

      <Row gutter={[16, 16]}>

        {/* ── Left column ──────────────────────────── */}
        <Col xs={24} lg={16}>

          {/* Product info */}
          <Card style={{ borderRadius: 12, marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
              <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
              <Descriptions.Item label="Category">{product.category || '—'}</Descriptions.Item>
              <Descriptions.Item label="Brand">{product.brand || '—'}</Descriptions.Item>
              <Descriptions.Item label="Min Safe Price">
                <strong style={{ color: '#52c41a' }}>
                  {formatCurrencyShort(product.minSafePrice)}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <StatusBadge status={product.status} />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Marketplace price comparison */}
          <PriceComparisonCard
            prices={product.marketplacePrices}
            minSafePrice={product.minSafePrice}
          />
        </Col>

        {/* ── Right column ─────────────────────────── */}
        <Col xs={24} lg={8}>

          {/* Health score */}
          <div style={{ marginBottom: 16 }}>
            <HealthScoreCard score={product.healthScore ?? 0} />
          </div>

          {/* Recommendations */}
          <ProductRecommendations productId={id} />
        </Col>

      </Row>
    </div>
  );
};

export default ProductDetail;