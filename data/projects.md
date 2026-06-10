# Projects

This document emphasizes projects and initiatives that best represent Aditya's current profile for recruiter and interview conversations.

---

## Smart Task Manager
**Context:** Production-style full-stack productivity app showing AI suggestions, place-linked reminders, Telegram-first messaging, distributed service architecture, authentication, caching, CI/CD, and live deployment tradeoffs

### Product problem
Task CRUD alone is not enough to demonstrate senior engineering judgment. This project turns a familiar task manager into a multi-service system where frontend UX, API orchestration, persistence, cache behavior, ML recommendations, location-aware reminders, messaging workflows, deployment constraints, and dependency failures are handled explicitly.

### Users and stakeholders
- Portfolio visitors and recruiters evaluating full-stack/backend architecture ability
- Users of a live task management app with authenticated task workflows, AI-assisted suggestions, saved places, and quick chat actions

### What I built
- Next.js App Router frontend in TypeScript with login/signup, dashboard task management, filtering, sorting, suggestions, saved-place management, browser current-location capture, OpenStreetMap/Nominatim search, Leaflet map selection, Framer Motion transitions, and optimistic updates
- ASP.NET Core Web API using .NET, JWT authentication, repository and service layers, MongoDB persistence, Redis caching, Swagger configuration, reminder decisioning, outbound message dispatch, Telegram webhook handling, Linq webhook handling, and CORS for the frontend
- Python FastAPI recommendation service using Scikit-learn TF-IDF similarity, user-history boosts, category-aware scoring, deduplication, score thresholding, and safe fallback behavior
- Cross-service recommendation flow where the .NET backend owns auth/task state and calls the Python recommender only as a bounded dependency
- Location-aware reminder flow where tasks can be linked directly to saved places, nearby linked tasks are grouped into one reminder, and chat replies can complete or snooze the matched reminder context
- Telegram-first messaging workflow with Linq retained as an optional text/iMessage-style fallback path and explicit provider-specific failure handling
- CI/CD flow that validates frontend build, .NET backend build, and Python recommender import/smoke checks before deployment

### Architecture
- Frontend: Next.js + TypeScript + Tailwind CSS + Framer Motion + Leaflet, deployed on Vercel
- Backend: ASP.NET Core Web API with JWT auth, repository/service pattern, MongoDB Atlas, Redis/Upstash cache, Telegram and Linq webhook integrations, deployed on Render
- ML service: Python FastAPI recommender with TF-IDF in production and optional transformer path disabled for deployment reliability
- Operations: GitHub Actions for multi-service CI, Render deploy hooks, Vercel GitHub deployment, and cron-job.org keep-alive pings for free-tier cold starts
- Messaging: Telegram bot as the primary free channel, with Linq retained as a legacy optional fallback

### Technical challenge
The main challenge was coordinating reminders across web location updates, saved places, task state, and messaging context without overclaiming browser background behavior. Location checks run while the dashboard is open and visible, so the API decisioning layer has to treat the web app as the active location reporter and messaging as the completion/snooze surface. The backend also still treats the recommendation engine as an unreliable distributed dependency rather than as a happy-path function call.

### Engineering tradeoffs
- Made the product web-first instead of claiming true background geofencing; current location checks run while the dashboard is open, currently every 30 seconds
- Used Telegram as the primary messaging provider because it is free and bot-friendly, while retaining Linq as an optional fallback for text/iMessage-style flows
- Grouped multiple tasks linked to the same nearby place into one reminder to reduce notification noise
- Kept reminder actions command-based with HELP, LIST, ADD, DONE, DONE <number>, DONE ALL, DELETE <number>, and SNOOZE 30 so chat handling stays predictable
- Chose a separated Python ML service instead of embedding recommendation logic in .NET so the recommender can evolve independently
- Replaced transformer inference with TF-IDF in production because transformer memory/startup cost was too high for free-tier deployment reliability
- Used Redis caching to reduce repeat recommendation calls, improve response consistency, and lower dependency pressure
- Added retry logic scoped to recommendation calls so transient recommender failures are handled without blindly retrying all backend operations
- Returned empty/default-safe recommendation responses so core task workflows remain usable when the recommender is unavailable

### Tech stack
Next.js, TypeScript, Tailwind CSS, Framer Motion, Leaflet, OpenStreetMap, Nominatim, ASP.NET Core, C#, .NET, JWT, Telegram Bot API, Linq webhooks, MongoDB Atlas, Redis, Upstash, Python, FastAPI, Scikit-learn, TF-IDF, Docker, GitHub Actions, Vercel, Render

### Outcome
- Demonstrates a production-oriented distributed system across frontend, API, database, cache, ML service, maps/location, and messaging provider boundaries
- Shows a complete product workflow: link messaging, save a place, attach a task to that place, report active browser location, receive a grouped reminder near that place, and complete or snooze it from chat
- Shows practical reliability decisions around cold starts, retry behavior, cache hits, service fallback, and memory-constrained ML deployment
- Reduced recommendation latency by roughly 70% with TF-IDF plus Redis caching versus heavier repeated ML calls
- Reduced redundant recommendation computation by roughly 50% through caching
- Provides a live deployed app and codebase for recruiter/interviewer review

