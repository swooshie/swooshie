# Experience

This document provides detailed descriptions of my professional experience, including proof-of-concept work, system design decisions, and technical tradeoffs. It is intended to support deep, follow-up questions.

---

## Software Developer  
**New York University – Global Enrollment Management & Student Success**  
**Feb 2025 – Present | New York, USA**

I work as a Software Developer for NYU's Global Enrollment Management and Student Success team, developing workflow software used by campus administrators across enrollment operations, staff communications, and service processes.

### Core responsibilities
- Designing and improving Google Cloud-based SaaS tools for internal operations
- Analyzing backend logic and workflow bottlenecks in production systems
- Building front-end interfaces and workflow pages with HTML/JavaScript
- Writing technical documentation and supporting alpha testing for JS / Google Apps Script modules
- Improving performance, reliability, and maintainability of admin-facing tools

---

### Platform Modernization: Google Apps Script -> Next.js + MongoDB

**Problem**  
Production Google Apps Script tools were increasingly constrained by spreadsheet-bound execution, limiting scalability, responsiveness, and long-term maintainability.

**What I did**
- Designed a migration path from legacy Apps Script tools to a **Next.js + MongoDB** architecture
- Helped decouple UI, backend logic, and data operations for improved maintainability
- Implemented sync logic to support a consistent ~60-second data synchronization cycle

**Outcome**
- Enabled real-time usage patterns for production workflows
- Established a consistent 60-second sync cycle
- Created a foundation for scaling beyond Apps Script constraints

---

### Reliability Improvement: Fault-Tolerant Form Delivery System

**Problem**  
Concurrent form submissions caused partial writes and inconsistent delivery states.

**What I did**
- Engineered a fault-tolerant, concurrency-safe form delivery pipeline
- Added retry-safe processing to handle peak submission load more reliably
- Improved consistency guarantees for record delivery and submission handling

**Outcome**
- Reduced retry failures by ~40% under peak load
- Improved operational reliability for staff-facing submission workflows

---

### Workflow Automation: Email Template Service

**Problem**  
Managers relied on repetitive manual email drafting and static templates that were difficult to maintain across workflows.

**What I did**
- Built and owned a web-based email template service for internal teams
- Implemented placeholder-driven rendering to auto-populate user, credential, and device data
- Enabled reusable manager-authored templates for repeatable communication workflows

**Outcome**
- Reduced email management effort by ~55%
- Standardized internal communication workflows and reduced manual editing

---

### Additional Contributions
- Implemented compound label-based filtering (UI + backend query logic) for 2,000+ records, reducing lookup time
- Improved Google Apps Script data retrieval speed by ~50% by switching from service-layer calls to direct Google Sheets API access
- Architected a PoC to migrate 1,000+ Google Sheets records to **Firestore** and **Google Cloud SQL**
- Built an automated Shipping Label Page that reduced manual processing time by ~50%

**Tech**
JavaScript, Google Apps Script, Google Sheets API, Next.js, MongoDB, HTML, Firestore, Google Cloud SQL, Google Cloud

---

## Software Development Engineer  
**Sainapse**  
**Jul 2022 – May 2024 | Hyderabad, India**

Worked in the Research, Technology, and Platform team, building platform capabilities for large-scale data ingestion, transfer, and downstream analytics / ML workflows.

---

### Platform Optimization: Kafka-Based File Transfer Improvement

**Problem**  
File transfers across microservices were inefficient, increasing transfer time and memory overhead in production workflows.

**What I did**
- Optimized microservice file transfers via Apache Kafka
- Implemented byte-level serialization / deserialization
- Added parallel file distribution to improve throughput and resource usage on AWS (Linux)

**Outcome**
- ~50% reduction in time complexity
- ~33% reduction in space complexity

---

### Platform Scale-Up: HDFS Ingestion for 3B+ Daily Records

**Problem**  
The platform needed a storage strategy that could support very high ingestion volume and distributed processing across multiple services.

**What I did**
- Spearheaded HDFS implementation in Java to support high-volume ingestion
- Integrated Hive-based processing across platform workflows
- Supported storage and processing across 10+ microservices

**Outcome**
- Stored 3B+ daily records
- Improved average system performance by ~37%

---

### Proof of Concept: Cross-Language Model Development via Apache Thrift

**Problem**  
Model development workflows needed better interoperability across teams working in different programming languages.

**What I did**
- Pioneered an Apache Thrift PoC for cross-language model development
- Implemented interoperability across Java, Python, and Scala

**Outcome**
- Demonstrated feasibility of shared model contracts across language boundaries
- Reduced engineering duplication during experimentation

---

### Additional Contributions
- Designed a batch data adapter attached to BigQuery tables, enabling on-demand transfer of 2B+ rows for downstream ML workflows (including free-text search and deduplication)
- Improved parsing logic with the Apryse Java SDK to accelerate extraction from 3GB+ XLSX and DOCX files by ~30%
- Mentored 4 university interns on product architecture and core technology stack, supporting independent feature delivery

**Tech**
Java, Apache Kafka, HDFS, Apache Hive, Apache Pig, BigQuery, Apryse Java SDK, Apache Thrift, AWS (Linux), Python, Scala

---

## Data Science Intern  
**AiDash**  
**Jan 2022 – Jun 2022 | Bengaluru, India**

Worked on applied geospatial ML for vegetation classification and LANDSAT image classification workflows.

---

### Model Evaluation: LANDSAT Classification with ResNet

**What I did**
- Evaluated ResNet architectures with Keras and TensorFlow for LANDSAT classification
- Assessed model performance using metrics including accuracy, precision, recall, and F1 score

**Outcome**
- Achieved ~60%-75% accuracy across experiments

---

### Statistical Method: Grassland Classification and Land Ranking

**What I did**
- Devised a Python-based grassland classification method to improve land ranking
- Benchmarked and compared performance against peer solutions

**Outcome**
- ~78% accuracy
- Ranked 1st among peers

---

### Additional Contributions
- Built a Python script to automate satellite image labeling in QGIS, reducing manual processing time by ~80%
- Resolved geospatial data handling during onboarding by performing CRUD operations on 10,000+ shapefiles using GeoPandas and PostgreSQL

**Tech**
Python, TensorFlow, Keras, ResNet, LANDSAT, GeoPandas, QGIS, PostgreSQL, geospatial ML, model evaluation

---

## Data Analyst Intern  
**PayPal**  
**May 2020 – Jun 2020 | India**

Worked on forecasting models for customer demand analysis.

**Key work**
- Identified 10+ customer demand trends and developed forecasting models with R² values close to 0.9
- Achieved R² scores of 0.98, 0.91, and 0.85 across squared, absolute, and infinite loss functions in a linear regression problem, demonstrating robustness to outliers
- Collaborated with a team of 4 peers to deliver a comprehensive presentation on forecasting customer demand

**Tech**
Python, Forecasting, Linear Regression, Statistics, Regression Analysis, Model Evaluation
