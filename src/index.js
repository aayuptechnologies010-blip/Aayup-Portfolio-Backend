require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Project = require("./models/Project");
const Team = require("./models/Team");
const Service = require("./models/Service");
const Testimonial = require("./models/Testimonial");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Route bindings
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date(), service: "Aayup Portfolio API" });
});

// Seed default Admin and Initial Data if database is empty
async function seedInitialData() {
  try {
    // 1. Admin Seed
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || "admin@aayuptechnologies.com";
      const pass = process.env.ADMIN_PASSWORD || "admin@123";
      const hashed = await bcrypt.hash(pass, 10);
      await User.create({
        name: "Aayup Admin",
        email,
        password: hashed,
        role: "admin",
      });
      console.log(`[Seed] Default Admin seeded: ${email} / ${pass}`);
    }

    // 2. Initial Projects Seed
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const sampleProjects = [
        {
          title: "SynergyFlow Enterprise ERP / CRM",
          tagline: "Unified Multi-Branch Operations & Financial Accounting Suite",
          category: "CRM / ERP",
          image: "/project-crm-dashboard.webp",
          description: "Comprehensive internal ERP deployed across multi-location businesses. Consolidates customer pipelines, purchase orders, team quotas, and automated GST billing.",
          problem: "The client was crippled by disorganized Excel sheets, delayed invoice deliveries, and poor follow-up tracking.",
          solution: "Engineered a centralized, encrypted web application featuring live pipeline analytics and automated WhatsApp notifications.",
          metrics: "45% faster invoice collections & 100% elimination of manual spreadsheets",
          duration: "5 Months",
          techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
          isPublished: true,
        },
        {
          title: "Enterprise E-Commerce Engine",
          tagline: "High-Frequency Retail Storefront with Real-Time Stock Telemetry",
          category: "Web Platforms",
          image: "/project-web-development.webp",
          description: "Next-generation digital storefront engineered to handle intense flash-sale traffic with instant cart updates and edge-cached product catalogs.",
          problem: "Legacy shopping cart experienced severe cart abandonment due to 4+ second page latency.",
          solution: "Re-architected the entire storefront into an API-driven headless architecture utilizing Next.js edge caching.",
          metrics: "42% increase in sales conversion & 850ms average page load",
          duration: "4 Months",
          techStack: ["Next.js", "Node.js", "MongoDB Atlas", "Tailwind CSS"],
          isPublished: true,
        },
        {
          title: "Bhoommetra Mobile & IoT Diagnostics",
          tagline: "Agricultural Telemetry Platform for Precision Farming",
          category: "Mobile Apps",
          image: "/project-mobile-app.webp",
          description: "IoT telemetry mobile application empowering modern farmers with automated soil fertility diagnostics, satellite weather forecasts, and crop disease detection.",
          problem: "Field teams struggled with erratic cellular signals in remote areas and lacked scientific soil telemetry.",
          solution: "Constructed a cross-platform Flutter application featuring an offline-first SQLite database and low-power Bluetooth sync.",
          metrics: "Over 12,000+ active field readings across Maharashtra & Gujarat",
          duration: "6 Months",
          techStack: ["Flutter", "Python / FastAPI", "AWS IoT Core", "PostgreSQL"],
          isPublished: true,
        },
        {
          title: "Aether AI Analytics & Automation",
          tagline: "Operational Anomaly Classifier & LLM Workflow Agent",
          category: "AI & Automation",
          image: "/project-ai-analytics.webp",
          description: "Enterprise-grade machine learning microservice that ingests continuous log streams, extracts unstructured support tickets, and triggers automated remediation.",
          problem: "High volume customer requests required 15+ full-time support engineers just to triage tickets.",
          solution: "Trained custom embedding classifiers and integrated an LLM retrieval agent to auto-solve repetitive queries.",
          metrics: "72% autonomous resolution rate & 90% faster ticket response time",
          duration: "5 Months",
          techStack: ["Python", "FastAPI", "PyTorch", "LangChain", "Redis"],
          isPublished: true,
        },
      ];
      await Project.insertMany(sampleProjects);
      console.log("[Seed] Initial Projects seeded");
    }

    // 3. Team Seed
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      const sampleTeam = [
        {
          name: "Vivek Chaurasiya",
          role: "Founder & Chief Executive Officer",
          department: "Executive Leadership",
          badge: "Founder & CEO",
          directorField: "Strategic Vision & Global Growth",
          visionQuote: "Technology is only as powerful as the business problems it eliminates. At AAYUP, our core obsession is converting complex enterprise challenges into intuitive digital products.",
          bio: "Visionary entrepreneur and tech strategist steering AAYUP Technologies. Dedicated to building world-class engineering teams.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=90",
          linkedin: "https://linkedin.com",
          highlights: ["Global Product Strategy", "Client Success Architecture", "Cross-Functional Leadership"],
          isDirector: true,
          order: 1,
        },
        {
          name: "Aayush Pandey",
          role: "Managing Director & Chief Technology Officer",
          department: "Engineering & Architecture",
          badge: "Director & CTO",
          directorField: "Cloud Architectures & Software Engineering",
          visionQuote: "At AAYUP Technologies, our vision is to engineer resilient, high-speed digital architectures and modern cloud systems that empower global enterprises to scale without friction.",
          bio: "Pioneering technology architecture and enterprise transformations with over 7+ years of deep expertise in cloud ecosystems, microservices, and mobile architectures.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=90",
          linkedin: "https://linkedin.com",
          highlights: ["Serverless & Cloud Systems", "High-Throughput Microservices", "Full-Stack Security & Scale"],
          isDirector: true,
          order: 2,
        },
      ];
      await Team.insertMany(sampleTeam);
      console.log("[Seed] Initial Leadership seeded");
    }

    // 4. Testimonials Seed
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      const sampleTestimonials = [
        {
          clientName: "Rajesh Sharma",
          role: "Chief Technology Officer",
          company: "FinEdge Global",
          feedback: "Aayup Technologies built our enterprise fintech platform from scratch. Their performance optimization and architecture decisions exceeded our expectations.",
          rating: 5,
          projectDelivered: "Fintech Platform & Payment Microservices",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=90",
          approved: true,
        },
        {
          clientName: "Ananya Deshmukh",
          role: "Founder & Chief Executive Officer",
          company: "HealthPulse India",
          feedback: "Outstanding experience from day one. The mobile app and patient portal they created was seamless, modern, and delivered right on our tight launch deadline.",
          rating: 5,
          projectDelivered: "Telehealth Mobile App & Web Portal",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=90",
          approved: true,
        },
      ];
      await Testimonial.insertMany(sampleTestimonials);
      console.log("[Seed] Initial Testimonials seeded");
    }
  } catch (err) {
    console.error("[Seed Error]", err);
  }
}

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aayup_portfolio";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(`[Database] MongoDB Connected to: ${MONGO_URI}`);
    await seedInitialData();
  })
  .catch((err) => {
    console.error(`[Database Error] Could not connect to MongoDB: ${err.message}`);
  });

app.listen(PORT, () => {
  console.log(`[Server] Aayup Portfolio Backend running on http://localhost:${PORT}`);
});
