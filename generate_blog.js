import fs from 'fs';

const categories = ['AI & Machine Learning', 'Railway Safety', 'IoT & Hardware', 'Engineering', 'Company News'];

const titles = [
  "Introducing Version 3.3.0: Intelligent Sensor Fusion and Drone-Assisted Track Inspections",
  "The Future of Predictive Braking in High-Speed Rail",
  "How We Scaled Our WebSocket Infrastructure for 10,000 Trains",
  "Deep Learning Models for Weather-Adaptive Collision Avoidance",
  "Why Edge Computing is Crucial for Railway IoT",
  "Understanding the Physics of Train Deceleration",
  "Building a Zero-Trust Architecture for Railway Networks",
  "The Role of Computer Vision in Track Anomaly Detection",
  "Case Study: Preventing a Major Collision in the Northeast Corridor",
  "Migrating to Rust for Mission-Critical Embedded Systems",
  "The Ethics of AI in Automated Transport Systems",
  "Optimizing Sensor Data Pipelines with Apache Kafka",
  "How 5G is Revolutionizing Train-to-Train Communication",
  "Designing Fault-Tolerant Systems for Extreme Weather",
  "The Math Behind Our 12-Second Prediction Window",
  "A Deep Dive into LIDAR Applications on Locomotives",
  "Overcoming Latency in Cloud-Based Safety Dashboards",
  "The Evolution of Railway Signaling: From Semaphores to AI",
  "Securing V2X Communications Against Cyber Threats",
  "How We Use Reinforcement Learning to Optimize Braking Curves",
  "The Importance of Redundancy in Safety-Critical Hardware",
  "Our Journey to SOC2 Compliance for Railway Data",
  "Integrating Legacy Train Control Systems with Modern AI",
  "The Impact of Climate Change on Track Integrity Monitoring",
  "Building a Design System for High-Stress Operator Dashboards",
  "What's Next for UNDISCOVEREDPATH: 2027 Roadmap"
];

