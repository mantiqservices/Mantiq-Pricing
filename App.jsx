import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- INLINE SVG ICONS (Replacing lucide-react to ensure 0% load failure) ---
const Icons = {
  ChevronDown: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
  ),
  Layout: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ),
  Smartphone: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
  ),
  Database: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
  ),
  Users: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Check: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
  ),
  Copy: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Download: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
  ),
  Send: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  X: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  TrendingUp: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  CheckCircle: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  )
};

// --- DATA STRUCTURE ---
const PRODUCT_DATA = {
  "Business Systems": {
    "Company Profile or Services": {
      "crm": { name: "CRM Tracker", fixed: 8000, modules: { "Leads": 1500, "Customers": 1500, "Contacts": 1000, "Deals": 2000, "Pipeline": 1000, "Activities": 2300, "Reports": 3000, "Chats": 8000 } },
      "hr": { name: "HR Tracker", fixed: 8000, modules: { "Employees": 2000, "Attendance": 4000, "Leaves": 3000, "Payroll": 7000, "Recruitment": 4000, "Reports": 3000 } },
      "finance": { name: "Finance Tracker", fixed: 7000, modules: { "Invoices": 3000, "Bills": 1800, "Payments": 1200, "Cash Flow": 5000, "Reports": 5000 } },
      "sales": { name: "Sales Tracker", fixed: 5000, modules: { "Opportunities": 2000, "Quotations": 1800, "Orders": 1500, "Products": 1500, "BI Reports": 3000 } }
    }
  },
  "Websites": {
    "Company Profile or Services": {
      "starter": { 
        name: "1. Basic Website – Starter", 
        fixed: "15,000 – 25,000", 
        modules: { "Up to 5 Pages": 0, "Responsive UI": 0, "Contact Form": 0, "Google Maps": 0, "Social Links": 0, "Basic SEO": 0, "Speed Opt": 0 } 
      },
      "business": { 
        name: "2. Business Website – Company Profile", 
        fixed: "35,000 – 60,000", 
        modules: { "Up to 10 Pages": 0, "Custom UI Design": 0, "Portfolio Section": 0, "Blog/News Page": 0, "Inquiry Forms": 0, "Social Integration": 0, "SEO Optimization": 0, "Performance Opt": 0, "Admin Panel": 0 } 
      },
      "advanced": { 
        name: "3. Advanced Website – Service Platform", 
        fixed: "60,000 – 120,000", 
        modules: { "Up to 15 Pages": 0, "Custom Design": 0, "Blog System": 0, "User Accounts": 0, "Chat/Messaging": 0, "API Integrations": 0, "CMS Dashboard": 0, "Analytics Dash": 0, "Advanced SEO": 0 } 
      }
    },
    "E-Commerce": {
      "standard_shop": { 
        name: "4. Standard Online Store", 
        fixed: "75,000 – 125,000", 
        modules: { "Product Catalog": 0, "Categories/Filters": 0, "Shopping Cart": 0, "Checkout System": 0, "Payment Gateway": 0, "Order Mgmt": 0, "Customer Accounts": 0, "Admin Dash": 0, "Promo Codes": 0 } 
      },
      "advanced_shop": { 
        name: "5. Advanced E-Commerce Platform", 
        fixed: "125,000 – 250,000", 
        modules: { "Everything in Standard": 0, "Multi-vendor Support": 0, "Inventory Mgmt": 0, "Sales Reports": 0, "Marketing Tools": 0, "Discount Systems": 0, "Advanced Analytics": 0, "Mobile Opt": 0, "API integrations": 0 } 
      }
    }
  },
  "Mobile Applications": {
    "Company Profile or Services": {
      "starter": { 
        name: "Starter Tier", 
        fixed: "40,000 - 60,000", 
        modules: { "5-7 Screens": 0, "Android or iOS": 0, "Basic UI": 0, "Login/Registration": 0, "Simple DB": 0, "Push Notify": 0, "Store Submit": 0 } 
      },
      "growth": { 
        name: "Growth Tier", 
        fixed: "70,000 - 110,000", 
        modules: { "10-15 Screens": 0, "Android + iOS": 0, "Custom UI/UX": 0, "User Accounts": 0, "Admin Dash": 0, "API Sync": 0, "Analytics": 0, "Push": 0 } 
      },
      "premium": { 
        name: "Premium Tier", 
        fixed: "130,000 - 200,000+", 
        modules: { "20+ Screens": 0, "Android + iOS": 0, "Advanced UI/UX": 0, "Payment Gate": 0, "Real-time Features": 0, "Admin Panel": 0, "Security": 0, "3mo Support": 0 } 
      }
    },
    "E-Commerce": {
      "basic_shop": { 
        name: "Basic Store App", 
        fixed: "80,000 - 105,000", 
        modules: { "Android or iOS": 0, "Product Catalog": 0, "Categories": 0, "Product Details": 0, "Cart/Checkout": 0, "Payment Gate": 0, "Order Mgmt": 0, "Push": 0 } 
      },
      "premium_shop": { 
        name: "Premium E-Commerce", 
        fixed: "105,000 - 150,000", 
        modules: { "Android + iOS": 0, "Advanced Filters": 0, "Multi-Payment": 0, "Customer Accounts": 0, "Wishlist": 0, "Tracking": 0, "Admin Dash": 0, "Promo/Coupons": 0, "Analytics": 0 } 
      },
      "enterprise_shop": { 
        name: "Super Marketplace", 
        fixed: "150,000 - 250,000+", 
        modules: { "Vendor Engine": 0, "Financial Split": 0, "Global Scale": 0, "Personalization": 0 } 
      }
    }
  },
  "Business Development": {
    "Company Profile or Services": {
      "starter": { name: "Starter Strategy", fixed: "15,000 - 25,000", modules: { "Market Analysis": 0, "Growth Roadmap": 0, "Digital Audit": 0 } },
      "advanced": { name: "Advanced Expansion", fixed: "25,000 - 40,000", modules: { "Sales Funnels": 0, "Lead Gen Setup": 0, "Workflow Automations": 0 } },
      "corporate": { name: "Enterprise Growth", fixed: "50,000+", modules: { "Change Mgmt": 0, "Process Engineering": 0, "Global Scalability": 0 } }
    }
  }
};

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxv09A4YstU_u6tg5o2kyITwe42AAJg0d2bEVn7GEzdeOvbth4PdBq0mCWjSeVry3Vymw/exec';

