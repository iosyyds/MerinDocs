<div class="home-hero">
  <div class="home-hero-inner">
    <div class="home-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      全新版本
    </div>

    <h1 class="home-title">全能签安装指南</h1>

    <p class="home-subtitle">一键安装你的 iOS 应用，简单又快捷</p>

    <div class="home-features">
      <div class="home-feature">
        <div class="home-feature-icon" style="background: #dbeafe; color: #3b82f6;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <div class="home-feature-text">
          <strong>3分钟快速安装</strong>
          <span>不用电脑，手机直接搞定</span>
        </div>
      </div>

      <div class="home-feature">
        <div class="home-feature-icon" style="background: #dcfce7; color: #10b981;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="home-feature-text">
          <strong>稳定签名</strong>
          <span>不掉签，长期使用</span>
        </div>
      </div>

      <div class="home-feature">
        <div class="home-feature-icon" style="background: #fef3c7; color: #f59e0b;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <div class="home-feature-text">
          <strong>支持所有 iOS 设备</strong>
          <span>无需越狱</span>
        </div>
      </div>
    </div>

    <a href="#/doc/全能签教程/安装教程.md" class="home-cta">
      立即开始安装
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </a>
  </div>
</div>

<style>
.home-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
  border-radius: 16px;
  margin: 20px;
}
.home-hero-inner {
  text-align: center;
  max-width: 600px;
  width: 100%;
}
.home-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}
.home-title {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.home-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0 0 40px;
  line-height: 1.6;
}
.home-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}
.home-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.home-feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.home-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.home-feature-text strong {
  font-size: 14px;
  color: #1e293b;
}
.home-feature-text span {
  font-size: 12px;
  color: #94a3b8;
}
.home-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 16px 48px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.home-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.45);
}
@media (max-width: 768px) {
  .home-hero {
    padding: 30px 16px;
    margin: 12px;
    min-height: auto;
  }
  .home-title {
    font-size: 32px;
  }
  .home-subtitle {
    font-size: 15px;
    margin-bottom: 28px;
  }
  .home-features {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }
  .home-feature {
    flex-direction: row;
    text-align: left;
    padding: 16px;
  }
  .home-cta {
    padding: 14px 36px;
    font-size: 16px;
    width: 100%;
    justify-content: center;
  }
}
</style>
