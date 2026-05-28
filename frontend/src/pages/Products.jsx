import { useState, useEffect, useCallback } from 'react';
import {
  Row, Col, Input, Select, Button, Typography,
  Space, Alert, Card
} from 'antd';
import { SearchOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import ProductTable from '../components/product/ProductTable';
import UploadCsvBox from '../components/product/UploadCsvBox';
import { getProducts } from '../api/productApi';
import { MARKETPLACES } from '../utils/constants';

const { Title, Text } = Typography;

const Products = () => {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showUpload,  setShowUpload]  = useState(false);

  // ── Filter + pagination state ─────────────────────────
  const [search,      setSearch]      = useState('');
  const [marketplace, setMarketplace] = useState('');
  const [pagination,  setPagination]  = useState({ page: 0, size: 10, total: 0 });

  // ── Fetch products ────────────────────────────────────
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({
        search:      params.search      ?? search,
        marketplace: params.marketplace ?? marketplace,
        page:        params.page        ?? pagination.page,
        size:        params.size        ?? pagination.size,
      });

      // Handle Spring Page response format
      setProducts(data.content ?? data);
      setPagination(prev => ({
        ...prev,
        total: data.totalElements ?? data.length ?? 0,
        page:  data.number        ?? prev.page,
        size:  data.size          ?? prev.size,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, marketplace, pagination.page, pagination.size]);

  useEffect(() => { fetchProducts(); }, []); // Initial load only

  // ── Debounced search (waits 300ms after user stops typing) ──
  const handleSearchChange = debounce((value) => {
    setSearch(value);
    fetchProducts({ search: value, page: 0 }); // Reset to page 1 on new search
  }, 300);

  // ── Marketplace filter ────────────────────────────────
  const handleMarketplaceChange = (value) => {
    setMarketplace(value);
    fetchProducts({ marketplace: value, page: 0 });
  };

  // ── Pagination change from table ──────────────────────
  const handleTableChange = ({ page, size }) => {
    setPagination(prev => ({ ...prev, page, size }));
    fetchProducts({ page, size });
  };

  // ── After CSV upload, refresh the table ──────────────
  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchProducts({ page: 0 });
  };

  return (
    <div>

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Products</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Manage products across all your connected marketplaces
        </Text>
      </div>

      {error && (
        <Alert
          message={error} type="error" showIcon closable
          style={{ marginBottom: 16, borderRadius: 8 }}
          onClose={() => setError(null)}
        />
      )}

      {/* ── CSV Upload box (toggles) ──────────────────── */}
      {showUpload && (
        <div style={{ marginBottom: 16 }}>
          <UploadCsvBox
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      {/* ── Filters bar ──────────────────────────────── */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: '16px 20px' } }}>
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
              style={{ width: 180, borderRadius: 8 }}
              onChange={handleMarketplaceChange}
              options={[
                { label: 'All Marketplaces', value: '' },
                ...MARKETPLACES.map(m => ({ label: m.label, value: m.value })),
              ]}
            />
          </Col>

          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchProducts()}
                title="Refresh"
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

      {/* ── Products table ────────────────────────────── */}
      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
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