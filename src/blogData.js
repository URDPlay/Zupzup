// ─── Dynamic Blog Data ───────────────────────────────────────────────────────
// Dates are computed at runtime relative to today so the blog always stays
// fresh. Article 0 = today, article 1 = yesterday, and so on.
// ─────────────────────────────────────────────────────────────────────────────

const getDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// ─── Article content blocks ───────────────────────────────────────────────────

const content_ai = (title) => `
    <p>Artificial Intelligence is no longer just a buzzword in transportation; it is a critical safety component. <strong>${title}</strong> represents a monumental shift in how we process dynamic environmental variables.</p>
    <h3>Data Pipeline and Model Training</h3>
    <p>Training our models requires ingesting petabytes of historical telemetry and video feed data. We utilize a hybrid cloud-edge training infrastructure. In the cloud, massive compute clusters run thousands of simulated collision scenarios per hour, utilizing generative adversarial networks (GANs) to synthesize edge cases that rarely occur in the real world.</p>
    <p>The models are heavily quantized before deployment. We compress billions of parameters into models small enough to run on local inferencing units inside the locomotive. This ensures that even if the train loses all network connectivity, the AI continues to function at 100% efficacy.</p>
    <h3>Inference at the Edge</h3>
    <p>When the model runs on the train, it operates on a strict 10-millisecond cycle. It reads inputs from LIDAR, radar, and optical cameras, processes the unified state, and outputs a confidence score for potential path incursions. If the risk exceeds the threshold, the system physically engages the braking mechanism.</p>
    <p>Continuous learning is achieved through asynchronous telemetry uploads. When the train returns to a high-bandwidth yard, it uploads instances where the AI's confidence was low, feeding the next iteration of our training loop.</p>
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

const content_safety = (title) => `
    <p>Safety is the foundational pillar of everything we do. The topic of <strong>${title}</strong> cuts to the core of our engineering philosophy.</p>
    <h3>The Swiss Cheese Model</h3>
    <p>In safety engineering, we rely on the Swiss Cheese Model of accident causation. Every layer of defense has holes, but if you stack enough layers, a catastrophic failure is prevented. Our system acts as the ultimate backstop. It does not replace existing signaling or the operator; it is an independent, non-intrusive overlay.</p>
    <h3>Fail-Safe Architectures</h3>
    <p>We mandate fail-safe design in all hardware and software. If a sensor fails, the system defaults to a degraded mode that enforces stricter speed limits, rather than shutting down. If the main processor fails, a hot-standby unit takes over in less than 20 milliseconds.</p>
    <p>This level of reliability is achieved through Triple Modular Redundancy (TMR). Three separate computers process the same data streams simultaneously. If they disagree, a voting mechanism determines the correct action. This guarantees that hardware faults do not propagate into unsafe physical actions.</p>
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

const content_iot = (title) => `
    <p>The physical manifestation of our software is just as critical as the code itself. <strong>${title}</strong> highlights the extreme challenges of building hardware for locomotives.</p>
    <h3>Vibration and Thermal Constraints</h3>
    <p>A train is a hostile environment for electronics. Constant high-frequency vibration and extreme temperature swings can destroy commercial-grade hardware in days. Our compute units are housed in solid aluminum blocks, sealed with industrial epoxy, and utilize passive cooling mechanisms.</p>
    <h3>Sensor Integration</h3>
    <p>We deploy a multi-modal sensor array on the front of the locomotive. Radar provides long-range distance measurement regardless of weather. LIDAR offers high-resolution 3D mapping for object classification. Thermal cameras cut through fog and darkness to identify biological hazards (wildlife or humans).</p>
    <p>The synchronization of these sensors is paramount. Using Precision Time Protocol (PTP), we ensure all data packets are timestamped with microsecond accuracy, preventing ghosting or jitter in the perceived 3D environment.</p>
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

const content_eng = (title) => `
    <p>Software engineering for safety-critical systems requires a fundamentally different approach. <strong>${title}</strong> is a testament to our rigorous development practices.</p>
    <h3>Memory Safety and Concurrency</h3>
    <p>We have largely migrated our embedded systems from C++ to Rust. The borrow checker in Rust eliminates entire classes of memory safety bugs—like use-after-free and data races—at compile time. In a system that controls a 10,000-ton vehicle, a segfault is unacceptable.</p>
    <h3>Microservices and Telemetry</h3>
    <p>On the backend, our cloud infrastructure is built on Go and deployed via Kubernetes. We manage a fleet of thousands of trains, each streaming telemetry data via WebSockets and MQTT. Apache Kafka serves as the central nervous system, buffering and distributing millions of messages per second to our analytics and dashboarding services.</p>
    <p>This architecture allows operators to have a sub-second real-time view of their entire network, while historical data is seamlessly archived into cold storage for compliance and model training.</p>
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

