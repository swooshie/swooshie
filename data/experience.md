# Experience

This document contains detailed work history, key systems built, and interviewer-friendly context. It is structured so follow-up questions can be answered with concrete technical and business detail.

---

## Software Developer
**New York University - Global Enrollment Management & Student Success**
**Feb 2025 - Present | New York, USA**

I work on internal software used by campus administrators for enrollment operations, staff communications, and service workflows. The role combines practical product delivery with backend reliability and process automation.

### Day-to-day scope
- Design and improve internal SaaS/workflow systems across Google Cloud and VPS-hosted architectures
- Build operational interfaces and process UIs for non-technical teams
- Analyze bottlenecks in backend logic and workflow orchestration
- Write implementation notes and testing guides for JS/GAS modules
- Support alpha testing and rollout of process-critical features

### Platform Modernization: Google Apps Script -> Node.js + MongoDB

Problem
The legacy Asset Management System (AMS) page used by managers to track staff, devices, shipping, and department operations became slower as Google Sheets data size and sheet count increased.

What I did
- Served as sole engineer on NYU GEMSS's production Asset Management System, owning the full codebase, infrastructure, CI/CD pipeline, and Dockerized deployment for a system managing 8,000+ devices and 300+ employees across the Admissions department
- Drove phased AI-assisted migration from Google Apps Script to a Node.js/Express, TypeScript, and MongoDB architecture
- Built an MVC-structured REST API layer with 10+ endpoints for AMS workflows
- Introduced real-time data sync while preserving Google Sheets access during transition
- Consolidated sheet batching operations into a single API layer
- Preserved critical HTML/CSS frontend workflows already used by managers, including device-to-floor-plan mapping, shipping operations, and table-based filtering
- Replaced Apps Script/Sheets backend logic with API-driven services for asset, staff-assignment, accessory, and shipment tracking
- Added OAuth-based authentication to strengthen access control and security posture
- Used Agentic AI/Codex-assisted workflow support during migration and refactoring tasks
- Delivered in Agile workflow cycles with iterative validation

Why it matters
This modernization reduced spreadsheet-bound bottlenecks, improved security, and replaced script-heavy logic with a scalable API-first backend foundation for manager-critical operations.

Outcome
- Reduced heavy-page load behavior from around 10 seconds to near-instant response (milliseconds/sub-second range for key retrieval paths)
- Achieved roughly 4x performance gains on key internal tool paths after modernization work
- Established consistent 60-second sync behavior
- Improved long-term maintainability and extensibility

### Reliability Improvement: Fault-Tolerant Form Delivery

Problem
Concurrent form submissions created partial writes and inconsistent delivery states.

What I did
- Engineered concurrency-safe form delivery logic
- Added retry-safe processing and safeguards for peak traffic
- Strengthened consistency guarantees for submission handling

Outcome
- Reduced retry failures by ~40% during peak load
- Increased operational trust in staff-facing workflows

### Record Lookup Improvement: Compound Filtering Engine

Problem
Slow service-layer search made it harder to inspect asset records at production scale.

What I did
- Replaced service-layer search with a set-theory-backed compound filtering engine
- Optimized lookup behavior across 8,000+ device records

Outcome
- Improved record lookup speed by ~50% across device records

### Workflow Automation: Email Template Service

Problem
Managers spent significant time rewriting repetitive communications and maintaining static templates.

What I did
- Built and owned a web-based internal email template service
- Implemented placeholder-based rendering for user/credential/device data
- Enabled reusable manager-authored templates across workflows

Outcome
- Reduced email management effort by ~55%
- Standardized communication quality and reduced manual edits

### Additional NYU contributions
- Implemented compound label-based filtering across 8,000+ device records, improving lookup speed
- Improved GAS retrieval performance by ~50% using direct Google Sheets API patterns
- Architected PoC migration of 1,000+ records to Firestore and Google Cloud SQL
- Built automated Shipping Label Page, reducing manual processing time by ~50%

### Technologies used at NYU
TypeScript, JavaScript, Node.js, Express, HTML/CSS, Google Apps Script, Google Sheets API, MongoDB Atlas, Firestore, Google Cloud SQL, Google Cloud, OAuth, Docker, CI/CD, MVC, Hostinger VPS

### NYU interview Q&A context

How would you summarize this role?
This role is about modernization and workflow reliability. I build internal software that directly improves day-to-day operations for administrative teams and focus on measurable reliability and efficiency gains.

Is this mostly frontend or backend?
It is full-stack in practice. I build workflow UIs with HTML/CSS/JavaScript and also own backend logic, sync behavior, and reliability concerns.

What is the core engineering challenge here?
Moving from fast but constrained script-based systems to maintainable, scalable architecture without breaking operational workflows.

---

## Software Development Engineer
**Sainapse**
**Jul 2022 - May 2024 | Hyderabad, India**

I worked in the Research, Technology, and Platform team on data-heavy distributed systems for ingestion, transfer, and downstream analytics/ML.

