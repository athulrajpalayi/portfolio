export type Capability = {
  title: string;
  description: string;
  icon: "workflow" | "sparkles" | "shield" | "cloud" | "smartphone" | "database";
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type CaseStudyStep = {
  title: string;
  detail: string;
};

export type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  domain: string;
  tags: string[];
  metrics: ProjectMetric[];
  featuredLabel: string;
  challenge: string;
  architecture: string[];
  solution: string[];
  outcomes: string[];
  tools: string[];
  timeline: CaseStudyStep[];
};

export type SystemNode = {
  title: string;
  label: string;
  caption: string;
};

export type AppCardItem = {
  title: string;
  value: string;
  tag: string;
  icon: "phone" | "droplets" | "file-text" | "palette" | "globe" | "message-circle" | "bell" | "calculator" | "image" | "video";
};

export type MarketingContent = {
  site: {
    displayName: string;
    monogram: string;
    navBadge: string;
    roleLabel: string;
    location: string;
    resumePath: string;
    domain: string;
    serverIp: string;
    footerNote: string;
    copyright: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    headlineAccent: string;
    subtitle: string;
    intro: string;
    chips: string[];
    statusLabel: string;
  };
  capabilities: Capability[];
  featuredProjects: FeaturedProject[];
  systemsFlow: SystemNode[];
  apps: AppCardItem[];
  contact: {
    title: string;
    description: string;
    email: string;
    whatsapp: string;
    linkedin: string;
  };
};