const templates = {
  'AI & Machine Learning': (title) => `
    <p>Artificial Intelligence is no longer just a buzzword in transportation; it is a critical safety component. <strong>${title}</strong> represents a monumental shift in how we process dynamic environmental variables.</p>
    <h3>Data Pipeline and Model Training</h3>
    <p>Training our models requires ingesting petabytes of historical telemetry and video feed data. We utilize a hybrid cloud-edge training infrastructure. In the cloud, massive compute clusters run thousands of simulated collision scenarios per hour, utilizing generative adversarial networks (GANs) to synthesize edge cases that rarely occur in the real world.</p>
    <p>The models are heavily quantized before deployment. We compress billions of parameters into models small enough to run on local inferencing units inside the locomotive. This ensures that even if the train loses all network connectivity, the AI continues to function at 100% efficacy.</p>
    <h3>Inference at the Edge</h3>
    <p>When the model runs on the train, it operates on a strict 10-millisecond cycle. It reads inputs from LIDAR, radar, and optical cameras, processes the unified state, and outputs a confidence score for potential path incursions. If the risk exceeds the threshold, the system physically engages the braking mechanism.</p>
    <p>Continuous learning is achieved through asynchronous telemetry uploads. When the train returns to a high-bandwidth yard, it uploads instances where the AI's confidence was low, feeding the next iteration of our training loop.</p>
  `,
  'Railway Safety': (title) => `
    <p>Safety is the foundational pillar of everything we do. The topic of <strong>${title}</strong> cuts to the core of our engineering philosophy.</p>
    <h3>The Swiss Cheese Model</h3>
    <p>In safety engineering, we rely on the Swiss Cheese Model of accident causation. Every layer of defense has holes, but if you stack enough layers, a catastrophic failure is prevented. Our system acts as the ultimate backstop. It does not replace existing signaling or the operator; it is an independent, non-intrusive overlay.</p>
    <h3>Fail-Safe Architectures</h3>
    <p>We mandate fail-safe design in all hardware and software. If a sensor fails, the system defaults to a degraded mode that enforces stricter speed limits, rather than shutting down. If the main processor fails, a hot-standby unit takes over in less than 20 milliseconds.</p>
    <p>This level of reliability is achieved through Triple Modular Redundancy (TMR). Three separate computers process the same data streams simultaneously. If they disagree, a voting mechanism determines the correct action. This guarantees that hardware faults do not propagate into unsafe physical actions.</p>
  `,
  'IoT & Hardware': (title) => `
    <p>The physical manifestation of our software is just as critical as the code itself. <strong>${title}</strong> highlights the extreme challenges of building hardware for locomotives.</p>
    <h3>Vibration and Thermal Constraints</h3>
    <p>A train is a hostile environment for electronics. Constant high-frequency vibration and extreme temperature swings can destroy commercial-grade hardware in days. Our compute units are housed in solid aluminum blocks, sealed with industrial epoxy, and utilize passive cooling mechanisms.</p>
    <h3>Sensor Integration</h3>
    <p>We deploy a multi-modal sensor array on the front of the locomotive. Radar provides long-range distance measurement regardless of weather. LIDAR offers high-resolution 3D mapping for object classification. Thermal cameras cut through fog and darkness to identify biological hazards (wildlife or humans).</p>
    <p>The synchronization of these sensors is paramount. Using Precision Time Protocol (PTP), we ensure all data packets are timestamped with microsecond accuracy, preventing ghosting or jitter in the perceived 3D environment.</p>
  `,
  'Engineering': (title) => `
    <p>Software engineering for safety-critical systems requires a fundamentally different approach. <strong>${title}</strong> is a testament to our rigorous development practices.</p>
    <h3>Memory Safety and Concurrency</h3>
    <p>We have largely migrated our embedded systems from C++ to Rust. The borrow checker in Rust eliminates entire classes of memory safety bugs—like use-after-free and data races—at compile time. In a system that controls a 10,000-ton vehicle, a segfault is unacceptable.</p>
    <h3>Microservices and Telemetry</h3>
    <p>On the backend, our cloud infrastructure is built on Go and deployed via Kubernetes. We manage a fleet of thousands of trains, each streaming telemetry data via WebSockets and MQTT. Apache Kafka serves as the central nervous system, buffering and distributing millions of messages per second to our analytics and dashboarding services.</p>
    <p>This architecture allows operators to have a sub-second real-time view of their entire network, while historical data is seamlessly archived into cold storage for compliance and model training.</p>
  `,
  'Company News': (title) => `
    <p>At UNDISCOVEREDPATH, our journey is moving faster than ever. <strong>${title}</strong> marks another significant milestone for our team.</p>
    <h3>Recent Milestones</h3>
    <p>Over the past quarter, we have successfully deployed our AI guardian system across an additional 2,500 miles of track. This expansion was accompanied by the rollout of our Version 3.2 firmware, which improved braking prediction accuracy by 14% in heavy rain conditions.</p>
    <h3>Looking to the Future</h3>
    <p>Our roadmap for the next 12 months involves expanding into the European market, requiring extensive integration with ETCS (European Train Control System) standards. We are also scaling our team, bringing on top-tier talent in machine learning, embedded systems, and safety compliance.</p>
    <p>We are grateful for our partners, our investors, and most importantly, the railway operators who trust us to safeguard their networks. The path ahead is clear, and we are accelerating.</p>
  `
};

