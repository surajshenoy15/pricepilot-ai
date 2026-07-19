import React, { useEffect, useState } from 'react';
import { Button, Typography, Space } from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ApiOutlined,
  AuditOutlined,
  RiseOutlined,
  FallOutlined,
  AppstoreOutlined,
  ShopOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  MenuOutlined,
  CloseOutlined,
  SyncOutlined,
  RobotOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PricePilotLogo from '../components/common/Logo';
import '../styles/landing.css';

const { Title, Text, Paragraph } = Typography;

const featureCards = [
  {
    icon: <RobotOutlined />,
    tone: 'blue',
    label: 'Decision intelligence',
    title: 'AI pricing recommendations',
    copy: 'Turn product, demand, stock, and marketplace signals into clear pricing actions your team can review and approve.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    tone: 'green',
    label: 'Profit guard',
    title: 'Margin-safe pricing',
    copy: 'Protect every listing with minimum safe prices, margin risk alerts, and transparent explanations behind every recommendation.',
  },
  {
    icon: <ShoppingCartOutlined />,
    tone: 'violet',
    label: 'Channel control',
    title: 'Unified marketplace view',
    copy: 'Monitor Amazon, Flipkart, Meesho, Shopify, and other channels from one professional operating workspace.',
  },
  {
    icon: <LineChartOutlined />,
    tone: 'cyan',
    label: 'Business analytics',
    title: 'Performance visibility',
    copy: 'Track product health, pricing velocity, recommendation outcomes, and marketplace value through decision-ready reports.',
  },
  {
    icon: <TeamOutlined />,
    tone: 'amber',
    label: 'Workspace governance',
    title: 'Role-based collaboration',
    copy: 'Give administrators, pricing managers, sellers, and analysts the right level of access without losing control.',
  },
  {
    icon: <AuditOutlined />,
    tone: 'rose',
    label: 'Full traceability',
    title: 'Audit-ready operations',
    copy: 'Maintain a clear history of approvals, rejections, price changes, user actions, and automated system events.',
  },
];

const workflow = [
  { number: '01', title: 'Connect commerce data', copy: 'Add products and marketplace listings through APIs, forms, or CSV import.', icon: <ApiOutlined /> },
  { number: '02', title: 'Analyze pricing signals', copy: 'PricePilot evaluates stock, velocity, safe price, and market positioning.', icon: <DatabaseOutlined /> },
  { number: '03', title: 'Review AI decisions', copy: 'Your team receives explainable recommendations with impact and risk context.', icon: <ThunderboltOutlined /> },
  { number: '04', title: 'Act with confidence', copy: 'Approve decisions, protect margins, and track performance through reports.', icon: <CheckCircleFilled /> },
];