### Links
- Repo: https://github.com/swooshie/smart-task-manager
- Live app: https://smart-task-manager-ashy.vercel.app/

---

## Poker AI - Sealed-State Multi-Agent Simulation
**Context:** NYC Tech Week Hackathon project and Top 8 finalist among 130 builders, co-hosted by NVIDIA and a16z

### Product problem
Most multi-agent demos give every agent shared context. Poker is a useful test surface because private information matters: each player should know only its own cards, maintain its own memory, infer intent from public table state, and reveal its reasoning only after the hand is complete.

### Users and stakeholders
- Hackathon judges evaluating agentic architecture, product clarity, and demo reliability
- Recruiters and interviewers evaluating multi-agent systems, backend design, and AI product execution

### What I built
- Designed the agentic graph and backend skeleton for 4 LLM-powered poker agents
- Defined agent system prompts with 4 distinct behavioral profiles and bluff rates ranging from 0% to 40%
- Built an offline generation pipeline using OpenRouter with NVIDIA Nemotron 70B to produce a static JSON event log
- Fed the generated JSON event log into a React playback frontend so the demo required 0 runtime LLM calls
- Created an ElevenLabs voice synthesis pipeline generating one MP3 per agent action
- Added subtitle fallback behavior if audio playback fails
- Built a post-hand reveal modal surfacing each agent's full reasoning after the hand concludes
- Tagged reasoning with BLUFF, TRAP, HERO_CALL, TILT, and OPTIMAL_FOLD labels

### Architecture
- Agents operate with sealed private state and independent per-agent memory
- Each agent sees only its own hole cards, its own history, and public table state
- No agent sees another agent's private reasoning until the post-hand reveal
- LLM outputs are generated offline and serialized into a static JSON event log
- React playback consumes the static event log for reliable demo execution

### Why this matters
Poker is only the demo surface. The same sealed-information architecture generalizes to adversarial and private-information simulations such as M&A negotiation, litigation strategy, and competitive market analysis.

### Tech stack
Python, React, JavaScript, OpenRouter, NVIDIA Nemotron 70B, ElevenLabs, JSON

### Outcome
- Top 8 finalist at NYC Tech Week Hackathon among 130 builders
- Demo used 4 LLM-powered agents with isolated private state
- Demo made 0 runtime LLM calls because outputs were pre-generated offline

### Links
- Repo: https://github.com/swooshie/poker-ai

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
- Integrate SMS/email-style recipient messaging using MailApp in Google Apps Script while minimizing unnecessary sends
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
- Coupons are distributed via email and SMS-style messaging using MailApp in Google Apps Script
- Recipient adds coupon to Apple Wallet
- At redemption, scanned coupon ID is validated against campaign/coupon records in Sheets
- Remaining-use counter is updated based on redemption rules
- Re-scan/reuse attempts are validated again through the same ID + counter checks

### Technical challenge
- Understanding and implementing PassKit API/documentation under assessment constraints
- Integrating online QR scanning into a reliable redemption workflow
- Balancing complete functionality with careful MailApp usage and reliable recipient delivery under assessment constraints
- Resolving Apple developer certificate issues during pass integration/testing
- Defining a practical QR redemption strategy (ID-based QR validation instead of only link-based QR)

### Tech stack
Google Apps Script, JavaScript, HTML/CSS, Bootstrap, Google Sheets, PassKit API, MailApp

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
- Served as sole engineer on NYU GEMSS's production Asset Management System, owning the full codebase, infrastructure, CI/CD pipeline, and Dockerized deployment for a system managing 8,000+ devices and 300+ employees across the Admissions department
- Drove phased AI-assisted migration from Google Apps Script to a Node.js/Express, TypeScript, and MongoDB architecture
- Built an MVC-structured REST API layer with 10+ endpoints for AMS operations
- Consolidated multi-sheet batching logic into a single API layer to simplify data access patterns
- Introduced real-time data sync while preserving Google Sheets access during transition
- Preserved business-critical HTML/CSS workflows, including device-to-floor-plan mapping, shipping operations, and advanced table filtering
- Replaced Apps Script backend logic with API-driven data services for asset assignment and operations tracking
- Added OAuth-based authentication to improve security
- Engineered a fault-tolerant concurrent form submission system for employee onboarding/offboarding workflows, cutting retry failures by 40% under peak load
- Replaced slow service-layer search with a set-theory-backed compound filtering engine, improving record lookup speed by 50% across 8,000+ device records
- Used Agentic AI/Codex-assisted workflows to accelerate migration implementation and refactoring tasks
- Delivered in Agile workflow cycles with iterative validation against operational requirements

### Why this matters
- Reduces spreadsheet-bound performance bottlenecks in manager-critical workflows
- Replaces brittle script-centric logic with API-driven architecture
- Improves security with authenticated access controls
- Improves long-term scalability and maintainability for internal operations

### Tech stack
JavaScript/TypeScript, Node.js, Express, MongoDB Atlas, HTML/CSS, Google Apps Script (legacy), Google Sheets (legacy), OAuth, Docker, CI/CD, MVC, public VPS hosting

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
