import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Card, Button, Tag, Space, Modal, Form, Input, InputNumber,
  Select, Typography, Row, Col, Progress, Descriptions, Badge,
  Skeleton, Alert, message, Upload
} from 'antd';
import {
  PlusOutlined, EyeOutlined, ThunderboltOutlined,
  ReloadOutlined, SearchOutlined, UploadOutlined, InboxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const platformColor = {
  AMAZON: 'orange', FLIPKART: 'blue', SHOPIFY: 'green',
  MEESHO: 'pink', MYNTRA: 'purple', WOOCOMMERCE: 'cyan', OTHER: 'default',
};

// ── CSV Upload Modal ───────────────────────────────────────────
const UploadCsvModal = ({ visible, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);

  return (
    <Modal
      title="Import Products from CSV"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Upload.Dragger
        accept=".csv"
        showUploadList={false}
        disabled={uploading}
        customRequest={async ({ file }) => {
          try {
            setUploading(true);
            const form = new FormData();
            form.append('file', file);
            await axiosClient.post('/products/import-csv', form, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success('Products imported successfully!');
            onSuccess();
            onClose();
          } catch (err) {
            message.error(err.response?.data?.message || 'CSV upload failed');
          } finally {
            setUploading(false);
          }
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        </p>
        <p style={{ fontSize: 16 }}>Click or drag CSV file here to upload</p>
        <p style={{ color: '#888', fontSize: 12 }}>Supports .csv files only</p>
        {uploading && <p style={{ color: '#1677ff' }}>Uploading...</p>}
      </Upload.Dragger>

      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
        <Text strong>CSV Format:</Text><br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          name, brand, category, costPrice, marketplaceCommission, shippingCost
        </Text>
      </div>
    </Modal>
  );
};

// ── Main Products Page ─────────────────────────────────────────
export default function Products() {
  const navigate = useNavigate();

  const [products,         setProducts]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [detailVisible,    setDetailVisible]    = useState(false);
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [addVisible,       setAddVisible]       = useState(false);
  const [addLoading,       setAddLoading]       = useState(false);
  const [csvVisible,       setCsvVisible]       = useState(false);
  const [search,           setSearch]           = useState('');
  const [marketplace,      setMarketplace]      = useState(null);

  const [form] = Form.useForm();

  // ── Fetch products ─────────────────────────────────────────
  const fetchProducts = useCallback(async (searchVal, marketplaceVal) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchVal)      params.search      = searchVal;
      if (marketplaceVal) params.marketplace = marketplaceVal;

      const response = await axiosClient.get('/products', { params });
      const data = response.data;
      const productList = Array.isArray(data)
        ? data
        : data.content ?? data.products ?? [];

      const mapped = productList.map(p => ({
        id:          p.id,
        name:        p.name,
        brand:       p.brand        || '—',
        category:    p.category     || '—',
        costPrice:   p.costPrice    || 0,
        healthScore: p.healthScore  || 0,
        listings: (p.listings || []).map(l => ({
          platform:        l.platform,
          title:           l.title           || p.name,
          currentPrice:    l.currentPrice    || 0,
          stockQuantity:   l.stockQuantity   || 0,
          viewsLast7Days:  l.viewsLast7Days  || 0,
          ordersLast7Days: l.ordersLast7Days || 0,
          rating:          l.rating          || 0,
          platformSku:     l.platformSku     || '—',
        })),
      }));

      setProducts(mapped);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(search, marketplace);
  }, [search, marketplace, fetchProducts]);

  // ── Add product ────────────────────────────────────────────
  const handleAddProduct = async (values) => {
    try {
      setAddLoading(true);
      await axiosClient.post('/products', values);
      message.success('Product added successfully');
      setAddVisible(false);
      form.resetFields();
      fetchProducts(search, marketplace);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Table columns ──────────────────────────────────────────
  const columns = [
    {
      title: 'Product', dataIndex: 'name', key: 'name', width: 200,
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'Brand', dataIndex: 'brand', key: 'brand', width: 120,
    },
    {
      title: 'Category', dataIndex: 'category', key: 'category', width: 150,
      render: (t) => <Tag>{t}</Tag>,
    },
    {
      title: 'Cost Price', dataIndex: 'costPrice', key: 'costPrice', width: 120,
      render: (v) => <Text>₹{Number(v).toLocaleString('en-IN')}</Text>,
    },
    {
      title: 'Platforms', key: 'platforms',
      render: (_, record) => (
        <Space wrap>
          {record.listings.length > 0
            ? record.listings.map((l, i) => (
                <Tag key={i} color={platformColor[l.platform] || 'default'}>
                  {l.platform}
                </Tag>
              ))
            : <Text type="secondary" style={{ fontSize: 12 }}>No listings</Text>
          }
        </Space>
      ),
    },
    {
      title: 'Health Score', dataIndex: 'healthScore', key: 'healthScore', width: 120,
      sorter: (a, b) => a.healthScore - b.healthScore,
      render: (score) => (
        <Progress
          type="circle" percent={score} size={45}
          status={score < 40 ? 'exception' : score < 60 ? 'normal' : 'success'}
          format={(p) => p}
        />
      ),
    },
    {
      title: 'Actions', key: 'actions', width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(record);
              setDetailVisible(true);
            }}
          >
            View
          </Button>
          <Button
            type="primary" icon={<ThunderboltOutlined />} ghost
            onClick={(e) => e.stopPropagation()}
          >
            AI Advice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Product Catalog</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchProducts(search, marketplace)}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setCsvVisible(true)}
          >
            Import CSV
          </Button>
          <Button
            type="primary" icon={<PlusOutlined />}
            onClick={() => setAddVisible(true)}
          >
            Add Product
          </Button>
        </Space>
      </Row>

      {/* Search + Filter */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Input.Search
            placeholder="Search products..."
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
            onSearch={(val) => setSearch(val)}
            onChange={(e) => { if (e.target.value === '') setSearch(''); }}
          />
          <Select
            placeholder="All marketplaces"
            allowClear
            style={{ width: 180 }}
            onChange={(val) => setMarketplace(val ?? null)}
          >
            <Select.Option value="AMAZON">Amazon</Select.Option>
            <Select.Option value="FLIPKART">Flipkart</Select.Option>
            <Select.Option value="SHOPIFY">Shopify</Select.Option>
            <Select.Option value="MEESHO">Meesho</Select.Option>
            <Select.Option value="MYNTRA">Myntra</Select.Option>
            <Select.Option value="WOOCOMMERCE">WooCommerce</Select.Option>
          </Select>
          {(search || marketplace) && (
            <Button onClick={() => { setSearch(''); setMarketplace(null); }}>
              Clear filters
            </Button>
          )}
        </Space>
      </Card>

      {/* Error */}
      {error && (
        <Alert
          message={error} type="error" showIcon closable
          style={{ marginBottom: 16, borderRadius: 8 }}
          onClose={() => setError(null)}
        />
      )}

      {/* Table */}
      <Card style={{ borderRadius: 12 }}>
        {loading
          ? <Skeleton active paragraph={{ rows: 6 }} />
          : (
            <Table
              dataSource={products}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10, showTotal: (total) => `${total} products` }}
              locale={{ emptyText: 'No products found' }}
              onRow={(record) => ({
                onClick: () => navigate(`/products/${record.id}`),
                style: { cursor: 'pointer' },
              })}
            />
          )
        }
      </Card>

      {/* CSV Modal */}
      <UploadCsvModal
        visible={csvVisible}
        onClose={() => setCsvVisible(false)}
        onSuccess={() => fetchProducts(search, marketplace)}
      />

      {/* Product Detail Modal */}
      <Modal
        title={selectedProduct?.name}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={null}
      >
        {selectedProduct && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Brand">{selectedProduct.brand}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedProduct.category}</Descriptions.Item>
              <Descriptions.Item label="Cost Price">
                ₹{Number(selectedProduct.costPrice).toLocaleString('en-IN')}
              </Descriptions.Item>
              <Descriptions.Item label="Health Score">
                <Badge
                  status={
                    selectedProduct.healthScore < 40 ? 'error'
                    : selectedProduct.healthScore < 60 ? 'warning'
                    : 'success'
                  }
                />
                {selectedProduct.healthScore}/100
              </Descriptions.Item>
            </Descriptions>

            <Title level={5}>Marketplace Listings</Title>
            {selectedProduct.listings.length === 0
              ? <Text type="secondary">No listings for this product</Text>
              : (
                <Table
                  dataSource={selectedProduct.listings}
                  rowKey="platform"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Platform', dataIndex: 'platform',
                      render: (p) => <Tag color={platformColor[p] || 'default'}>{p}</Tag>,
                    },
                    {
                      title: 'Price', dataIndex: 'currentPrice',
                      render: (v) => <Text strong>₹{Number(v).toLocaleString('en-IN')}</Text>,
                    },
                    { title: 'Stock', dataIndex: 'stockQuantity' },
                    { title: 'Views (7d)', dataIndex: 'viewsLast7Days' },
                    {
                      title: 'Orders (7d)', dataIndex: 'ordersLast7Days',
                      render: (v) => <Text type={v === 0 ? 'danger' : undefined}>{v}</Text>,
                    },
                    {
                      title: 'Rating', dataIndex: 'rating',
                      render: (v) => v ? `⭐ ${v}` : '—',
                    },
                  ]}
                />
              )
            }
          </div>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        open={addVisible}
        onCancel={() => { setAddVisible(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item
            label="Product Name" name="name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., boAt Rockerz 255 Pro" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Brand" name="brand">
                <Input placeholder="Brand name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category" name="category">
                <Select placeholder="Select category">
                  <Select.Option value="Audio">Audio</Select.Option>
                  <Select.Option value="Mobile Accessories">Mobile Accessories</Select.Option>
                  <Select.Option value="Accessories">Accessories</Select.Option>
                  <Select.Option value="Electronics">Electronics</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Cost Price (₹)" name="costPrice" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Commission (₹)" name="marketplaceCommission">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Shipping (₹)" name="shippingCost">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Min Margin %" name="minimumMarginPercent">
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={addLoading}>
            Add Product
          </Button>
        </Form>
      </Modal>
    </div>
  );
}