### Platform Optimization: Kafka-Based File Transfer Improvement

Problem
Cross-microservice file transfers were inefficient, increasing runtime and memory overhead.

What I did
- Optimized transfer design using Apache Kafka
- Implemented byte-level serialization/deserialization
- Added parallel distribution mechanisms on AWS Linux environments

Outcome
- ~50% reduction in time complexity
- ~33% reduction in space complexity

### Platform Scale-Up: HDFS Ingestion for 3B+ Daily Records

Problem
The platform needed robust storage and processing for very high daily ingestion volume.

What I did
- Spearheaded HDFS implementation in Java
- Integrated Hive processing across platform workflows
- Supported storage/processing needs across 10+ microservices

Outcome
- Supported 3B+ daily records
- Improved average system performance by ~37%

### PoC: Cross-Language Model Development via Apache Thrift

Problem
Teams building model logic in different languages needed stronger interoperability and contract consistency.

What I did
- Built Apache Thrift PoC for cross-language model contracts
- Implemented Java/Python/Scala interoperability

Outcome
- Demonstrated feasibility of shared cross-language model interfaces
- Reduced duplicate effort during experimentation

### Additional Sainapse contributions
- Designed batch data adapter for BigQuery tables, enabling on-demand transfer of 2B+ rows for ML workflows
- Improved parsing for 3GB+ XLSX/DOCX inputs using Apryse Java SDK, improving extraction by ~30%
- Mentored 4 interns on architecture and stack usage for independent delivery

### Technologies used at Sainapse
Java, Apache Kafka, HDFS, Hive, Pig, BigQuery, Apryse Java SDK, Apache Thrift, AWS (Linux), Python, Scala

### Sainapse interview Q&A context

What did this role prove about your profile?
It established strong distributed systems and data-platform depth under high-scale constraints.

How did you contribute beyond coding tasks?
I contributed architecture-level improvements, built PoCs to de-risk direction, and mentored interns.

You have worked in Hadoop. What sort of complexities have you faced in Hadoop?
The main complexities were scale, data quality variability, and distributed-system reliability:
- Handling ingestion/storage behavior for 3B+ daily records across 10+ microservices while keeping pipelines stable
- Managing schema and data-format inconsistency between upstream producers and downstream Hive processing needs
- Balancing throughput versus cluster resource usage so heavy jobs did not starve other workloads
- Debugging distributed failures across service boundaries, where root cause could be in ingestion, serialization, job config, or storage behavior
- Keeping batch pipelines operationally predictable with monitoring, retries, and practical failure-handling strategies
- Designing a PoC path from single-cluster setup toward multi-cluster architecture and evaluating Kerberos-based security hardening
- Handling security and operational tradeoffs while proving feasibility first; the delivered PoC was completed on a single-cluster implementation
I handled these by standardizing ingestion paths, tightening data contracts where possible, and focusing on performance and reliability improvements that were measurable in production behavior.

---

## Data Science Intern
**AiDash**
**Jan 2022 - Jun 2022 | Bengaluru, India**

Worked on applied geospatial ML for vegetation and LANDSAT classification workflows.

### LANDSAT Classification with ResNet

What I did
- Architected an end-to-end LANDSAT classification pipeline leveraging ResNet, Keras, and TensorFlow
- Reduced image processing time by 40%
- Measured performance using accuracy, precision, recall, and F1

Outcome
- Maintained 95% classification accuracy

### Grassland Classification and Land Ranking Method

What I did
- Built Python-based statistical method for grassland classification
- Benchmarked against peer solutions

Outcome
- ~78% accuracy
- Ranked 1st among peers

### Additional AiDash contributions
- Automated satellite image labeling in QGIS, reducing manual effort by ~80%
- Handled onboarding geospatial data with CRUD operations on 10,000+ shapefiles via GeoPandas + PostgreSQL

### Technologies used at AiDash
Python, TensorFlow, Keras, ResNet, LANDSAT, GeoPandas, QGIS, PostgreSQL

---

## Data Analyst Intern
**PayPal**
**May 2020 - Jun 2020 | India**

Worked on forecasting-oriented demand analytics.

### Key work
- Identified 10+ demand trends and developed forecasting models with R2 values near 0.9
- Achieved R2 scores of 0.98, 0.91, and 0.85 across squared, absolute, and infinite loss settings
- Collaborated in a 4-member team to present forecasting findings

### Technologies used at PayPal
Python, Forecasting, Linear Regression, Statistics, Regression Analysis

---

## Cross-role Themes (How to answer about career growth)
- Pattern 1: Consistent focus on measurable impact (performance, reliability, efficiency)
- Pattern 2: Transition from analytics/ML internships to full-scale software/platform engineering
- Pattern 3: Strong fit for backend/platform roles with practical full-stack capability where needed
- Pattern 4: Comfort with both high-scale systems and workflow-centric product engineering