// --- CUSTOM DROPDOWN COMPONENT ---

const CustomDropdown = ({ options, selected, onSelect, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-4 bg-white border-2 rounded-2xl cursor-pointer transition-all ${isOpen ? 'border-sky-500 ring-4 ring-sky-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
      >
        <span className={`text-sm font-bold truncate ${selected ? 'text-slate-900' : 'text-slate-400'}`}>
          {selected ? selected : placeholder}
        </span>
        <Icons.ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              className="p-4 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 cursor-pointer border-b border-slate-50 last:border-0"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [service, setService] = useState(null);
  const [type, setType] = useState(null);
  const [tier, setTier] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [users, setUsers] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false);

  const pngTemplateRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.onload = () => setHtml2canvasLoaded(true);
    document.head.appendChild(script);

    const handleContext = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, []);

  const { oneTime, quarterly, featuresList } = useMemo(() => {
    if (!service || !tier || (!type && service !== "Business Development")) {
      return { oneTime: "0", quarterly: "0", featuresList: [] };
    }

    const lookupType = (service === "Business Systems" || service === "Business Development") ? "Company Profile or Services" : type;
    const typeGroup = PRODUCT_DATA[service]?.[lookupType];
    if (!typeGroup) return { oneTime: "0", quarterly: "0", featuresList: [] };
    
    const prod = typeGroup[tier];
    if (!prod) return { oneTime: "0", quarterly: "0", featuresList: [] };
    
    let otVal = "";
    let qVal = "";
    let activeModules = [];

    if (service === "Business Systems") {
      const mult = type === 'Online Store' ? 0.6 : 1.0;
      let numericOt = (typeof prod.fixed === 'number' ? prod.fixed : 0) * mult;
      
      selectedModules.forEach(modName => {
        numericOt += prod.modules[modName] || 0;
        activeModules.push(modName);
      });
      
      otVal = numericOt.toLocaleString();
      qVal = (users * 200).toLocaleString();
    } else {
      activeModules = Object.keys(prod.modules || {});
      otVal = (prod.fixed || "0").replace(/[–—]/g, '-');
      
      if (service === "Websites" || service === "Mobile Applications") {
        const clean = (v) => parseFloat(String(v).replace(/,/g, '').replace(/\+/g, '').replace(/[\-–—].*/, '')) || 0;
        const cleanMax = (v) => {
          const split = String(v).split(/[\-–—]/);
          if (split.length < 2) return clean(v);
          return parseFloat(split[1].trim().replace(/,/g, '').replace(/\+/g, '')) || 0;
        };

        const minQ = Math.round(clean(prod.fixed) * 0.05);
        const maxQ = Math.round(cleanMax(prod.fixed) * 0.05);
        
        if (String(prod.fixed).includes('-') || String(prod.fixed).includes('–')) {
          qVal = `${minQ.toLocaleString()} - ${maxQ.toLocaleString()}`;
        } else {
          qVal = minQ.toLocaleString();
        }
        if (String(prod.fixed).includes('+')) qVal += '+';
      } else {
        qVal = "0";
      }
    }

    return { oneTime: otVal, quarterly: qVal, featuresList: activeModules };
  }, [service, type, tier, selectedModules, users]);

  const handleServiceSelect = (val) => {
    setService(val);
    setType(null);
    setTier(null);
    setSelectedModules([]);
    if (val === "Business Development") setType("Company Profile or Services");
  };

  const handleTypeSelect = (val) => {
    setType(val);
    setTier(null);
    setSelectedModules([]);
  };

  const handleTierSelect = (val) => {
    const lookupType = (service === "Business Systems" || service === "Business Development") ? "Company Profile or Services" : type;
    const group = PRODUCT_DATA[service][lookupType];
    const key = Object.keys(group).find(k => group[k].name === val);
    setTier(key);
    setSelectedModules([]);
  };

  const toggleModule = (mod) => {
    setSelectedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const copyToClipboard = () => {
    const lookupType = (service === "Business Systems" || service === "Business Development") ? "Company Profile or Services" : type;
    const tierName = PRODUCT_DATA[service]?.[lookupType]?.[tier]?.name || "N/A";
    const text = `MANTIQ BUSINESS QUOTE\nService: ${service}\nTier: ${tierName}\nOne-time: ${oneTime} EGP\nQuarterly: ${quarterly} EGP`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const exportPNG = async () => {
    if (!html2canvasLoaded || !window.html2canvas || !pngTemplateRef.current) return;
    try {
      const canvas = await window.html2canvas(pngTemplateRef.current, { backgroundColor: '#101828', scale: 2 });
      const link = document.createElement('a');
      link.download = `MANTIQ-Quote-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const lookupType = (service === "Business Systems" || service === "Business Development") ? "Company Profile or Services" : type;
    const tierName = PRODUCT_DATA[service]?.[lookupType]?.[tier]?.name || "N/A";

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      service,
      type: type || 'N/A',
      tier: tierName,
      features: featuresList.join(', '),
      oneTime,
      quarterly
    };

    try {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, val]) => params.append(key, val));
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        cache: 'no-cache',
        body: params.toString() 
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTierName = useMemo(() => {
    const lookupType = (service === "Business Systems" || service === "Business Development") ? "Company Profile or Services" : type;
    return PRODUCT_DATA[service]?.[lookupType]?.[tier]?.name;
  }, [service, type, tier]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 md:px-8 lg:px-12 py-8 overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Fixed Mobile Bottom Total Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-slate-900/98 backdrop-blur-xl border border-white/10 p-4 rounded-3xl z-[100] flex items-center justify-between shadow-2xl">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[7px] text-slate-400 font-black tracking-widest uppercase mb-0.5">Estimated Total</span>
          <div className="text-white font-black text-lg truncate leading-none">
            {oneTime} <span className="text-[10px] text-sky-400">EGP</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => document.getElementById('summary-card').scrollIntoView({ behavior: 'smooth' })}
            className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Icons.ChevronDown size={20} />
          </button>
          <button 
            disabled={!tier}
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
          >
            Request
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-slate-200 pb-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">MANTIQ</h1>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.4em] mt-2">For Business Services</p>
          </div>
          <div className="hidden sm:block text-right">
            <h2 className="text-xl font-extrabold text-slate-800">System Configurator</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Strategic Investment Breakdown</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20 md:mb-0">
          
          <div className="lg:col-span-2 space-y-8">
            
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                  <Icons.Layout size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-none">Service Category</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Initial Selection</p>
                </div>
              </div>
              <CustomDropdown 
                placeholder="-- Select Category --"
                options={Object.keys(PRODUCT_DATA)}
                selected={service}
                onSelect={handleServiceSelect}
              />
            </section>

            {service && service !== "Business Development" && (
              <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                    <Icons.Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 leading-none">Project Focus</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Industry Specifics</p>
                  </div>
                </div>
                <CustomDropdown 
                  placeholder="-- Select Focus --"
                  options={
                    service === "Business Systems" 
                    ? ["Online Store", "Start-up Company", "Corporate"] 
                    : ["Company Profile or Services", "E-Commerce"]
                  }
                  selected={type}
                  onSelect={handleTypeSelect}
                />
              </section>
            )}

            <section className={`bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 ${(!service || (!type && service !== "Business Development")) ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                  <Icons.Database size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-none">Package Tier</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Scale of Service</p>
                </div>
              </div>
              <CustomDropdown 
                placeholder="-- Choose System Tier --"
                options={service && (type || service === "Business Development") ? Object.keys(PRODUCT_DATA[service][service === "Business Systems" || service === "Business Development" ? "Company Profile or Services" : type] || {}).map(k => PRODUCT_DATA[service][service === "Business Systems" || service === "Business Development" ? "Company Profile or Services" : type][k].name) : []}
                selected={currentTierName}
                onSelect={handleTierSelect}
              />
            </section>

            <section className={`bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 ${!tier ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                  <Icons.CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-none">Strategic Features</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Module Customization</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tier && Object.keys(PRODUCT_DATA[service][service === "Business Systems" || service === "Business Development" ? "Company Profile or Services" : type][tier]?.modules || {}).map((mod, i) => (
                  <button
                    key={i}
                    onClick={() => service === "Business Systems" && toggleModule(mod)}
                    className={`p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all h-20 flex items-center justify-center text-center
                      ${service === "Business Systems" 
                        ? (selectedModules.includes(mod) ? 'bg-sky-500 border-sky-500 text-white shadow-lg active:scale-95' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 active:scale-95') 
                        : 'bg-sky-50 border-sky-100 text-sky-600 pointer-events-none'}`}
                  >
                    {service !== "Business Systems" && <Icons.Check size={12} className="mr-1 inline" />} {mod}
                  </button>
                ))}
              </div>
            </section>

            {service === "Business Systems" && (
              <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                    <Icons.Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 leading-none">System Users</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Active Licenses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 flex items-center justify-between">
                    <button onClick={() => setUsers(Math.max(1, users - 1))} className="w-12 h-12 bg-white rounded-xl shadow-sm font-black text-xl hover:bg-slate-50 transition-colors">-</button>
                    <span className="text-4xl font-black text-slate-900">{users}</span>
                    <button onClick={() => setUsers(users + 1)} className="w-12 h-12 bg-white rounded-xl shadow-sm font-black text-xl hover:bg-slate-50 transition-colors">+</button>
                  </div>
                </div>
              </section>
            )}

          </div>

          <div className="lg:col-span-1" id="summary-card">
            <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[3rem] sticky top-8 shadow-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_#00aeef]" />
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Project Breakdown</span>
              </div>

              <div className="space-y-6 mb-12 min-h-[120px]">
                {!tier ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <Icons.TrendingUp size={32} className="mb-4" />
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.2em]">Awaiting selection</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in duration-700">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest group">
                      <span className="text-slate-500">Category</span>
                      <span className="text-slate-200 text-right ml-2">{service}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-5">
                      <span className="text-slate-500">Selected Tier</span>
                      <span className="text-sky-400 text-right max-w-[60%] leading-relaxed">{currentTierName}</span>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <span className="text-slate-500 text-[9px] uppercase font-black tracking-widest block mb-4">Implementation Scope:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {featuresList.map((f, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-300 text-[8px] px-2.5 py-1 rounded-md border border-white/10 uppercase font-black tracking-tighter">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-white/5 p-7 rounded-[2rem] border border-white/10 group hover:border-sky-500/50 transition-colors">
                  <span className="text-sky-400 text-[9px] font-black uppercase tracking-[0.4em] block mb-3">One-Time Total</span>
                  <div className="text-3xl font-black flex items-baseline gap-1.5">
                    {oneTime} <span className="text-xs text-slate-500 font-bold tracking-widest">EGP</span>
                  </div>
                </div>
                
                <div className="px-7">
                  <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.4em] block mb-3">Quarterly Service</span>
                  <div className="text-xl font-bold text-slate-300 flex items-baseline gap-1.5">
                    {quarterly} <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">EGP</span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button 
                    disabled={!tier}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-white text-slate-900 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-sky-50 active:scale-95 transition-all"
                  >
                    <Icons.Send size={16} /> Send Inquiry
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={copyToClipboard} className="bg-slate-800/50 text-slate-400 py-4 rounded-xl text-[9px] uppercase font-black tracking-widest border border-white/5 hover:text-white transition-colors active:bg-slate-800">
                      <Icons.Copy size={12} className="inline mr-1" /> Copy
                    </button>
                    <button onClick={exportPNG} className="bg-slate-800/50 text-slate-400 py-4 rounded-xl text-[9px] uppercase font-black tracking-widest border border-white/5 hover:text-white transition-colors active:bg-slate-800">
                      <Icons.Download size={12} className="inline mr-1" /> PNG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 transition-colors">
              <Icons.X size={24} />
            </button>
            
            {!isSubmitted ? (
              <>
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Ready to<br/>Transform?</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Submit configuration to MANTIQ</p>
                </div>
                <form onSubmit={submitInquiry} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
                    <input name="name" required placeholder="Full Name" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input name="phone" required type="tel" placeholder="+20..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                    <input name="email" required type="email" placeholder="email@company.com" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all mt-6"
                  >
                    {isSubmitting ? 'Transmitting...' : 'Submit Now'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in zoom-in-90 duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Icons.CheckCircle size={48} strokeWidth={2.5} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Transmission Successful</h4>
                <p className="text-slate-500 mt-4 font-medium leading-relaxed">Your project configuration has been saved. Our technical strategy team will contact you shortly.</p>
                <button onClick={() => setIsModalOpen(false)} className="mt-10 px-8 py-3 bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HIDDEN PNG CAPTURE TEMPLATE */}
      <div ref={pngTemplateRef} className="p-16 text-white bg-slate-950 w-[800px] absolute -left-[9999px]">
        <div className="mb-14 flex justify-between items-start">
          <div>
            <h1 className="text-6xl font-black tracking-tighter">MANTIQ</h1>
            <p className="text-sky-400 font-bold text-sm uppercase tracking-[0.5em] mt-3">Strategic Technical Investment</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Generated On</div>
            <div className="text-xs font-bold">{new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div className="space-y-8 mb-16">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Service Category</div>
              <div className="text-xl font-black text-white">{service}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">System Tier</div>
              <div className="text-xl font-black text-sky-400 leading-tight">{currentTierName}</div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10">
            <span className="text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] mb-5 block">Implementation Scope & Modules:</span>
            <div className="flex flex-wrap gap-2.5">
              {featuresList.map((f, i) => (
                <span key={i} className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-200 tracking-tight">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-16 space-y-10">
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-sky-400 text-[10px] font-black uppercase tracking-[0.5em] block mb-4">Total One-Time Investment</span>
              <div className="text-6xl font-black flex items-baseline gap-2">
                {oneTime} <span className="text-xl opacity-20 font-bold uppercase tracking-widest">EGP</span>
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-12">
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] block mb-4">Quarterly Service</span>
               <div className="text-3xl font-black text-slate-200 flex items-baseline gap-2 justify-end">
                {quarterly} <span className="text-sm opacity-20 font-bold uppercase tracking-widest">EGP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-between items-center text-[10px] text-slate-700 font-black uppercase tracking-widest">
          <div>© {new Date().getFullYear()} MANTIQ BUSINESS SERVICES</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
            Official Quotation Configurator
          </div>
        </div>
      </div>

    </div>
  );
}
