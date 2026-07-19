import React, { useState } from 'react';
import { Form, Input, Button, Typography, Tabs, message, notification, Checkbox, Space } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  RobotOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleFilled,
  ThunderboltOutlined,
  ArrowLeftOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  AppstoreOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PricePilotLogo from '../components/common/Logo';
import '../styles/auth.css';

const { Title, Text, Paragraph } = Typography;

const authFeatures = [
  { icon: <RobotOutlined />, title: 'Explainable AI', copy: 'Clear recommendations with risk, impact, and pricing context.' },
  { icon: <SafetyCertificateOutlined />, title: 'Margin protection', copy: 'Built-in safeguards keep every decision above safe price.' },
  { icon: <ShoppingCartOutlined />, title: 'Marketplace control', copy: 'One workspace for products, listings, teams, and reports.' },
];

export default function Login() {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const [regForm] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      setLoginLoading(true);

      const demoUser = {
        email: values.email,
        name: values.email.split('@')[0],
        role: 'TENANT_ADMIN',
        companyName: 'Demo Company',
      };

      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));

      notification.success({
        message: 'Welcome back',
        description: `Logged in as ${demoUser.name || values.email}`,
        placement: 'topRight',
      });

      navigate('/dashboard');
    } catch (err) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (values) => {
    try {
      setRegLoading(true);

      const demoUser = {
        email: values.email,
        name: values.name,
        role: 'TENANT_ADMIN',
        companyName: values.companyName,
      };

      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));

      notification.success({
        message: 'Registration successful',
        description: 'Demo account created. Redirecting to dashboard.',
        placement: 'topRight',
      });

      navigate('/dashboard');
    } catch (err) {
      message.error('Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Sign in',
      children: (
        <Form
          form={loginForm}
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
          initialValues={{ email: 'demo@pricepilot.com', password: 'password123', remember: true }}
          className="auth-form"
        >
          <Form.Item
            label="Work email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="name@company.com" className="auth-input" size="large" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" className="auth-input" size="large" />
          </Form.Item>

          <div className="auth-form-options">
            <Form.Item name="remember" valuePropName="checked" noStyle><Checkbox>Remember me</Checkbox></Form.Item>
            <button type="button" className="auth-link-button">Forgot password?</button>
          </div>

          <Button type="primary" htmlType="submit" block loading={loginLoading} className="auth-primary-btn" size="large">
            {loginLoading ? 'Preparing workspace...' : 'Sign in to PricePilot'}
            {!loginLoading && <ArrowRightOutlined />}
          </Button>

          <div className="auth-demo-note">
            <CheckCircleFilled /> Demo access is pre-filled for quick evaluation.
          </div>
        </Form>
      ),
    },
    {
      key: 'register',
      label: 'Create account',
      children: (
        <Form form={regForm} layout="vertical" onFinish={handleRegister} autoComplete="off" className="auth-form">
          <div className="auth-form-grid">
            <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter full name" className="auth-input" size="large" />
            </Form.Item>
            <Form.Item name="companyName" label="Company" rules={[{ required: true, message: 'Please enter company name' }]}>
              <Input prefix={<BankOutlined />} placeholder="Company name" className="auth-input" size="large" />
            </Form.Item>
          </div>

          <Form.Item name="email" label="Work email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}>
            <Input prefix={<MailOutlined />} placeholder="name@company.com" className="auth-input" size="large" />
          </Form.Item>

          <Form.Item name="password" label="Create password" rules={[{ required: true, message: 'Please enter a password' }, { min: 6, message: 'Use at least 6 characters' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Create a secure password" className="auth-input" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={regLoading} className="auth-primary-btn" size="large">
            {regLoading ? 'Creating workspace...' : 'Create company workspace'}
            {!regLoading && <ArrowRightOutlined />}
          </Button>

          <Text className="auth-terms">By continuing, you agree to the platform terms and privacy policy.</Text>
        </Form>
      ),
    },
  ];

  return (
    <main className="auth-page">
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-one" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-two" aria-hidden="true" />

      <header className="auth-topbar">
        <button type="button" className="auth-brand-button" onClick={() => navigate('/')}>
          <PricePilotLogo size={42} />
        </button>
        <button type="button" className="auth-back-button" onClick={() => navigate('/')}>
          <ArrowLeftOutlined /> Back to website
        </button>
      </header>

      <section className="auth-shell">
        <div className="auth-showcase">
          <div className="auth-showcase-copy">
            <div className="auth-kicker"><ThunderboltOutlined /> Intelligent pricing workspace</div>
            <Title>Operate every pricing decision from one command center.</Title>
            <Paragraph>Connect marketplace data, protect margins, review explainable AI actions, and measure performance without switching between disconnected tools.</Paragraph>
          </div>

          <div className="auth-visual-stage" aria-hidden="true">
            <div className="auth-visual-ring ring-a" />
            <div className="auth-visual-ring ring-b" />

            <div className="auth-float-card auth-float-market">
              <span><GlobalOutlined /></span>
              <div><small>Market position</small><strong>Top 12%</strong></div>
              <RiseOutlined />
            </div>

            <div className="auth-float-card auth-float-risk">
              <span><SafetyCertificateOutlined /></span>
              <div><small>Margin risk</small><strong>Protected</strong></div>
              <CheckCircleFilled />
            </div>

            <div className="auth-dashboard-card">
              <div className="auth-dashboard-top">
                <div><PricePilotLogo size={28} showText={false} /><span>Intelligence overview</span></div>
                <span className="auth-live"><i /> Live</span>
              </div>

              <div className="auth-dashboard-stats">
                <div><span className="auth-stat-icon blue"><AppstoreOutlined /></span><small>Portfolio value</small><strong>₹12.4L</strong><em><RiseOutlined /> 14.2%</em></div>
                <div><span className="auth-stat-icon violet"><RobotOutlined /></span><small>AI actions</small><strong>84</strong><em>12 pending</em></div>
                <div><span className="auth-stat-icon green"><SafetyCertificateOutlined /></span><small>Margin saved</small><strong>₹1.84L</strong><em><CheckCircleFilled /> secure</em></div>
              </div>

              <div className="auth-chart-wrap">
                <div className="auth-chart-head"><div><small>Pricing performance</small><strong>Revenue recovery</strong></div><span>7 days</span></div>
                <svg viewBox="0 0 620 190" preserveAspectRatio="none" className="auth-chart-svg">
                  <defs>
                    <linearGradient id="authChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#60a5fa" stopOpacity=".32"/><stop offset="1" stopColor="#60a5fa" stopOpacity="0"/></linearGradient>
                  </defs>
                  <path d="M0 165 C65 150 80 112 135 128 C205 150 218 73 278 91 C340 111 365 43 425 63 C490 86 525 32 620 38 L620 190 L0 190Z" fill="url(#authChartFill)" />
                  <path d="M0 165 C65 150 80 112 135 128 C205 150 218 73 278 91 C340 111 365 43 425 63 C490 86 525 32 620 38" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <div className="auth-chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
              </div>

              <div className="auth-rec-row">
                <span className="auth-rec-icon"><ThunderboltOutlined /></span>
                <div><small>Highest impact action</small><strong>Optimize Galaxy S25 pricing</strong></div>
                <span className="auth-price-change">₹92K <ArrowRightOutlined /> ₹89.5K</span>
                <button type="button">Review</button>
              </div>
            </div>
          </div>

          <div className="auth-benefits">
            {authFeatures.map((feature) => (
              <div key={feature.title}>
                <span>{feature.icon}</span>
                <div><strong>{feature.title}</strong><small>{feature.copy}</small></div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel-glow" aria-hidden="true" />
          <section className="auth-panel">
            <div className="auth-panel-heading">
              <span className="auth-panel-icon"><LineChartOutlined /></span>
              <Text>Secure company workspace</Text>
              <Title level={2}>Welcome to PricePilot AI</Title>
              <Paragraph>Sign in to manage products, marketplaces, recommendations, and reporting.</Paragraph>
            </div>

            <Tabs items={tabItems} defaultActiveKey="login" className="auth-tabs" animated={{ inkBar: true, tabPane: true }} />

            <div className="auth-security-row">
              <span><LockOutlined /> Secure access</span>
              <span><EyeOutlined /> Audited activity</span>
            </div>
          </section>

          <Text className="auth-support-copy">Need support? Contact your PricePilot workspace administrator.</Text>
        </div>
      </section>
    </main>
  );
}
