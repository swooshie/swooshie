# Projects

This document emphasizes projects and initiatives that best represent Aditya's current profile for recruiter and interview conversations.

---

## Kafka Microservice Transfer Optimization (Sainapse)
**Context:** Production platform engineering initiative during tenure as Software Development Engineer at Sainapse

### Business problem
File transfer between microservices was inefficient and storage-heavy. Because data moved across multiple services, storage overhead and transfer complexity were increasing.

### Users and stakeholders
- Internal platform microservices consuming large file/data transfers
- Engineering teams responsible for data adapter and downstream processing services

### What I built
- Introduced a Kafka-based transfer pipeline for inter-service file movement
- Used byte-level serialization/deserialization for streaming transfer
- Designed runtime-aware consumer handling based on active consumer availability
- Enabled parallel consumer fetching and reassembly into the World View server microservice for storage

### Technical challenge
The hardest part was parallelizing consumer processing safely and handling consumer spawning/availability without breaking transfer correctness.

### Tech stack
Java, Spring Boot, Apache Kafka, microservices architecture

### Outcome
- Reduced storage complexity by ~33%
- Improved transfer time by ~35% versus prior flow
- Created a more scalable pattern for multi-consumer file transfer workflows

### Ownership summary
Implemented as part of core platform engineering responsibilities at Sainapse, with direct focus on transfer architecture and parallel consumer flow.

---

## Apple Wallet Coupon System (Interview Assessment)
**Context:** Full-stack technical assessment for NYU Admissions software developer interview process

### Assessment objective
Build and deliver, by the stated deadline (December 27), a Google Apps Script web app using Bootstrap + JavaScript + HTML/CSS with Google Sheets as the system of record for coupon campaigns and redemption.

### Assessment requirements provided
- Implement coupon creation parameters and campaign options
- Implement redemption process and restriction logic
- Use Google Sheets as database for fields such as expiration, recipient, discount amount, and remaining uses
- Integrate SMS functionality via Twilio while minimizing message usage (usage tracked as an evaluation signal)
- Select and integrate an Apple Wallet-compatible pass generation API (documented for reviewer access)
- Implement QR code generation, error handling, and redemption tracking
- Host inside NYU Google Workspace environment and provide testing/access instructions
- Deliver both speed and quality under interview evaluation constraints

### What I built
- Admin workflow to create and manage coupon campaigns
- PassKit API integration for coupon lifecycle and redemption handling
- QR-based redemption flow including online scanner integration
- Validation logic to handle duplicate redemption and count integrity issues

### End-to-end flow implemented
- Manager creates a coupon campaign in the app
- System checks Google Sheets to avoid duplicate campaign setup
- If valid, pass/coupon creation is triggered via PassKit and campaign details are persisted in Sheets
- Coupons are distributed via email and SMS (Twilio)
- Recipient adds coupon to Apple Wallet
- At redemption, scanned coupon ID is validated against campaign/coupon records in Sheets
- Remaining-use counter is updated based on redemption rules
- Re-scan/reuse attempts are validated again through the same ID + counter checks

### Technical challenge
- Understanding and implementing PassKit API/documentation under assessment constraints
- Integrating online QR scanning into a reliable redemption workflow
- Balancing complete functionality with careful Twilio usage under tracked API-cost constraints
- Resolving Apple developer certificate issues during pass integration/testing
- Defining a practical QR redemption strategy (ID-based QR validation instead of only link-based QR)

### Tech stack
Google Apps Script, JavaScript, HTML/CSS, Bootstrap, Google Sheets, PassKit API

### Outcome
Delivered a complete end-to-end assessment implementation that demonstrated full-stack execution, API integration, workflow design, and validation logic.
- Completed implementation in approximately 2-3 weeks
- Received positive supervisor feedback that this submission implemented features many candidates did not fully complete

### Interview impact
This project was part of the interview process that led to the NYU role outcome.

### Design insight used
Redemption UX decisions were informed by observing real Apple Wallet pass behavior from consumer brands (for example Chipotle and H&M), then adapting that pattern to an ID-driven validation flow for this assessment.

---

