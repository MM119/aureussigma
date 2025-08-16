import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  ShieldCheck,
  LineChart as LineChartIcon,
  Cpu,
  Scale,
  BookOpen,
  FileText,
  Mail,
  Linkedin,
  Lock,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Database,
  Layers,
  Clock,
  Gauge,
  Landmark,
  Users,
  Building2,
} from "lucide-react";

// Static public asset paths
const LOGO_SRC = "/asc-logo-transparent.png";
const TEAM_PHOTOS = {
  founder: "/team-duc.jpg",
  cofounder: "/team-minh.jpg" // add this file to public/
};
const BRAND = { charcoal: "#0f172a", gold: "#D4AF37" };

const i18n = {
  en: {
    nav: {
      strategies: "Strategies",
      research: "Research",
      philosophy: "Philosophy",
      governance: "Governance & Risk",
      platform: "Infrastructure",
      team: "Team",
      careers: "Careers",
      contact: "Contact",
      portal: "Limited Partners",
    },
    hero: {
      title: "Institutional-Grade Systematic Trading",
      subtitle:
        "Quantitative research and engineering powering disciplined, systematic strategies.",
      ctaPrimary: "Institutional Inquiry",
      ctaSecondary: "Request Access",
    },
    kpi: {
      aum: "Proprietary Capital",
      signals: "Strategies in Development",
      drawdown: "Risk Framework",
      sharpe: "Target Performance",
    },
    perf: {
      title: "Investment Approach",
      note:
        "Target Performance\nSharpe >1.0\n\nAdvanced Risk Framework\nMulti-layer Controls",
      targetMetricsTitle: "Target Metrics (Backtested)",
      strategyCharacteristicsTitle: "Strategy Characteristics",
      targetSharpeRatio: "Target Sharpe Ratio",
      targetVolatility: "Target Volatility",
      drawdownControl: "Drawdown Control",
      marketFocus: "Market Focus",
      approach: "Approach",
      numberOfStrategies: "Number of Strategies",
      marketsCovered: "Markets Covered",
      rebalanceFrequency: "Rebalance Frequency",
      leverageUsage: "Leverage Usage",
      focusMarket: "Focus Market",
    },
    strategies: {
      title: "Trading Strategies",
      qvmTitle: "Strategy Alpha",
      qvmDesc:
        "Systematic approach to Vietnamese equity markets.",
      lowvolTitle: "Strategy Beta",
      lowvolDesc:
        "Market-neutral quantitative strategies.",
      mmTitle: "Strategy Gamma",
      mmDesc:
        "Multi-asset systematic trading.",
      bullets: [
        "Quantitative approach",
        "Risk management",
        "Systematic process",
        "Vietnam focus",
      ],
    },
    platform: {
      title: "Our Approach",
      data: "Technology",
      dataDesc:
        "Resilient, monitored infrastructure with automated data pipelines and execution safeguards.",
      research: "Research",
      researchDesc:
        "Quantitative research framework combining statistical analysis and machine learning.",
      portfolio: "Risk Management",
      portfolioDesc:
        "Comprehensive risk framework with position limits and drawdown controls.",
      execution: "Execution",
      executionDesc:
        "Broker and venue connectivity with execution oversight.",
      compliance: "Regulatory",
      complianceDesc:
        "Separately managed accounts and any products, if offered, will be provided through appropriately licensed entities and are subject to jurisdictional requirements.",
    },
    research: {
      title: "Research",
      items: [
        { title: "Quarterly Letter Q3 2025", tag: "Restricted" },
        { title: "Risk Framework Overview", tag: "Confidential" },
        { title: "Performance Attribution", tag: "LPs Only" },
      ],
      viewAll: "Request Access",
    },
    team: {
      title: "Leadership",
      founder: "Duc Nguyen — Chairman",
      founderBio:
        "Former CEO of Techcom Capital and Techcom Securities; former CFO of Orient Commercial Bank; Partner at Kusto Group. 20+ years in capital markets and senior executive leadership.",
      cofounder: "Minh Mai — Chief Executive Officer",
      cofounderBio:
        "CFA. Head of Research at Fujiwara Capital (Global Macro Hedge Fund). Research Lead at Vietbridge Capital. ESCP Europe.",
      advisors: "Advisory Board",
      advisorsBio:
        "Senior professionals from leading quantitative firms.",
    },
    contact: {
      title: "Get In Touch",
      desc:
        "For investment opportunities or general inquiries.",
      emailPlaceholder: "your@email.com",
      send: "Send Message",
    },
    legal: {
      title: "Important Information",
      body:
        "For institutional/professional investors only; not for retail distribution. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities or investment services in any jurisdiction. Aureus Sigma Capital engages in proprietary trading and research. Separately managed accounts and any products, if offered, would be made only through appropriately licensed entities and pursuant to definitive offering materials. Investment strategies involve risk; past performance (including backtested results) is not indicative of future results. Access to materials may be restricted based on investor status and jurisdiction.",
      rights: "© " + new Date().getFullYear() + " Aureus Sigma Capital. All rights reserved.",
    },
    principles: {
      title: "Principles",
      subtitle: "Our operating principles",
      items: [
        { title: "Data Integrity & Governance", desc: "Validated sources, reproducible pipelines, auditability." },
        { title: "Robust Research Methods", desc: "Out-of-sample discipline, risk-aware model selection, capacity awareness." },
        { title: "Risk-First Construction", desc: "Limits, diversification, drawdown controls, model risk oversight." },
        { title: "Operational Resilience", desc: "Monitoring, redundancy, business continuity planning." }
      ]
    },
    cookie: {
      text: "We use minimal cookies for site functionality and to process institutional inquiries.",
      accept: "Accept"
    }
  },
  vi: {
    nav: {
      strategies: "Chiến lược",
      research: "Nghiên cứu",
      philosophy: "Triết lý",
      governance: "Quản trị & Rủi ro",
      platform: "Hạ tầng",
      team: "Ban lãnh đạo",
      careers: "Tuyển dụng",
      contact: "Liên hệ",
      portal: "Nhà đầu tư",
    },
    hero: {
      title: "Giao Dịch Định Lượng Chuẩn Quốc Tế",
      subtitle:
        "Nghiên cứu và kỹ thuật định lượng, kỷ luật, theo chuẩn quốc tế – kết hợp am hiểu sâu sắc thị trường Việt Nam.",
      ctaPrimary: "Yêu cầu thông tin",
      ctaSecondary: "Yêu cầu truy cập",
    },
    kpi: {
      aum: "Thành lập",
      signals: "Chiến lược giao dịch",
      drawdown: "Khung quản lý rủi ro",
      sharpe: "Hiệu suất mục tiêu",
    },
    perf: {
      title: "Phương pháp đầu tư",
      note:
        "• Vốn tự doanh: 2025 (Thị trường Việt Nam)\n• Chiến lược đang phát triển: 3\n• Hiệu suất mục tiêu: Sharpe >1.0\n• Khung quản trị rủi ro: Đa tầng tích hợp",
      targetMetricsTitle: "Chỉ số mục tiêu (Backtest)",
      strategyCharacteristicsTitle: "Chiến lược giao dịch",
      targetSharpeRatio: "Tỷ lệ Sharpe mục tiêu",
      targetVolatility: "Mức biến động danh mục",
      drawdownControl: "Kiểm soát drawdown",
      marketFocus: "Thị trường tập trung",
      approach: "Phương pháp",
      numberOfStrategies: "Số lượng chiến lược",
      marketsCovered: "Thị trường mục tiêu",
      rebalanceFrequency: "Tần suất tái cân bằng",
      leverageUsage: "Sử dụng đòn bẩy",
      focusMarket: "Thị trường tập trung",
    },
    strategies: {
      title: "Chiến lược giao dịch",
      qvmTitle: "Chiến lược Alpha",
      qvmDesc:
        "Phương pháp hệ thống cho thị trường cổ phiếu Việt Nam.",
      lowvolTitle: "Chiến lược Beta",
      lowvolDesc:
        "Chiến lược định lượng trung lập thị trường.",
      mmTitle: "Chiến lược Gamma",
      mmDesc:
        "Giao dịch hệ thống đa tài sản cho thị trường thế giới.",
      bullets: [
        "Phương pháp định lượng",
        "Quản lý rủi ro",
        "Đầu tư hệ thống",
        "Thị trường Việt Nam",
      ],
    },
    platform: {
      title: "Hạ tầng",
      data: "Công nghệ",
      dataDesc:
        "Hạ tầng đáng tin cậy, giám sát 24/7 với quy trình dữ liệu và thực thi tự động cùng cơ chế bảo vệ.",
      research: "Nghiên cứu",
      researchDesc:
        "Khung nghiên cứu định lượng kết hợp phân tích thống kê và máy học.",
      portfolio: "Quản lý rủi ro",
      portfolioDesc:
        "Khung rủi ro toàn diện với hạn mức vị thế và kiểm soát drawdown.",
      execution: "Thực thi",
      executionDesc:
        "Kết nối đối tác/bên liên quan và giám sát thực thi.",
      compliance: "Quy định",
      complianceDesc:
        "Sản phẩm (nếu có) sẽ được cung cấp thông qua đơn vị được cấp phép và tuân thủ quy định pháp lý.",
    },
    research: {
      title: "Nghiên cứu",
      items: [
        { title: "Thư quý Q3 2025", tag: "Hạn chế" },
        { title: "Quản lý rủi ro", tag: "Bảo mật" },
        { title: "Phân tích hiệu suất", tag: "LP Only" },
      ],
      viewAll: "Yêu cầu truy cập",
    },
    team: {
      title: "Ban lãnh đạo",
      founder: "Duc Nguyen — Chủ tịch",
      founderBio:
        "Cựu CEO Techcom Capital và Techcom Securities; cựu CFO Ngân hàng TMCP Phương Đông (Orient Commercial Bank); Partner tại Kusto Group. Hơn 20 năm trong lĩnh vực thị trường vốn và quản trị cấp cao.",
      cofounder: "Minh Mai — Tổng Giám đốc",
      cofounderBio:
        "CFA. Trưởng phòng Nghiên cứu tại Fujiwara Capital (Quỹ đầu cơ Macro). Trưởng bộ phận Nghiên cứu tại Vietbridge Capital. ESCP Europe.",
      advisors: "Hội đồng cố vấn",
      advisorsBio:
        "Chuyên gia cấp cao từ các quỹ định lượng hàng đầu.",
    },
    contact: {
      title: "Liên hệ",
      desc:
        "Dành cho cơ hội đầu tư hoặc thông tin chung.",
      emailPlaceholder: "email@cua-ban.com",
      send: "Gửi tin nhắn",
    },
    legal: {
      title: "Thông tin quan trọng",
      body:
        "Chỉ dành cho nhà đầu tư tổ chức/chuyên nghiệp; không dành cho nhà đầu tư cá nhân. Nội dung mang tính thông tin, không phải lời mời chào mua/bán chứng khoán hay dịch vụ đầu tư tại bất kỳ khu vực pháp lý nào. Aureus Sigma Capital hiện tập trung giao dịch tự doanh và phát triển chiến lược; mọi sản phẩm (nếu có) sẽ chỉ được cung cấp thông qua đơn vị được cấp phép và tài liệu chào bán phù hợp. Đầu tư luôn tiềm ẩn rủi ro; hiệu suất quá khứ (bao gồm backtest) không đảm bảo kết quả tương lai. Việc truy cập tài liệu có thể bị giới hạn theo tư cách nhà đầu tư và khu vực pháp lý.",
      rights: "© " + new Date().getFullYear() + " Aureus Sigma Capital. Bảo lưu mọi quyền.",
    },
    principles: {
      title: "Triết lý",
      subtitle: "Nguyên tắc vận hành",
      items: [
        { title: "Tính toàn vẹn dữ liệu & quản trị", desc: "Nguồn dữ liệu được kiểm chứng, minh bạch và có thể tái lập & kiểm toán." },
        { title: "Nghiên cứu & phát triển chặt chẽ", desc: "Kiểm chứng out-of-sample, lựa chọn mô hình nhận diện rủi ro, chú trọng dung lượng chiến lược đầu tư (investment capacity)." },
        { title: "Ưu tiên quản trị rủi ro", desc: "Đa dạng hóa, giới hạn tỷ trọng, kiểm soát drawdown và giám sát rủi ro mô hình." },
        { title: "Vận hành bền vững", desc: "Giám sát liên tục, dự phòng rủi ro và kế hoạch duy trì hoạt động." }
      ]
    },
    cookie: {
      text: "Chúng tôi sử dụng cookie tối thiểu để vận hành trang web và xử lý yêu cầu từ nhà đầu tư tổ chức.",
      accept: "Đồng ý"
    }
  },
};