const content_news = (title) => `
    <p>At UNDISCOVEREDPATH, our journey is moving faster than ever. <strong>${title}</strong> marks another significant milestone for our team.</p>
    <h3>Recent Milestones</h3>
    <p>Over the past quarter, we have successfully deployed our AI guardian system across an additional 2,500 miles of track. This expansion was accompanied by the rollout of our Version 3.2 firmware, which improved braking prediction accuracy by 14% in heavy rain conditions.</p>
    <h3>Looking to the Future</h3>
    <p>Our roadmap for the next 12 months involves expanding into the European market, requiring extensive integration with ETCS (European Train Control System) standards. We are also scaling our team, bringing on top-tier talent in machine learning, embedded systems, and safety compliance.</p>
    <p>We are grateful for our partners, our investors, and most importantly, the railway operators who trust us to safeguard their networks. The path ahead is clear, and we are accelerating.</p>
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

// ─── Static article definitions (no dates — added dynamically below) ──────────

const articleDefs = [
  { id: 1,  title: "The Future of Predictive Braking in High-Speed Rail",               category: "AI & Machine Learning", author: "Sarah Jenkins",    readTime: "9 min read",  contentFn: content_ai },
  { id: 2,  title: "How We Scaled Our WebSocket Infrastructure for 10,000 Trains",       category: "Railway Safety",        author: "David Chen",       readTime: "9 min read",  contentFn: content_safety },
  { id: 3,  title: "Deep Learning Models for Weather-Adaptive Collision Avoidance",      category: "IoT & Hardware",        author: "Dr. Elena Rostova", readTime: "9 min read",  contentFn: content_iot },
  { id: 4,  title: "Why Edge Computing is Crucial for Railway IoT",                      category: "Engineering",           author: "Sarah Jenkins",    readTime: "8 min read",  contentFn: content_eng },
  { id: 5,  title: "Understanding the Physics of Train Deceleration",                    category: "Company News",          author: "David Chen",       readTime: "9 min read",  contentFn: content_news },
  { id: 6,  title: "Building a Zero-Trust Architecture for Railway Networks",            category: "AI & Machine Learning", author: "Dr. Elena Rostova", readTime: "8 min read",  contentFn: content_ai },
  { id: 7,  title: "The Role of Computer Vision in Track Anomaly Detection",             category: "Railway Safety",        author: "Sarah Jenkins",    readTime: "4 min read",  contentFn: content_safety },
  { id: 8,  title: "Case Study: Preventing a Major Collision in the Northeast Corridor", category: "IoT & Hardware",        author: "David Chen",       readTime: "11 min read", contentFn: content_iot },
  { id: 9,  title: "Migrating to Rust for Mission-Critical Embedded Systems",            category: "Engineering",           author: "Dr. Elena Rostova", readTime: "4 min read",  contentFn: content_eng },
  { id: 10, title: "The Ethics of AI in Automated Transport Systems",                    category: "Company News",          author: "Sarah Jenkins",    readTime: "6 min read",  contentFn: content_news },
  { id: 11, title: "Optimizing Sensor Data Pipelines with Apache Kafka",                 category: "AI & Machine Learning", author: "David Chen",       readTime: "6 min read",  contentFn: content_ai },
  { id: 12, title: "How 5G is Revolutionizing Train-to-Train Communication",             category: "Railway Safety",        author: "Dr. Elena Rostova", readTime: "6 min read",  contentFn: content_safety },
  { id: 13, title: "Designing Fault-Tolerant Systems for Extreme Weather",               category: "IoT & Hardware",        author: "Sarah Jenkins",    readTime: "11 min read", contentFn: content_iot },
  { id: 14, title: "The Math Behind Our 12-Second Prediction Window",                    category: "Engineering",           author: "David Chen",       readTime: "8 min read",  contentFn: content_eng },
  { id: 15, title: "A Deep Dive into LIDAR Applications on Locomotives",                 category: "Company News",          author: "Dr. Elena Rostova", readTime: "9 min read",  contentFn: content_news },
  { id: 16, title: "Overcoming Latency in Cloud-Based Safety Dashboards",                category: "AI & Machine Learning", author: "Sarah Jenkins",    readTime: "10 min read", contentFn: content_ai },
  { id: 17, title: "The Evolution of Railway Signaling: From Semaphores to AI",          category: "Railway Safety",        author: "David Chen",       readTime: "8 min read",  contentFn: content_safety },
  { id: 18, title: "Securing V2X Communications Against Cyber Threats",                  category: "IoT & Hardware",        author: "Dr. Elena Rostova", readTime: "4 min read",  contentFn: content_iot },
  { id: 19, title: "How We Use Reinforcement Learning to Optimize Braking Curves",       category: "Engineering",           author: "Sarah Jenkins",    readTime: "8 min read",  contentFn: content_eng },
  { id: 20, title: "The Importance of Redundancy in Safety-Critical Hardware",           category: "Company News",          author: "David Chen",       readTime: "5 min read",  contentFn: content_news },
  { id: 21, title: "Our Journey to SOC2 Compliance for Railway Data",                   category: "AI & Machine Learning", author: "Dr. Elena Rostova", readTime: "7 min read",  contentFn: content_ai },
  { id: 22, title: "Integrating Legacy Train Control Systems with Modern AI",            category: "Railway Safety",        author: "Sarah Jenkins",    readTime: "5 min read",  contentFn: content_safety },
  { id: 23, title: "The Impact of Climate Change on Track Integrity Monitoring",         category: "IoT & Hardware",        author: "David Chen",       readTime: "8 min read",  contentFn: content_iot },
  { id: 24, title: "Building a Design System for High-Stress Operator Dashboards",      category: "Engineering",           author: "Dr. Elena Rostova", readTime: "6 min read",  contentFn: content_eng },
  { id: 25, title: "What's Next for UNDISCOVEREDPATH: 2027 Roadmap",                    category: "Company News",          author: "Sarah Jenkins",    readTime: "11 min read", contentFn: content_news },
];

// ─── Export — dates are always relative to today ──────────────────────────────

export const blogArticles = articleDefs.map((def, i) => ({
  id:       def.id,
  title:    def.title,
  category: def.category,
  // Article 0 = today, article 1 = yesterday, etc.
  date:     getDate(i),
  author:   def.author,
  readTime: def.readTime,
  excerpt:  `An in-depth look at ${def.title.toLowerCase()} and how it shapes the future of railway technology.`,
  content:  def.contentFn(def.title),
}));