## Portfolio Chatbot (This Website)
**Context:** Portfolio product enhancement for recruiter/interviewer self-service Q&A

### Problem addressed
The portfolio had substantial content, and recruiters were unlikely to read every section in detail. I wanted a faster way for visitors to ask direct questions about my background and get relevant answers.

### What I built
- Chatbot interface embedded into my portfolio website
- Frontend in HTML/CSS
- Backend in PHP with markdown-based knowledge files covering my professional profile, experience, projects, skills, and coursework
- Query flow that maps user question -> retrieves relevant markdown context -> sends prompt to Gemini -> returns contextual answer
- Retrieval logic that prioritizes source files by intent and applies fallback behavior when context is missing

### Business/use-case value
- Gives recruiters and hiring managers a quicker way to evaluate role fit
- Turns static portfolio content into interactive Q&A
- Helps visitors understand my experience without scanning every page section

### Tech stack
JavaScript, PHP API, markdown knowledge files, retrieval/ranking logic, Gemini API integration

### Outcome
A working portfolio assistant that answers from structured markdown context about my professional life. I am actively improving answer quality and coverage.

### Key challenges and improvements
- Challenge: making the chatbot UI intuitive enough for recruiter use
- Challenge: improving answer quality so responses stay specific and useful
- Constraint: Gemini free-tier request limits could cause visible failures
- Improvement: refined prompts to improve answer quality and grounding
- Improvement: added round-robin model fallback across available free Gemini models to reduce user-visible API limit failures

---

## NYU Workflow Modernization (Apps Script/Sheets to Node.js/Express + MongoDB Atlas, Agent-AI Workflow Direction)
**Context:** Ongoing modernization work at NYU GEMSS

### Business problem
The legacy Google Apps Script Asset Management System (AMS) page, used by NYU Admissions managers to monitor staff, corporate devices, accessories, shipping, and department operations, became increasingly slow as Google Sheets volume, rows/columns, and sheet count grew.

### What I built / contributed
- Helped drive migration from Apps Script/Sheets to a public VPS architecture using Node.js/Express and MongoDB Atlas
- Designed and implemented 10+ REST endpoints for AMS operations
- Consolidated multi-sheet batching logic into a single API layer to simplify data access patterns
- Preserved business-critical HTML/CSS workflows, including device-to-floor-plan mapping, shipping operations, and advanced table filtering
- Replaced Apps Script backend logic with API-driven data services for asset assignment and operations tracking
- Added OAuth-based authentication to improve security
- Used Agentic AI/Codex-assisted workflows to accelerate migration implementation and refactoring tasks
- Delivered in Agile workflow cycles with iterative validation against operational requirements

### Why this matters
- Reduces spreadsheet-bound performance bottlenecks in manager-critical workflows
- Replaces brittle script-centric logic with API-driven architecture
- Improves security with authenticated access controls
- Improves long-term scalability and maintainability for internal operations

### Tech stack
JavaScript/TypeScript, Node.js, Express, MongoDB Atlas, HTML/CSS, Google Apps Script (legacy), Google Sheets (legacy), OAuth, public VPS hosting

### Outcome
- Established a practical modernization foundation for internal workflow software used by administrative teams
- Reduced the heaviest retrieval page from roughly 10 seconds to near-instant response (milliseconds/sub-second range on key paths)

---

## Additional Technical Projects

### Python Script Execution API (nsjail sandbox)
Secure code execution API with strict isolation controls and cloud-ready deployment.
Repo: https://github.com/swooshie/python-executor

### Market Data Microservice
Event-driven microservice for market data ingestion and analytics-ready processing.
Repo: https://github.com/swooshie/market-data-microservice

### Computer Vision Portfolio (CS-GY 6643)
Coursework portfolio spanning restoration, segmentation, tracking, multimodal workflows, and geolocation.
Repo: https://github.com/swooshie/computer-vision

### Artificial Intelligence Project Suite
Multi-assignment implementation suite covering AI theory, planning, anomaly detection, CV, and retrieval pipelines.
Repo: https://github.com/swooshie/Artificial-Intelligence-Project

---

_Last updated from interview/project notes and portfolio context._
