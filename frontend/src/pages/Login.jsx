import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
} from 'antd';

import {
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

import PricePilotLogo from '../components/common/Logo';

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginApi(
        values.email,
        values.password
      );

      login(data.token, data.user);

      navigate(ROUTES.DASHBOARD, {
        replace: true,
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Invalid email or password'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1120',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >

      {/* Main Container */}
      <div
        className="login-container"
        style={{
          width: '100%',
          maxWidth: 1440,
          minHeight: '90vh',
          background: '#ffffff',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
        }}
      >

        {/* Left Branding Panel */}
        <div
          className="login-brand-panel"
          style={{
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 56px',
            color: '#fff',
          }}
        >

          {/* Logo */}
          <div>
            <PricePilotLogo size={44} />
          </div>

          {/* Center Content */}
          <div
            style={{
              maxWidth: 520,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >

            {/* Badge */}
            <div
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                borderRadius: 10,
                background: 'rgba(37,99,235,0.12)',
                border: '1px solid rgba(37,99,235,0.3)',
                color: '#2563eb',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1,
                marginBottom: 28,
              }}
            >
              AI-POWERED PRICING
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight: 800,
                marginBottom: 28,
                color: '#ffffff',
              }}
            >
              Smarter pricing.
              <br />
              Bigger margins.
              <br />
              <span style={{ color: '#2563eb' }}>
                More sales.
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: '#94a3b8',
                marginBottom: 56,
              }}
            >
              Monitor products across Amazon,
              Flipkart, Meesho and more.
              Let AI find pricing gaps before
              your competitors do.
            </p>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 48,
                flexWrap: 'wrap',
              }}
            >

              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  6+
                </div>

                <div
                  style={{
                    color: '#94a3b8',
                    marginTop: 4,
                  }}
                >
                  Marketplaces
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  94%
                </div>

                <div
                  style={{
                    color: '#94a3b8',
                    marginTop: 4,
                  }}
                >
                  Approval rate
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  34%
                </div>

                <div
                  style={{
                    color: '#94a3b8',
                    marginTop: 4,
                  }}
                >
                  Avg sales lift
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: 13,
            }}
          >
            © 2025 PricePilot AI · All rights reserved
          </div>

        </div>

        {/* Right Login Panel */}
        <div
          className="login-form-panel"
          style={{
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
          }}
        >

          <div
            style={{
              width: '100%',
              maxWidth: 420,
              margin: '0 auto',
            }}
          >

            {/* Heading */}
            <div style={{ marginBottom: 36 }}>

              <h2
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  marginBottom: 10,
                  color: '#111827',
                }}
              >
                Welcome back
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: 16,
                }}
              >
                Sign in to your PricePilot AI account
              </p>

            </div>

            {/* Error */}
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{
                  marginBottom: 20,
                  borderRadius: 8,
                }}
              />
            )}

            {/* Login Form */}
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              requiredMark={false}
            >

              <Form.Item
                name="email"
                label="Email address"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email',
                  },
                  {
                    type: 'email',
                    message: 'Please enter a valid email',
                  },
                ]}
              >
                <Input
                  prefix={
                    <MailOutlined
                      style={{ color: '#bbb' }}
                    />
                  }
                  placeholder="you@example.com"
                  style={{
                    borderRadius: 8,
                    height: 48,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password',
                  },
                ]}
                style={{
                  marginBottom: 24,
                }}
              >
                <Input.Password
                  prefix={
                    <LockOutlined
                      style={{ color: '#bbb' }}
                    />
                  }
                  placeholder="Enter your password"
                  style={{
                    borderRadius: 8,
                    height: 48,
                  }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                  background: '#0f172a',
                  border: 'none',
                }}
              >
                {loading
                  ? 'Signing in...'
                  : 'Sign In'}
              </Button>

            </Form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;