const generateContent = (title, category) => {
  if (title.includes("Version 3.3.0")) {
    return `
      <p>We are thrilled to announce the official release of <strong>Version 3.3.0</strong> of the UNDISCOVEREDPATH Railway Intelligence System. This release introduces two major technological breakthroughs: <strong>Intelligent Multi-Modal Sensor Fusion</strong> and <strong>Drone-Assisted Track Anomaly Sweepers</strong>.</p>
      <h3>Intelligent Multi-Modal Sensor Fusion</h3>
      <p>Locomotives now run our next-generation neural path fusion model at the edge. By combining real-time data from solid-state LIDAR, millimeter-wave radar, and high-framerate optical cameras, the AI constructs a unified 3D spatial vector of the track ahead. This sensor fusion increases threat detection reliability by 24% under extreme weather conditions (such as heavy monsoon rains and dense fog) and eliminates sensor blind spots.</p>
      <h3>Drone-Assisted Track Inspections</h3>
      <p>Version 3.3.0 introduces telemetry integration with autonomous track-sweeping drones. These drones fly ahead of trains in low-visibility zones, scanning the tracks for structural anomalies, landslides, or crossing incursions, and stream high-bandwidth telemetry directly back to our edge controllers. If an obstacle is detected, the train's AI guardian is notified up to 60 seconds before arrival, allowing for a smooth and gradual deceleration.</p>
      <h3>Edge-Processing Speed Envelopes</h3>
      <p>The system now dynamically adapts the safe speed envelope based on real-time atmospheric visibility telemetry. If visibility drops below 1.2 kilometers, the AI applies a non-intrusive speed restriction, ensuring that the train's deceleration curve is always aligned with its sensor horizons.</p>
    `;
  }
  const template = templates[category] || templates['Engineering'];
  const base = template(title);
  
  return base;
};

const articles = titles.map((title, i) => {
  const category = categories[i % categories.length];
  const baseContent = generateContent(title, category);
  const padding = `
    <h3>Conclusion &amp; Next Steps</h3>
    <p>As we continue to iterate on these concepts, the feedback loop between our engineering teams and field operators remains our most valuable asset. We are constantly monitoring telemetry, analyzing edge cases, and refining our approach. The complexity of the railway environment means that our work is never truly 'done'—it is an ongoing process of continuous improvement and relentless pursuit of safety.</p>
    <p>For more detailed technical specifications and API documentation related to these updates, our engineering portal has been updated with the latest integration guides. We encourage the community and our partners to review the whitepapers associated with this release.</p>
  `;

  return {
    id: i + 1,
    title: title,
    category: category,
    date: (() => { const d = new Date(); d.setDate(d.getDate() - i); return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); })(),
    author: i % 3 === 0 ? 'Sarah Jenkins' : i % 3 === 1 ? 'David Chen' : 'Dr. Elena Rostova',
    readTime: (Math.floor(Math.random() * 8) + 4) + ' min read',
    excerpt: 'An in-depth look at ' + title.toLowerCase() + ' and how it shapes the future of railway technology.',
    content: baseContent + padding
  };
});

const fileContent = `// ─── Dynamic Blog Data ───────────────────────────────────────────────────────
// Dates are computed at runtime relative to today so the blog always stays
// fresh. Article 0 = today, article 1 = yesterday, and so on.
// ─────────────────────────────────────────────────────────────────────────────

export const blogArticles = ${JSON.stringify(articles, null, 2)};

export const getBlogArticles = () => {
  if (typeof window === 'undefined') return blogArticles;
  try {
    const local = localStorage.getItem('undiscoveredpath_custom_blogs');
    if (local) {
      const parsed = JSON.parse(local);
      return [...parsed, ...blogArticles];
    }
  } catch (e) {
    console.error("Error reading custom blogs from localStorage:", e);
  }
  return blogArticles;
};

export const saveBlogArticle = (newArticle) => {
  if (typeof window === 'undefined') return;
  try {
    const local = localStorage.getItem('undiscoveredpath_custom_blogs');
    const list = local ? JSON.parse(local) : [];
    const index = list.findIndex(a => a.id === newArticle.id);
    if (index >= 0) {
      list[index] = newArticle;
    } else {
      list.unshift(newArticle);
    }
    localStorage.setItem('undiscoveredpath_custom_blogs', JSON.stringify(list));
  } catch (e) {
    console.error("Error saving custom blog to localStorage:", e);
  }
};

export const deleteBlogArticle = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const local = localStorage.getItem('undiscoveredpath_custom_blogs');
    if (!local) return;
    let list = JSON.parse(local);
    list = list.filter(a => a.id !== id);
    localStorage.setItem('undiscoveredpath_custom_blogs', JSON.stringify(list));
  } catch (e) {
    console.error("Error deleting custom blog from localStorage:", e);
  }
};
`;

fs.writeFileSync('./src/blogData.js', fileContent);
console.log('Blog data generated successfully.');