const marketplaceNames = ['Amazon', 'Flipkart', 'Meesho', 'Shopify', 'Myntra', 'Direct Commerce'];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const goToLogin = () => navigate('/login');

  return (
    <main className="landing-page">
      <div className="landing-noise" aria-hidden="true" />
      <div className="landing-orb landing-orb-one" aria-hidden="true" />
      <div className="landing-orb landing-orb-two" aria-hidden="true" />

      <header className="landing-nav-wrap">
        <nav className="landing-nav">
          <button type="button" className="landing-brand-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <PricePilotLogo size={42} dark={false} />
          </button>

          <div className={`landing-links ${mobileOpen ? 'is-open' : ''}`}>
            <a href="#platform" onClick={() => setMobileOpen(false)}>Platform</a>
            <a href="#workflow" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#intelligence" onClick={() => setMobileOpen(false)}>Intelligence</a>
            <a href="#security" onClick={() => setMobileOpen(false)}>Governance</a>
            <div className="landing-mobile-actions">
              <Button onClick={goToLogin}>Sign in</Button>
              <Button type="primary" onClick={goToLogin}>Open workspace</Button>
            </div>
          </div>

          <Space className="landing-nav-actions">
            <Button type="text" onClick={goToLogin}>Sign in</Button>
            <Button type="primary" onClick={goToLogin} className="landing-nav-cta">
              Open workspace <ArrowRightOutlined />
            </Button>
          </Space>

          <Button
            type="text"
            className="landing-mobile-toggle"
            icon={mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          />
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy" data-reveal>
          <div className="landing-kicker">
            <span className="landing-kicker-icon"><ThunderboltOutlined /></span>
            AI-powered commerce pricing operations
            <ArrowRightOutlined />
          </div>

          <Title className="landing-hero-title">
            Pricing decisions that move at the speed of <span>commerce.</span>
          </Title>

          <Paragraph className="landing-hero-description">
            PricePilot AI gives e-commerce teams one intelligent workspace to protect margins, recover low-selling products, and optimize pricing across every marketplace.
          </Paragraph>

          <div className="landing-hero-actions">
            <Button type="primary" size="large" onClick={goToLogin} className="landing-primary-cta">
              Launch PricePilot <ArrowRightOutlined />
            </Button>
            <a href="#platform" className="landing-demo-link">
              <span><PlayCircleOutlined /></span>
              Explore the platform
            </a>
          </div>

          <div className="landing-trust-row">
            <div><CheckCircleFilled /> Explainable AI decisions</div>
            <div><CheckCircleFilled /> Margin protection</div>
            <div><CheckCircleFilled /> Multi-marketplace control</div>
          </div>
        </div>

        <div className="landing-visual" data-reveal>
          <div className="visual-glow" />
          <div className="visual-ring visual-ring-one" />
          <div className="visual-ring visual-ring-two" />

          <div className="visual-float-card visual-float-left">
            <span className="float-icon success"><RiseOutlined /></span>
            <div><small>Margin protected</small><strong>₹1.84L</strong></div>
            <span className="float-chip positive">+18.4%</span>
          </div>

          <div className="visual-float-card visual-float-right">
            <span className="float-icon ai"><RobotOutlined /></span>
            <div><small>AI confidence</small><strong>94.8%</strong></div>
            <span className="float-pulse" />
          </div>

          <div className="dashboard-3d-frame">
            <div className="dashboard-3d-topbar">
              <PricePilotLogo size={27} showText={false} />
              <div className="mock-search"><span /><span /><span /></div>
              <div className="mock-avatar" />
            </div>

            <div className="dashboard-3d-body">
              <aside className="mock-sidebar">
                {[0, 1, 2, 3, 4].map((item) => <span key={item} className={item === 0 ? 'active' : ''} />)}
              </aside>

              <div className="mock-content">
                <div className="mock-heading">
                  <div><small>Revenue intelligence</small><strong>Pricing command center</strong></div>
                  <span className="mock-live"><i /> Live</span>
                </div>

                <div className="mock-stats">
                  <div><span className="mock-stat-icon blue"><AppstoreOutlined /></span><small>Products</small><strong>1,248</strong></div>
                  <div><span className="mock-stat-icon green"><RiseOutlined /></span><small>Protected</small><strong>₹8.6L</strong></div>
                  <div><span className="mock-stat-icon violet"><ThunderboltOutlined /></span><small>AI actions</small><strong>126</strong></div>
                </div>

                <div className="mock-chart-card">
                  <div className="mock-chart-head"><span>Pricing performance</span><small>Last 7 days</small></div>
                  <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="mock-chart">
                    <defs>
                      <linearGradient id="landingChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#3b82f6" stopOpacity=".35" />
                        <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 125 C45 118,55 75,100 90 C150 108,170 40,215 58 C260 78,280 24,330 46 C375 66,405 12,500 27 L500 150 L0 150Z" fill="url(#landingChart)" />
                    <path d="M0 125 C45 118,55 75,100 90 C150 108,170 40,215 58 C260 78,280 24,330 46 C375 66,405 12,500 27" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <div className="mock-chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                </div>

                <div className="mock-recommendation">
                  <span className="mock-rec-icon"><ThunderboltOutlined /></span>
                  <div><small>Recommended action</small><strong>Optimize Amazon selling price</strong></div>
                  <span className="mock-price">₹92,000 <ArrowRightOutlined /> ₹89,500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-shadow" />
        </div>
      </section>

      <section className="marketplace-strip" aria-label="Supported commerce channels">
        <div className="marketplace-strip-track">
          {[...marketplaceNames, ...marketplaceNames].map((name, index) => (
            <div key={`${name}-${index}`} className="marketplace-name">
              {index % 3 === 0 ? <GlobalOutlined /> : index % 3 === 1 ? <ShopOutlined /> : <AppstoreOutlined />}
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="landing-metrics" data-reveal>
        <div><strong>24/7</strong><span>pricing signal monitoring</span></div>
        <div><strong>100%</strong><span>decision traceability</span></div>
        <div><strong>6+</strong><span>commerce channels supported</span></div>
        <div><strong>1</strong><span>unified pricing workspace</span></div>
      </section>

      <section id="platform" className="landing-section landing-features">
        <div className="landing-section-heading" data-reveal>
          <div className="section-kicker">Built for modern pricing teams</div>
          <Title level={2}>Everything needed to operate pricing with confidence.</Title>
          <Paragraph>From marketplace data to governed decisions, PricePilot connects the complete pricing workflow in one coherent platform.</Paragraph>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature, index) => (
            <article key={feature.title} className={`feature-card tone-${feature.tone}`} data-reveal style={{ '--delay': `${index * 70}ms` }}>
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-label">{feature.label}</div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
              <span className="feature-arrow"><ArrowRightOutlined /></span>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="landing-section workflow-section">
        <div className="workflow-heading" data-reveal>
          <div className="section-kicker light">A clear operating model</div>
          <Title level={2}>From fragmented data to confident action.</Title>
          <Paragraph>PricePilot turns complex commerce signals into a repeatable, explainable, and controlled decision workflow.</Paragraph>
        </div>

        <div className="workflow-grid">
          {workflow.map((item, index) => (
            <article key={item.number} className="workflow-card" data-reveal style={{ '--delay': `${index * 90}ms` }}>
              <span className="workflow-number">{item.number}</span>
              <div className="workflow-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              {index < workflow.length - 1 && <ArrowRightOutlined className="workflow-connector" />}
            </article>
          ))}
        </div>
      </section>

      <section id="intelligence" className="landing-section intelligence-section">
        <div className="intelligence-visual" data-reveal>
          <div className="intel-card intel-main">
            <div className="intel-card-head">
              <div><span className="intel-icon"><LineChartOutlined /></span><div><small>Portfolio intelligence</small><strong>Product recovery radar</strong></div></div>
              <span className="intel-period">This month</span>
            </div>
            <div className="intel-bars">
              {[74, 48, 88, 61, 94, 70, 82, 58, 90].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="intel-axis"><span>Low sale</span><span>Recovery opportunity</span><span>Healthy</span></div>
          </div>
          <div className="intel-card intel-signal">
            <span className="intel-signal-icon"><SafetyCertificateOutlined /></span>
            <small>Profit guard</small>
            <strong>12 risky listings prevented</strong>
            <div className="intel-progress"><span /></div>
          </div>
          <div className="intel-card intel-action">
            <span><SyncOutlined /></span>
            <div><small>Automation</small><strong>Marketplace data synchronized</strong></div>
            <CheckCircleFilled />
          </div>
        </div>

        <div className="intelligence-copy" data-reveal>
          <div className="section-kicker">Intelligence that explains itself</div>
          <Title level={2}>Every recommendation includes the context behind the decision.</Title>
          <Paragraph>Pricing teams can see the current price, safe price, market position, stock context, risk level, and expected impact before taking action.</Paragraph>
          <div className="intelligence-points">
            <div><span><CheckCircleFilled /></span><div><strong>Transparent decision logic</strong><p>Understand why the AI is recommending an increase, match, discount, or margin-protection action.</p></div></div>
            <div><span><CheckCircleFilled /></span><div><strong>Human approval controls</strong><p>Keep your team in control with approval, rejection, comments, and a complete activity history.</p></div></div>
            <div><span><CheckCircleFilled /></span><div><strong>Operational reporting</strong><p>Measure recommendation performance and export decision-ready reports for stakeholders.</p></div></div>
          </div>
          <Button type="primary" size="large" onClick={goToLogin} className="landing-secondary-cta">Explore AI recommendations <ArrowRightOutlined /></Button>
        </div>
      </section>

      <section id="security" className="landing-section governance-section" data-reveal>
        <div className="governance-copy">
          <div className="section-kicker light">Designed for accountable teams</div>
          <Title level={2}>Professional governance without slowing the business.</Title>
          <Paragraph>Control access, preserve decision history, and operate pricing workflows with the structure expected from a company-grade platform.</Paragraph>
          <div className="governance-badges">
            <span><LockOutlined /> Role-based access</span>
            <span><AuditOutlined /> Full audit history</span>
            <span><SafetyCertificateOutlined /> Margin safeguards</span>
          </div>
        </div>
        <div className="governance-console">
          <div className="console-top"><i /><i /><i /><span>governance.policy</span></div>
          <div className="console-lines">
            <div><span>01</span><code>workspace.role</code><strong>PRICING_MANAGER</strong></div>
            <div><span>02</span><code>approval.required</code><strong className="true">true</strong></div>
            <div><span>03</span><code>margin.guard</code><strong>ACTIVE</strong></div>
            <div><span>04</span><code>audit.retention</code><strong>ENABLED</strong></div>
          </div>
        </div>
      </section>

      <section className="landing-cta" data-reveal>
        <div className="cta-grid" aria-hidden="true" />
        <div className="cta-orb" aria-hidden="true" />
        <div className="cta-copy">
          <span><ThunderboltOutlined /> Ready for intelligent pricing operations?</span>
          <Title level={2}>Give every pricing decision the data, guardrails, and speed it deserves.</Title>
          <Paragraph>Open the PricePilot AI workspace and experience a modern command center for commerce pricing.</Paragraph>
        </div>
        <Button type="primary" size="large" onClick={goToLogin} className="cta-button">Enter the workspace <ArrowRightOutlined /></Button>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand"><PricePilotLogo size={38} dark={false} /><p>AI-based dynamic pricing and sales recovery for modern commerce teams.</p></div>
        <div className="footer-links"><a href="#platform">Platform</a><a href="#workflow">Workflow</a><a href="#intelligence">Intelligence</a><button type="button" onClick={goToLogin}>Sign in</button></div>
        <div className="footer-bottom"><span>© 2026 PricePilot AI. All rights reserved.</span><span>Designed for intelligent commerce operations.</span></div>
      </footer>
    </main>
  );
}