// Removed unused data series to reduce chance of misinterpretation
const perfSeries = [];

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-slate-700 border-slate-200 bg-white">
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, showAccent = true }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6" />}
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 mt-2 text-sm md:text-base">{subtitle}</p>
        )}
        {showAccent && (
          <div className="mt-3 h-0.5 w-16 rounded-full" style={{ backgroundColor: BRAND.gold, opacity: 0.6 }} />
        )}
      </div>
    </div>
  );
}
function SectionDivider() {
  return (
    <div className="mt-8">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(212,175,55,0.5) 50%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{value}</div>
      {note && <div className="mt-1 text-xs text-slate-500">{note}</div>}
    </div>
  );
}

function NavItem({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className="text-sm px-2 py-1 rounded-md transition-colors duration-150"
      style={{ color: active ? BRAND.gold : '#334155' }}
    >
      {children}
    </button>
  );
}

function FooterLink({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-slate-500 hover:text-slate-700 text-sm">
      {children}
    </button>
  );
}

function TeamCard({ src, alt, name, bio }) {
  return (
    <div className="p-0">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-top brightness-95"
          style={{ objectPosition: '50% 20%' }}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.nextSibling.style.display = 'block';
          }}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-1 tracking-tight">{name}</h3>
        <p className="text-slate-700 text-sm leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const t = i18n[lang];
  const [showGate, setShowGate] = useState(false);
  const [showLegalDoc, setShowLegalDoc] = useState(null); // 'privacy' | 'terms' | 'disclosures'
  const [showInquiry, setShowInquiry] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const [logoOk, setLogoOk] = useState(true);
  const [showCookieNotice, setShowCookieNotice] = useState(true);

  // Minimalist: only set active section when user clicks a nav item
  const setActiveByClick = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top banner */}
      <div className="w-full bg-slate-900 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="opacity-90">
              Global • Systematic Trading • Founded 2025
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className={`px-2 py-1 rounded-md ${lang === "en" ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={`px-2 py-1 rounded-md ${lang === "vi" ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            >
              VI
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            {logoOk ? (
              <img src={LOGO_SRC} alt="Aureus Sigma Capital" className="h-9 max-h-10 w-auto object-contain flex-shrink-0" onError={() => setLogoOk(false)} />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-900 shadow">
                ASC
              </div>
            )}
            {/* Wordmark removed for minimalist header per preference */}
          </div>
          {/* Desktop divider */}
          <div className="hidden md:block h-6 w-px bg-slate-200" />
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <NavItem active={activeSection === "strategies"} onClick={() => setActiveByClick("strategies")}>{lang==='vi'? 'Chiến lược':'Strategies'}</NavItem>
            <NavItem active={activeSection === "research"} onClick={() => { setActiveSection('research'); setShowGate(true); }}>{lang==='vi'? 'Nghiên cứu':'Research'}</NavItem>
            <NavItem active={activeSection === "principles"} onClick={() => setActiveByClick("principles")}>{lang==='vi'? 'Triết lý':'Philosophy'}</NavItem>
            <NavItem active={activeSection === "governance"} onClick={() => setActiveByClick("governance")}>{lang==='vi'? 'Quản trị & Rủi ro':'Governance & Risk'}</NavItem>
            <NavItem active={activeSection === "platform"} onClick={() => setActiveByClick("platform")}>{lang==='vi'? 'Hạ tầng':'Infrastructure'}</NavItem>
            <NavItem active={activeSection === "team"} onClick={() => setActiveByClick("team")}>{lang==='vi'? 'Ban lãnh đạo':'Team'}</NavItem>
            <NavItem active={activeSection === "careers"} onClick={() => setActiveByClick("careers")}>{lang==='vi'? 'Tuyển dụng':'Careers'}</NavItem>
            <NavItem active={activeSection === "contact"} onClick={() => { setActiveSection('contact'); setShowInquiry(true); }}>{lang==='vi'? 'Liên hệ':'Contact'}</NavItem>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGate(true)} className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
              <Lock className="h-4 w-4" /> {t.nav.portal}
            </button>
            {/* Mobile hamburger */}
            <button className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-800" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-200">
            <img src={LOGO_SRC} alt="Aureus Sigma Capital" className="h-8 w-auto" />
            <button className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-800" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-4 space-y-2">
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('strategies'); }}>{lang==='vi'? 'Chiến lược':'Strategies'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveSection('research'); setShowGate(true); }}>{lang==='vi'? 'Nghiên cứu':'Research'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('principles'); }}>{lang==='vi'? 'Triết lý':'Philosophy'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('governance'); }}>{lang==='vi'? 'Quản trị & Rủi ro':'Governance & Risk'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('platform'); }}>{lang==='vi'? 'Hạ tầng':'Infrastructure'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('team'); }}>{lang==='vi'? 'Ban lãnh đạo':'Team'}</button>
            <button className="block w-full text-left text-base py-2" onClick={() => { setMobileOpen(false); setActiveByClick('careers'); }}>{lang==='vi'? 'Tuyển dụng':'Careers'}</button>
            <div className="pt-2 flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium" onClick={() => { setMobileOpen(false); setShowInquiry(true); }}>{t.hero.ctaPrimary}</button>
              <button className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium" onClick={() => { setMobileOpen(false); setShowGate(true); }}>{t.hero.ctaSecondary}</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-clip">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        {/* Subtle film grain for depth on large screens */}
        <div className="absolute inset-0 opacity-10 hidden md:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
        {/* Hero symbolism: faint golden arcs */}
        <svg className="pointer-events-none absolute right-0 top-0 h-full opacity-10" viewBox="0 0 600 600" fill="none">
          <path d="M0,600 A600,600 0 0 1 600,0" stroke={BRAND.gold} strokeWidth="0.5" />
          <path d="M100,600 A500,500 0 0 1 600,100" stroke={BRAND.gold} strokeWidth="0.4" />
          <path d="M200,600 A400,400 0 0 1 600,200" stroke={BRAND.gold} strokeWidth="0.3" />
        </svg>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              {t.hero.title}
            </h1>
            <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setShowInquiry(true)}
                className="inline-flex items-center gap-2 rounded-md bg-white text-slate-900 px-5 py-3 text-sm font-medium hover:bg-slate-100 shadow"
              >
                {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowGate(true)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-500 text-white px-5 py-3 text-sm font-medium hover:bg-slate-800"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>
          
          {/* KPI Grid */}
      <div className="mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">{t.kpi.aum}</div>
              <div className="mt-1 text-2xl font-light text-white">2025</div>
              <div className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'Vietnam Focus' : 'Thị trường Việt Nam'}</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">{t.kpi.signals}</div>
              <div className="mt-1 text-2xl font-light text-white">3</div>
              <div className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'In Development' : 'Đang phát triển'}</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">{t.kpi.sharpe}</div>
              <div className="mt-1 text-2xl font-light text-white">&gt;1.0</div>
              <div className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'Sharpe Ratio' : 'Sharpe'}</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">{t.kpi.drawdown}</div>
              <div className="mt-1 text-2xl font-light text-white">{lang === 'en' ? 'Multi-layer' : 'Đa tầng'}</div>
              <div className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'Controls' : 'Kiểm soát'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-12 md:py-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={LineChartIcon} title={t.perf.title} />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">{t.perf.targetMetricsTitle}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.targetSharpeRatio}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">&gt;1.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.targetVolatility}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">8-15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.drawdownControl}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">&lt;8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.marketFocus}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">Vietnam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.approach}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">{lang === 'en' ? 'Systematic' : 'Đầu tư hệ thống'}</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">{t.perf.strategyCharacteristicsTitle}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.numberOfStrategies}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.marketsCovered}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">{lang === 'en' ? 'VN Equity' : 'Việt Nam'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.rebalanceFrequency}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">{lang === 'en' ? 'Dynamic' : 'Linh hoạt'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.leverageUsage}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">{lang === 'en' ? 'None' : 'Không'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t.perf.focusMarket}</span>
                  <span className="font-mono text-sm font-medium text-slate-900">{lang === 'en' ? 'Vietnam' : 'Việt Nam'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <p className="text-xs text-slate-600">{t.perf.note}</p>
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Principles / Philosophy */}
      <section id="principles" className="py-12 md:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Layers} title={t.principles.title} subtitle={t.principles.subtitle} showAccent={false} />
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {t.principles.items.map((p, idx) => (
              <div key={p.title} className="relative overflow-hidden bg-white p-0">
                {/* Subtle mathematical motif: golden ratio arcs + sigma */}
                <svg className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-10" viewBox="0 0 200 200" fill="none">
                  {/* Golden ratio quarter-circles */}
                  <path d="M0,200 A200,200 0 0 1 200,0" stroke={BRAND.gold} strokeWidth="1" />
                  <path d="M50,200 A150,150 0 0 1 200,50" stroke={BRAND.gold} strokeWidth="0.8" />
                  <path d="M80,200 A120,120 0 0 1 200,80" stroke={BRAND.gold} strokeWidth="0.6" />
                  {/* Minimal sigma glyph */}
                  <path d="M120,40 C80,40 70,60 95,80 C70,95 75,120 120,120" stroke="#94a3b8" strokeWidth="1.2" />
                </svg>
                <div className="p-0">
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Strategies */}
      <section id="strategies" className="py-12 md:py-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={TrendingUp} title={t.strategies.title} />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* QVM */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t.strategies.qvmTitle}</h3>
              </div>
              <p className="mt-2 text-slate-600 text-sm">{t.strategies.qvmDesc}</p>
              <div className="mt-4 space-y-2 text-xs">
                {t.strategies.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-slate-400 rounded-full" />
                    <span className="text-slate-600">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <span className="text-xs text-slate-500">Internal Research</span>
              </div>
            </div>

            {/* Strategy II */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t.strategies.lowvolTitle}</h3>
              </div>
              <p className="mt-2 text-slate-600 text-sm">{t.strategies.lowvolDesc}</p>
            <div className="mt-4 space-y-2 text-xs">
                {t.strategies.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-slate-400 rounded-full" />
                    <span className="text-slate-600">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <span className="text-xs text-slate-500">In Development</span>
              </div>
            </div>

            {/* Strategy III */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t.strategies.mmTitle}</h3>
              </div>
              <p className="mt-2 text-slate-600 text-sm">{t.strategies.mmDesc}</p>
              <div className="mt-4 space-y-2 text-xs">
                {t.strategies.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-slate-400 rounded-full" />
                    <span className="text-slate-600">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <span className="text-xs text-slate-500">Research Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-12 md:py-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Building2} title={t.platform.title} />
          <div className="grid md:grid-cols-5 gap-4 md:gap-6">
            <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Database className="h-5 w-5" /> {t.platform.data}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.platform.dataDesc}</p>
            </div>
            <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <BookOpen className="h-5 w-5" /> {t.platform.research}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.platform.researchDesc}</p>
            </div>
            <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Layers className="h-5 w-5" /> {t.platform.portfolio}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.platform.portfolioDesc}</p>
            </div>
            <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <LineChartIcon className="h-5 w-5" /> {t.platform.execution}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.platform.executionDesc}</p>
            </div>
            <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Landmark className="h-5 w-5" /> {t.platform.compliance}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.platform.complianceDesc}</p>
            </div>
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Governance & Risk */}
      <section id="governance" className="py-12 md:py-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Scale} title={t.nav.governance} subtitle={lang==='en' ? 'High-level overview of governance and risk controls' : 'Tổng quan cấp cao về quản trị và kiểm soát rủi ro'} />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Investment Committee':'Hội đồng đầu tư'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Structured decision-making with documented charters and quorum requirements.':'Quy trình ra quyết định có cấu trúc với điều lệ và yêu cầu biểu quyết rõ ràng.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Model Risk Oversight':'Giám sát rủi ro mô hình'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Validation, monitoring, and decommissioning guidelines for models.':'Hướng dẫn thẩm định, giám sát và ngừng sử dụng mô hình.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Limits & Controls':'Hạn mức & kiểm soát'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Position sizing, exposure, drawdown controls, and escalation protocol.':'Hạn mức vị thế, mức độ phơi nhiễm, kiểm soát drawdown và quy trình báo động.'}</p>
            </div>
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-12 md:py-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={FileText} title={t.research.title} />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {t.research.items.map((p) => (
              <article key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                  <Tag>{p.tag}</Tag>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Abstract coming soon. Download upon request.
                </p>
                <div className="mt-4">
                  <button onClick={() => setShowGate(true)} className="inline-flex items-center gap-2 text-slate-900 hover:underline">
                    {t.research.viewAll} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Users} title={t.team.title} showAccent={false} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-2">
            <TeamCard src={TEAM_PHOTOS.founder} alt="Duc Nguyen" name={t.team.founder} bio={t.team.founderBio} />
            <TeamCard src={TEAM_PHOTOS.cofounder} alt="Minh Mai" name={t.team.cofounder} bio={t.team.cofounderBio} />
          </div>
          {/* No card borders; seamless like AQR leadership */}
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="py-12 md:py-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Cpu} title={t.nav.careers} subtitle={lang==='en' ? 'Selective, mission-driven team; quietly building long-term systems' : 'Đội ngũ tinh gọn, tập trung sứ mệnh; xây dựng hệ thống bền vững'} />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Quant Research':'Nghiên cứu định lượng'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Statistical learning, signal discovery, robust validation.':'Học thống kê, khám phá tín hiệu, thẩm định vững chắc.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Engineering':'Kỹ sư hệ thống'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Data/infra, reliability, testing, and tooling.':'Dữ liệu/hạ tầng, độ tin cậy, kiểm thử và công cụ.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">{lang==='en'?'Trading Operations':'Vận hành giao dịch'}</h3>
              <p className="mt-2 text-sm text-slate-600">{lang==='en'?'Execution oversight, monitoring, incident response.':'Giám sát thực thi, theo dõi, phản ứng sự cố.'}</p>
            </div>
          </div>
          <div className="mt-6">
            <button onClick={()=>alert(lang==='en'?'Please send your CV or profile to careers@aureussigma.com':'Vui lòng gửi CV/profil của bạn tới careers@aureussigma.com')} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-5 py-3 text-sm font-medium hover:bg-slate-800">{lang==='en'?'Express Interest':'Gửi quan tâm'}</button>
          </div>
          <SectionDivider />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 md:py-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Mail} title={t.contact.title} subtitle={t.contact.desc} />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={() => setShowInquiry(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-medium hover:bg-slate-800">
                {t.hero.ctaPrimary}
              </button>
              <button onClick={() => setShowGate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-900 px-5 py-3 text-sm font-medium hover:bg-slate-50">
                {t.hero.ctaSecondary}
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">Email: contact@aureussigmacapital.com</p>
              <p className="text-xs text-slate-500 mt-2">Information provided is intended for institutional/professional investors only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-12 md:py-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle icon={Scale} title={t.legal.title} />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-700 leading-relaxed">{t.legal.body}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {logoOk ? (
                <img src={LOGO_SRC} alt="Aureus Sigma Capital" className="h-9 w-auto" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-900">ASC</div>
              )}
                <div className="leading-tight">
                  <div className="font-medium text-slate-900">Aureus Sigma Capital</div>
                  <div className="text-xs text-slate-500">Quantitative Research • Systematic Trading</div>
                </div>
            </div>
            <div className="flex gap-6">
              <FooterLink onClick={() => setShowLegalDoc('privacy')}>Privacy</FooterLink>
              <FooterLink onClick={() => setShowLegalDoc('terms')}>Terms</FooterLink>
              <FooterLink onClick={() => setShowLegalDoc('disclosures')}>Disclosures</FooterLink>
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500">{t.legal.rights}</div>
        </div>
      </footer>

      {/* Cookie notice */}
      {showCookieNotice && (
        <div className="fixed bottom-4 inset-x-0 px-4 z-40">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-3 shadow-sm flex items-center justify-between gap-3">
              <p className="text-xs text-slate-600">{t.cookie.text}</p>
              <button 
                onClick={() => setShowCookieNotice(false)}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                {t.cookie.accept}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Qualified investor gate modal */}
      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{lang === 'en' ? 'Restricted Materials' : 'Tài liệu hạn chế'}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {lang === 'en'
                ? 'Access to research and LP materials is restricted to institutional/professional investors. Please self-attest your status to proceed.'
                : 'Quyền truy cập nghiên cứu và tài liệu nhà đầu tư bị giới hạn cho nhà đầu tư tổ chức/chuyên nghiệp. Vui lòng tự xác nhận tư cách để tiếp tục.'}
            </p>
            <div className="space-y-2 text-sm text-slate-700 mb-4">
              <label className="flex items-start gap-2"><input type="checkbox" className="mt-1"/> <span>{lang==='en'?'I am an institutional/professional investor and not a retail investor.':'Tôi là nhà đầu tư tổ chức/chuyên nghiệp và không phải nhà đầu tư cá nhân.'}</span></label>
              <label className="flex items-start gap-2"><input type="checkbox" className="mt-1"/> <span>{lang==='en'?'I understand this is not an offer or solicitation.':'Tôi hiểu đây không phải lời mời chào hay chào bán.'}</span></label>
              <label className="flex items-start gap-2"><input type="checkbox" className="mt-1"/> <span>{lang==='en'?'I agree that access may be limited by jurisdiction.':'Tôi đồng ý rằng quyền truy cập có thể bị giới hạn theo khu vực pháp lý.'}</span></label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowGate(false)} className="px-4 py-2 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50">{lang==='en'?'Cancel':'Hủy'}</button>
              <button onClick={() => { setShowGate(false); }} className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800">{lang==='en'?'Proceed':'Tiếp tục'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Legal docs modal */}
      {showLegalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-900 capitalize">{showLegalDoc}</h3>
              <button onClick={() => setShowLegalDoc(null)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <div className="prose prose-slate max-w-none text-sm text-slate-700">
              {showLegalDoc === 'privacy' && (
                <div>
                  <p>{lang==='en' ? 'We collect minimal personal information necessary to respond to institutional inquiries. We do not sell personal data. See email for unsubscribe/rights.' : 'Chúng tôi chỉ thu thập thông tin cần thiết để phản hồi yêu cầu từ nhà đầu tư tổ chức. Chúng tôi không bán dữ liệu cá nhân. Xem email để hủy đăng ký/quyền của bạn.'}</p>
                </div>
              )}
              {showLegalDoc === 'terms' && (
                <div>
                  <p>{lang==='en' ? 'Use of this site constitutes acceptance of the Important Information. Content is provided “as is”, for informational purposes only, and may be restricted by jurisdiction.' : 'Việc sử dụng trang web đồng nghĩa chấp nhận Thông tin quan trọng. Nội dung cung cấp “như hiện có”, chỉ nhằm mục đích thông tin và có thể bị hạn chế theo khu vực pháp lý.'}</p>
                </div>
              )}
              {showLegalDoc === 'disclosures' && (
                <div>
                  <p>{lang==='en' ? 'Any references to performance are illustrative or backtested unless otherwise noted. Future availability of products is subject to licensing and regulatory approvals.' : 'Mọi tham chiếu đến hiệu suất đều minh họa hoặc backtest trừ khi có ghi chú khác. Việc cung cấp sản phẩm trong tương lai phụ thuộc vào giấy phép và phê duyệt pháp lý.'}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowLegalDoc(null)} className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800">{lang==='en'?'Close':'Đóng'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional inquiry modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{lang==='en'?'Institutional Inquiry':'Yêu cầu thông tin (Tổ chức)'}</h3>
            <form onSubmit={(e)=>{e.preventDefault(); setShowInquiry(false); alert(lang==='en'?'Thank you — we will reach out shortly.':'Cảm ơn — chúng tôi sẽ phản hồi sớm.');}} className="space-y-3">
              <input required type="email" placeholder={t.contact.emailPlaceholder} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
              <select required className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900">
                <option value="">{lang==='en'?'Investor Type':'Loại nhà đầu tư'}</option>
                <option>Institutional allocator</option>
                <option>Family office</option>
                <option>HF/FOF</option>
                <option>Consultant</option>
                <option>{lang==='en'?'Other (professional)':'Khác (chuyên nghiệp)'}</option>
              </select>
              <select required className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900">
                <option value="">{lang==='en'?'Jurisdiction':'Khu vực pháp lý'}</option>
                <option>VN</option>
                <option>SG</option>
                <option>HK</option>
                <option>US</option>
                <option>EU/UK</option>
              </select>
              <textarea rows={4} placeholder={lang==='en'?'Objectives / Notes (optional)':'Mục tiêu / Ghi chú (tùy chọn)'} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"/>
              <label className="flex items-start gap-2 text-sm text-slate-700"><input required type="checkbox" className="mt-1"/> <span>{lang==='en'?'I am a professional/institutional investor.':'Tôi là nhà đầu tư chuyên nghiệp/tổ chức.'}</span></label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setShowInquiry(false)} className="px-4 py-2 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50">{lang==='en'?'Cancel':'Hủy'}</button>
                <button type="submit" className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800">{lang==='en'?'Submit':'Gửi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

