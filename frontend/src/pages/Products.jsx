import { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Alert,
  Card,
} from 'antd';

import {
  SearchOutlined,
  UploadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { debounce } from 'lodash';

import ProductTable from '../components/product/ProductTable';
import UploadCsvBox from '../components/product/UploadCsvBox';
import { MARKETPLACES } from '../utils/constants';

const { Title, Text } = Typography;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const [search, setSearch] = useState('');
  const [marketplace, setMarketplace] = useState('');

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    total: 0,
  });

  // ─────────────────────────────────────────
  // TEMP MOCK DATA FETCH
  // ─────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = {
        content: [
          {
            id: 1,
            name: 'Bluetooth Speaker X',
            sku: 'SKU001',
            marketplace: 'amazon',
            price: 1500,
            healthScore: 72,
            status: 'ACTIVE',
          },
          {
            id: 2,
            name: 'Wireless Keyboard Pro',
            sku: 'SKU002',
            marketplace: 'flipkart',
            price: 1299,
            healthScore: 45,
            status: 'ACTIVE',
          },
          {
            id: 3,
            name: 'USB C Hub 7-in-1',
            sku: 'SKU003',
            marketplace: 'meesho',
            price: 899,
            healthScore: 28,
            status: 'INACTIVE',
          },
        ],
        totalElements: 3,
        number: 0,
        size: 10,
      };

      let filteredProducts = data.content;

      // Search filter
      if (search) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Marketplace filter
      if (marketplace) {
        filteredProducts = filteredProducts.filter(
          (product) => product.marketplace === marketplace
        );
      }

      setProducts(filteredProducts);

      setPagination((prev) => ({
        ...prev,
        total: filteredProducts.length,
      }));
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, marketplace]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  const handleSearchChange = debounce((value) => {
    setSearch(value);
  }, 300);

  // Marketplace filter
  const handleMarketplaceChange = (value) => {
    setMarketplace(value || '');
  };

  // Pagination change
  const handleTableChange = ({ page, size }) => {
    setPagination((prev) => ({
      ...prev,
      page,
      size,
    }));
  };

  // CSV upload success
  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchProducts();
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>
          Products
        </Title>

        <Text type="secondary" style={{ fontSize: 13 }}>
          Manage products across all your connected marketplaces
        </Text>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16, borderRadius: 8 }}
          onClose={() => setError(null)}
        />
      )}

      {/* Upload Box */}
      {showUpload && (
        <div style={{ marginBottom: 16 }}>
          <UploadCsvBox
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      {/* Filters */}
      <Card
        style={{ borderRadius: 12, marginBottom: 16 }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Row gutter={12} align="middle">
          <Col flex="1">
            <Input
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              placeholder="Search by product name or SKU..."
              onChange={(e) => handleSearchChange(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>

          <Col>
            <Select
              placeholder="All Marketplaces"
              allowClear
              style={{ width: 180 }}
              onChange={handleMarketplaceChange}
              options={[
                { label: 'All Marketplaces', value: '' },
                ...MARKETPLACES.map((m) => ({
                  label: m.label,
                  value: m.value,
                })),
              ]}
            />
          </Col>

          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchProducts}
              />

              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setShowUpload(!showUpload)}
              >
                Import CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Product Table */}
      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
      >
        <ProductTable
          data={products}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Products;