export const marketingContent: MarketingContent = {
  site: {
    displayName: "Athulraj Palayi",
    monogram: "AP",
    navBadge: "Cyber | AI | Builder",
    roleLabel: "Ethical Hacker · Cybersecurity Specialist · AI Product Builder",
    location: "Dubai, UAE",
    resumePath: "/athulraj-palayi-resume.txt",
    domain: "athulrajpalayi.com",
    serverIp: "5.223.63.213",
    footerNote: "Built with AI-assisted development, security thinking, and practical product design.",
    copyright: "Copyright 2026 Athulraj Palayi",
  },

  hero: {
    eyebrow: "Ethical Hacker · Cybersecurity Specialist · AI Product Builder",
    title: "Athulraj Palayi",
    headlineAccent: "I build secure, practical, and AI-assisted digital systems.",
    subtitle: "Cybersecurity · Ethical Hacking · AI Products · Automation · Android & Web Apps",
    intro: "I specialize in cybersecurity, ethical hacking, system testing, automation, and AI-assisted product development. My work focuses on building secure, useful, and practical digital solutions that solve real business problems.",
    chips: ["CEH v10", "Ethical Hacker", "Dubai, UAE"],
    statusLabel: "Open to security and product opportunities",
  },

  capabilities: [
    {
      title: "Cybersecurity & Ethical Hacking",
      description: "Web app testing, vulnerability assessment, API security testing, OWASP Top 10 awareness, reconnaissance, and responsible penetration testing workflows.",
      icon: "shield",
    },
    {
      title: "AI-Assisted Development",
      description: "Using Claude, ChatGPT, and prompt engineering to plan features, generate code, debug, and ship practical products faster without losing product logic or testing discipline.",
      icon: "sparkles",
    },
    {
      title: "Android & Web App Building",
      description: "Building Android apps, Next.js web platforms, admin panels, and dashboards using modern development workflows and AI-accelerated tooling.",
      icon: "smartphone",
    },
    {
      title: "Business Automation",
      description: "ERP API integration, Excel and Google Sheets automation, WhatsApp marketing automation, document collection systems, and cost calculation tools for real business workflows.",
      icon: "workflow",
    },
    {
      title: "API & Platform Integration",
      description: "Meta WhatsApp Cloud API, ERP APIs, Supabase, Node.js backends, and custom integration layers connecting business platforms and data flows.",
      icon: "database",
    },
    {
      title: "Desktop & Windows Tools",
      description: "Building Windows utility apps, desktop productivity tools, and lightweight software with clean interfaces and practical use cases for daily work.",
      icon: "cloud",
    },
  ],

  featuredProjects: [
    {
      slug: "colorvision-web-app",
      title: "ColorVision — Automotive Color Formula Platform",
      summary: "Developed a professional automotive color mixing platform with 120,000 formulas, toner-based search, OEM brand references, and formula cost calculation.",
      domain: "Web Application",
      tags: ["Next.js", "Database", "Formula Search", "Automotive", "Cost Calculation"],
      featuredLabel: "Web App",
      metrics: [
        { label: "Color formulas", value: "120,000+" },
        { label: "OEM brands", value: "Multiple" },
        { label: "Search types", value: "Toner · OEM · Count" },
      ],
      challenge: "Automotive paint professionals often need to find formulas based on toner availability and cost. ColorVision helps them quickly identify possible formulas, compare toner usage, and calculate mixing cost.",
      architecture: [
        "Next.js frontend with Tailwind CSS",
        "Formula database with multi-field search index",
        "Toner availability filtering engine",
        "Dynamic cost calculator using user-entered toner prices",
      ],
      solution: [
        "Built a searchable database platform for 120,000 automotive color formulas.",
        "Implemented toner availability filtering so professionals find usable formulas.",
        "Added OEM car brand reference system for cross-checking.",
        "Designed a cost calculator where users input toner prices to get real mixing costs.",
      ],
      outcomes: [
        "Paint professionals can find formulas in seconds instead of flipping through binders.",
        "Toner-based filtering surfaces only formulas possible with available materials.",
        "Mixing cost calculation helps with pricing and purchasing decisions.",
      ],
      tools: ["Next.js", "Tailwind CSS", "Database Search", "AI-assisted Development"],
      timeline: [
        { title: "Formula database", detail: "Structured and indexed 120,000 automotive color formulas." },
        { title: "Search engine", detail: "Built toner availability and OEM brand filtering." },
        { title: "Cost calculator", detail: "Added per-toner price input and formula cost output." },
        { title: "UI design", detail: "Clean professional interface designed for paint shop daily use." },
      ],
    },
    {
      slug: "whatsapp-automation-platform",
      title: "WhatsApp Automation Platform",
      summary: "Created a WhatsApp marketing automation web app for bulk messaging, scheduled campaigns, customer list uploads, Meta API integration, and reply management.",
      domain: "Business Automation",
      tags: ["Next.js", "Meta WhatsApp API", "Supabase", "Campaign Management", "SaaS"],
      featuredLabel: "Automation",
      metrics: [
        { label: "API used", value: "Meta WhatsApp Cloud" },
        { label: "Bulk upload", value: "Large customer lists" },
        { label: "Automation type", value: "Scheduled campaigns" },
      ],
      challenge: "Businesses often need an affordable and customizable way to send WhatsApp campaigns, manage customers, and handle replies. This app provides a custom-built platform for those workflows.",
      architecture: [
        "Next.js frontend with SaaS-style campaign dashboard",
        "Supabase database for contacts and campaign records",
        "Meta WhatsApp Cloud API for template message delivery",
        "Campaign scheduler with message status tracking",
      ],
      solution: [
        "Built a campaign dashboard for creating and scheduling WhatsApp message campaigns.",
        "Integrated Meta WhatsApp Cloud API for template message delivery.",
        "Added bulk customer list upload with contact management.",
        "Designed a reply inbox for managing customer responses.",
      ],
      outcomes: [
        "Businesses can run WhatsApp campaigns without expensive third-party tools.",
        "Customer communication is centralized in one dashboard.",
        "Scheduled campaigns reduce manual sending overhead.",
      ],
      tools: ["Next.js", "Tailwind CSS", "Supabase", "Meta WhatsApp Cloud API", "Node.js", "AI-assisted Development"],
      timeline: [
        { title: "API integration", detail: "Connected Meta WhatsApp Cloud API for template messaging." },
        { title: "Customer management", detail: "Built bulk upload and contact list system." },
        { title: "Campaign builder", detail: "Designed campaign creation and scheduling workflow." },
        { title: "Reply inbox", detail: "Added incoming message management interface." },
      ],
    },
    {
      slug: "document-collection-automation",
      title: "Document Collection Automation System",
      summary: "Built an HR document collection automation system that generates unique upload links, organizes employee documents into structured folders, tracks submission status, and generates Excel reports.",
      domain: "HR Automation",
      tags: ["Web App", "Admin Panel", "Excel Reports", "HR", "File Automation"],
      featuredLabel: "HR Tool",
      metrics: [
        { label: "Upload method", value: "Unique per-employee links" },
        { label: "Folder automation", value: "Project · Position · Name" },
        { label: "Reports", value: "Excel export" },
      ],
      challenge: "HR document collection is often manual, messy, and difficult to track. This system automates upload links, document storage, folder organization, file naming, status tracking, and reporting.",
      architecture: [
        "Web app with unique URL-based upload flow per employee",
        "Admin backend for defining projects, positions, and document naming rules",
        "Automatic folder creation based on project, position, and employee name",
        "Excel report generation for HR submission status tracking",
      ],
      solution: [
        "Built a unique link generator based on project, employee name, and position.",
        "Implemented partial submission support — employees can save progress and return later.",
        "Created automatic folder naming and organization controlled from the admin backend.",
        "Added an HR dashboard showing each employee's submission status at a glance.",
      ],
      outcomes: [
        "Document collection is consistent, named correctly, and organized without HR manual effort.",
        "HR can monitor submission status and follow up only where needed.",
        "Excel reports give leadership visibility into onboarding and visa document readiness.",
      ],
      tools: ["Web App Framework", "Admin Panel", "File Upload System", "Excel Report Generation", "AI-assisted Development"],
      timeline: [
        { title: "Link generator", detail: "Built unique upload link system per project and employee." },
        { title: "Upload flow", detail: "Designed partial submission with save-and-continue support." },
        { title: "Folder automation", detail: "Auto-create project and position folders with controlled naming." },
        { title: "HR dashboard", detail: "Added submission tracking and Excel report export." },
      ],
    },
    {
      slug: "erp-zoho-zatca-integration",
      title: "ERP to Zoho ZATCA Compliance Integration",
      summary: "Designed and built an ERP-to-Zoho API integration for ZATCA e-invoicing compliance — any invoice created on the company ERP automatically passes through Zoho and submits to the ZATCA portal without manual steps.",
      domain: "Systems Integration",
      tags: ["ERP API", "Zoho", "ZATCA", "E-Invoicing", "Compliance"],
      featuredLabel: "Integration",
      metrics: [
        { label: "Invoice flow", value: "ERP → Zoho → ZATCA" },
        { label: "Manual steps", value: "Zero after setup" },
        { label: "Compliance", value: "ZATCA e-invoicing" },
      ],
      challenge: "Saudi Arabia's ZATCA regulation requires all company invoices to be submitted electronically. The company ERP generated invoices but had no automated path to the ZATCA portal.",
      architecture: [
        "Company ERP as invoice source of record",
        "ERP API for extracting invoice fields and details",
        "Zoho Deluge code for payload transformation and formatting",
        "Zoho integration layer for ZATCA portal submission",
      ],
      solution: [
        "Analyzed the company ERP API to identify invoice fields required by ZATCA.",
        "Wrote Zoho Deluge code to receive ERP invoice data and transform it to ZATCA format.",
        "Wired the ERP API trigger so every new invoice automatically flows into Zoho.",
        "Tested the full pipeline end-to-end for ZATCA compliance accuracy.",
      ],
      outcomes: [
        "Every ERP invoice is automatically submitted to ZATCA without any manual effort.",
        "Company meets Saudi Arabia e-invoicing compliance requirements.",
        "Finance team has confidence that all invoices are correctly reported on time.",
      ],
      tools: ["ERP API", "Zoho Deluge", "Zoho Creator", "API Integration"],
      timeline: [
        { title: "ERP API analysis", detail: "Identified required invoice fields and API access pattern." },
        { title: "Zoho code", detail: "Wrote Deluge code for data transformation and ZATCA submission." },
        { title: "Integration wiring", detail: "Connected ERP invoice trigger to Zoho automatically." },
        { title: "End-to-end testing", detail: "Validated complete invoice pipeline for ZATCA compliance." },
      ],
    },
  ],

  systemsFlow: [
    {
      title: "Problem & Idea",
      label: "Discovery",
      caption: "Identify the real-world problem, map the workflow, and define exactly what needs to be built.",
    },
    {
      title: "AI Planning",
      label: "Design with AI",
      caption: "Use Claude, ChatGPT, and prompt engineering to structure the workflow, plan features, and draft the first version.",
    },
    {
      title: "Build & Develop",
      label: "Development",
      caption: "Code with Next.js, Node.js, Android tools, or Excel/API automation depending on the project type.",
    },
    {
      title: "Security Review",
      label: "Hardening",
      caption: "Apply ethical hacking awareness — authentication, access control, input validation, and OWASP-aligned testing.",
    },
    {
      title: "Deploy & Test",
      label: "Ship",
      caption: "Docker VPS deployment, APK distribution, or client-ready Windows tool delivery with real-world testing.",
    },
    {
      title: "Improve & Iterate",
      label: "Optimize",
      caption: "Gather user feedback, identify friction points, and continuously improve the product based on real use.",
    },
  ],

  apps: [
    {
      title: "Portfolio Platform",
      value: "Secure dynamic portfolio with admin panel and two-factor authentication. Update content without touching code.",
      tag: "Web Platform",
      icon: "globe",
    },
    {
      title: "WaterBuddy Android App",
      value: "Android hydration reminder app with custom reminders, partner connection, mood replies, and shared wellness goals.",
      tag: "Android App",
      icon: "droplets",
    },
    {
      title: "PDF Tools Android App",
      value: "All-in-one Android PDF utility for editing, converting, adding text, password protection, and document tools.",
      tag: "Android App",
      icon: "file-text",
    },
    {
      title: "WhatsApp Buddy Bot",
      value: "WhatsApp reminder bot that sends random cute messages from a collection of 500 custom messages at scheduled intervals.",
      tag: "Automation Bot",
      icon: "message-circle",
    },
    {
      title: "Water Reminder Windows",
      value: "Cute desktop hydration reminder app with pill-shaped top-screen notification popups.",
      tag: "Windows App",
      icon: "bell",
    },
    {
      title: "Excel Cost Calculator",
      value: "ERP API-connected Excel costing system that automatically updates raw material prices and product cost calculations.",
      tag: "Business Tool",
      icon: "calculator",
    },
    {
      title: "Background Remover",
      value: "Windows image background remover software using BGRRemove API for quick image editing.",
      tag: "Windows Tool",
      icon: "image",
    },
    {
      title: "AI CEO Journey Video",
      value: "Produced a complete 5-minute AI-powered corporate storytelling video using ChatGPT, Nano Banana Pro, and Seedance from script to final visual output.",
      tag: "AI Creative",
      icon: "video",
    },
  ],

  contact: {
    title: "Let's build something secure and practical.",
    description: "For cybersecurity testing, AI-assisted product development, Android apps, WhatsApp automation, web platforms, or business workflow tools.",
    email: "imathulraj@gmail.com",
    whatsapp: "https://wa.me/971582903572",
    linkedin: "https://www.linkedin.com/in/athulrajpalayi",
  },
};
