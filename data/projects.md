# Projects

This section highlights my most substantial and recent projects, prioritizing original work with real system design, production considerations, and measurable impact.

---

## Python Script Execution API (Sandboxed with nsjail)
**Context:** Independent systems project  
**What it is:** A production-style API that safely executes user-submitted Python code inside an `nsjail` sandbox.

**What I built**
- Designed a single `POST /execute` API that runs untrusted Python safely
- Enforced strict isolation: no network, no subprocesses, restricted filesystem
- Captured only `main()` return value and stdout
- Dockerized and made deployable on Google Cloud Run

**Why it matters**
- Demonstrates secure execution, sandboxing, and cloud-native deployment
- Mirrors real-world concerns in AI agents and code execution platforms

**Tech:** Python, nsjail, Docker, Google Cloud Run  
**Repo:** https://github.com/swooshie/python-executor

---

## Market Data Microservice
**Context:** Company assessment demo (systems + backend architecture)  
**What it is:** An event-driven market data microservice that polls live stock prices, computes moving averages, and serves analytics-ready data through FastAPI.

**What it solves**
- Demonstrates a production-style backend design for real-time market ingestion and derived analytics
- Separates API routing, async event processing, caching, persistence, and provider integration cleanly

**What I built**
- Built a FastAPI microservice for latest price retrieval and polling-job APIs
- Integrated Finnhub for live quotes, Kafka for async event publishing/consumption, Redis for latest-price caching, and PostgreSQL for raw/processed data storage
- Added Docker / Docker Compose orchestration for local multi-service setup
- Implemented rate limiting with SlowAPI, pytest coverage for sync/async routes, and GitHub Actions CI for testing + Docker build validation

**Impact**
- Improved processing scalability by ~40%
- Reduced average API latency by ~25%
- Delivered a clean, testable event-driven architecture suitable for assessment/demo review

**Tech:** FastAPI, PostgreSQL, Redis, Apache Kafka, Finnhub API, Docker, Pytest, SlowAPI, GitHub Actions  
**Repo:** https://github.com/swooshie/market-data-microservice

---

## Apple Wallet Coupon Generator & Redemption System
**Context:** Real-world workflow automation project (built during NYU GEMSS role)  
**What it is:** A Google Apps Script system for Apple Wallet coupon campaign creation, distribution, and redemption.

**What it solves**
- Replaces manual coupon campaign setup and redemption tracking with an admin-friendly workflow
- Supports campaign creation, multi-channel distribution, QR-based redemption, and expiry notifications in one system

**What I built**
- Built a Google Apps Script application to create coupon campaigns with configurable service types and campaign details
- Integrated PassKit API to create and manage Apple Wallet passes and redemption workflows
- Implemented distribution channels via QR code, email (GAS), and SMS (Twilio)
- Designed QR scanner-assisted redemption flows with validation and fallback handling (Google Sheets / PassKit lookup)
- Used Google Sheets for campaign and coupon record management and added a self-triggering expiry notification script
- Built a responsive admin UI with HTML/CSS and Bootstrap

**Impact**
- Generated 500+ Apple Wallet coupons through the automated workflow
- Improved operational efficiency by ~40%
- Reduced manual handling across campaign creation, distribution, and redemption tracking

**Tech:** Google Apps Script, JavaScript, HTML/CSS, Bootstrap, Google Sheets, PassKit API, Twilio  
**Repo:** https://github.com/swooshie/apple-wallet-coupon-maker

---

## Computer Vision Portfolio (CS-GY 6643)
**Context:** Graduate coursework at NYU Tandon  
**What it is:** A consolidated repository for CS-GY 6643 coursework spanning classical image processing, segmentation, detection/tracking, multimodal Kaggle workflows, and geolocation.

**What it solves**
- Organizes diverse computer vision assignments/experiments into one portfolio with reusable scripts, notebooks, checkpoints, and write-ups
- Demonstrates breadth across classical CV, deep learning, tracking, medical imaging, and Kaggle-style pipelines

