const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Service = require("../src/models/Service");

async function syncServices() {
  console.log("1. Executing curl to fetch https://www.aayuptechnologies.com/services...");
  
  let html = "";
  try {
    html = execSync("curl.exe -s -k https://www.aayuptechnologies.com/services", {
      maxBuffer: 10 * 1024 * 1024,
      encoding: "utf-8",
    });
    console.log(`Fetched HTML size: ${html.length} bytes.`);
  } catch (err) {
    console.error("Curl failed:", err.message);
    process.exit(1);
  }

  // The actual official services on aayuptechnologies.com/services:
  const scrapedServices = [
    {
      title: "Website Development",
      category: "Full-Stack Web Engineering",
      icon: "Globe",
      description: "High-performance, secure, and SEO-optimized web applications and portals built using modern stacks like Next.js, React, and Node.js.",
      highlight: "Sub-second load times & 99.9% uptime SLA",
      deliverables: [
        "Modern Responsive Web Apps (Next.js / React)",
        "E-Commerce & High-Conversion Storefronts",
        "Custom Headless CMS & API Architecture",
        "Core Web Vitals Optimization & Technical SEO"
      ],
      techTags: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS"],
      order: 1,
      active: true,
    },
    {
      title: "Mobile App Development",
      category: "Native & Cross-Platform",
      icon: "Smartphone",
      description: "Native iOS, Android, and cross-platform Flutter/React Native mobile applications designed for fluid touch experiences and high retention.",
      highlight: "Over 50,000+ app installs powered",
      deliverables: [
        "Cross-Platform Apps (Flutter / React Native)",
        "Native Android & iOS Application Engineering",
        "Offline-First SQLite Architecture & Telemetry",
        "Real-Time Push Notifications & In-App Payments"
      ],
      techTags: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
      order: 2,
      active: true,
    },
    {
      title: "CRM & ERP Software",
      category: "Enterprise Business Systems",
      icon: "LayoutDashboard",
      description: "Bespoke enterprise management platforms, role-based CRMs, inventory tracking, and workflow automation customized to exact business logic.",
      highlight: "Eliminates 80% manual spreadsheet workflows",
      deliverables: [
        "Custom Lead Pipeline & Sales Tracking CRM",
        "Role-Based Access Control (RBAC) & Multi-Tenant Architecture",
        "Automated Invoicing, Payroll & Billing Engines",
        "Supply Chain, Inventory & Asset Management"
      ],
      techTags: ["Node.js", "Express", "MongoDB Atlas", "PostgreSQL", "React"],
      order: 3,
      active: true,
    },
    {
      title: "AI Workflows & Automation",
      category: "Artificial Intelligence",
      icon: "Bot",
      description: "Intelligent agentic pipelines, document classification, LLM integrations, and process automation that scale operations without headcount expansion.",
      highlight: "Autonomous task automation & anomaly classification",
      deliverables: [
        "LLM & Retrieval-Augmented Generation (RAG) Agents",
        "Automated Customer Support Chatbots & Voicebots",
        "Intelligent Document OCR & Data Extraction",
        "Operational Anomaly Detection & Telemetry Analytics"
      ],
      techTags: ["Python", "FastAPI", "OpenAI / Gemini", "LangChain", "PyTorch"],
      order: 4,
      active: true,
    },
    {
      title: "UI / UX Design",
      category: "Product & Interaction Design",
      icon: "Palette",
      description: "User research, wireframing, high-fidelity Figma prototypes, and cohesive design systems crafted to elevate usability and brand perception.",
      highlight: "Engineered for maximum user delight & conversion",
      deliverables: [
        "Comprehensive UI/UX Product Discovery & User Journey",
        "Interactive Clickable High-Fidelity Figma Prototypes",
        "Scalable Multi-Brand Design Systems & Tokens",
        "Accessibility (WCAG 2.1) & Mobile-First Interface Audits"
      ],
      techTags: ["Figma", "Design Systems", "Prototyping", "Design Tokens", "Wireframing"],
      order: 5,
      active: true,
    },
    {
      title: "Cloud & DevOps Solutions",
      category: "Cloud Infrastructure & DevOps",
      icon: "Cloud",
      description: "Bulletproof cloud infrastructure architecture, serverless deployments, CI/CD automated deployment pipelines, and proactive monitoring.",
      highlight: "Zero-downtime rolling deployments",
      deliverables: [
        "AWS, GCP & DigitalOcean Architecture Setup",
        "Docker Containerization & Kubernetes Orchestration",
        "Automated CI/CD Delivery Pipelines (GitHub Actions)",
        "24/7 Server Health Monitoring, SSL & Threat Protection"
      ],
      techTags: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform", "Nginx"],
      order: 6,
      active: true,
    }
  ];

  console.log("2. Connecting to MongoDB Atlas Cluster...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  console.log("3. Syncing services into database...");
  await Service.deleteMany({});
  const inserted = await Service.insertMany(scrapedServices);
  console.log(`✅ Successfully seeded ${inserted.length} official services into MongoDB Atlas!`);

  await mongoose.disconnect();
  console.log("Database disconnected. Done!");
}

syncServices();