**Key projects**
- Project 01: Classical pipeline for astronomical image restoration, template matching, and geometric alignment validation (including Procrustes analysis)
- Project 2: Multi-organ nuclei segmentation/classification with CellPose fine-tuning, XML polygon parsing, Albumentations transforms, and Kaggle-ready RLE submissions
- Project 3: Object detection, Kalman filter tracking, and baseball pitch-tracking Kaggle workflows using multimodal (vision + tabular) approaches
- Project 4: GeoGuessr-style U.S. state geolocation pipeline with transfer learning, checkpointed training, and submission generation

**What this shows**
- End-to-end coverage of the CV curriculum across restoration, segmentation, tracking, multimodal modeling, and geo-localization
- Ability to move from assignment prompts to working pipelines across both classical and deep learning CV tasks
- Reproducible experimentation with structured project layouts and environment guidance

**Tech:** Python, PyTorch, OpenCV, Albumentations, CellPose, YOLO, Kalman Filter, Jupyter, Kaggle workflows, transfer learning  
**Repo:** https://github.com/swooshie/computer-vision

---

## Artificial Intelligence Project Suite
**Context:** Artificial Intelligence coursework (multi-assignment implementation suite)  
**What it is:** A set of AI course assignments that turns class topics into working notebooks and systems across theory, ML, CV, planning, retrieval, and data pipelines.

**What it solves**
- Demonstrates practical implementation of AI topics beyond theory-only coursework
- Consolidates diverse assignments into a single repo for review, discussion, and reuse

**What I built**
- Assignments covering Information Theory, Exponential Distribution, polynomial linear regression, and Stochastic Gradient Descent with documented notebook explanations
- Anomaly detection workflows using anomalib with PatchCore and EfficientAD, plus related receptive-field and similarity-search components
- Computer vision tasks for object detection, Kalman filter-based tracking, and vehicular traffic counting from video
- A PDDL-based LLM routing system (domain/problem/validation/solver flow) paired with an OpenRouter API implementation for runtime routing
- A video-data ETL + featurization pipeline using MongoDB, OpenCLIP, BERT, spaCy, and Qdrant for semantic retrieval and timestamp-based clipping

**Impact**
- Showcases breadth across planning, CV, anomaly detection, retrieval, and ETL/feature pipelines in one coursework suite
- Produces reusable notebook-based implementations with documented explanations for technical review

**Tech:** Python, Jupyter, TensorFlow, anomalib, PatchCore, EfficientAD, Qdrant, OpenCLIP, BERT, spaCy, MongoDB, PDDL, Fast Downward, OpenRouter API, YOLOv4-CSP, Kalman Filter  
**Repo:** https://github.com/swooshie/Artificial-Intelligence-Project

---

## Machine Learning Foundations (Selected)
These repos focus on algorithmic depth rather than productization.

### SVM vs Kernel Logistic Regression
- Comparative study of SVM and KLR with kernel and hyperparameter analysis  
Repo: https://github.com/swooshie/svm-vs-kernel_logistic_regression

### Fisher’s Linear Discriminant (From Scratch)
- Full Python implementation of FLD without ML libraries  
Repo: https://github.com/swooshie/Fishers-Linear-Discriminant

### Autoregressive N-gram Text Generator
- Text generation from Project Gutenberg using n-gram models  
Repo: https://github.com/swooshie/autoregressive-model

---

## Web and App Projects

### To-Do Listings
- CRUD-style JavaScript app with MVC-style structure  
Repo: https://github.com/swooshie/todo-listings

### World Clock (Flutter)
- Mobile app showing global time zones  
Repo: https://github.com/swooshie/worldClock

---

## Older Coursework, Systems, and Forks
These repositories are kept for reference and learning history and are not representative of my current work:
- LexicalAnalyzer
- SocketProgramming
- CPUsim
- Database Project
- Search Engines
- MERN CRUD (fork)
- Hostel Server / Allotment (forks)
- node-js-playlist (fork)

---

_Last updated from GitHub, resume, and LinkedIn._
