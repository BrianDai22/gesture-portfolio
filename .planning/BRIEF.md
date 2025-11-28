# Gesture-Controlled Personal Portfolio

**One-liner**: A camera-based, gesture-controlled portfolio website that lets recruiters navigate Brian Dai's resume, projects, and skills using hand movements.

## Problem

Traditional portfolios blend into the crowd. Recruiters see hundreds of similar layouts daily. This portfolio solves that by being the product demonstration itself - showing innovation through the experience of viewing it, not just listing it as a skill.

## Success Criteria

How we know it worked:

- [ ] Camera activates and MediaPipe Hands tracks hand gestures accurately
- [ ] Users can navigate all sections using intuitive hand gestures
- [ ] Fallback mouse/keyboard navigation works for accessibility
- [ ] 3D environment renders smoothly in Chrome (~60fps target)
- [ ] All content from resume is correctly displayed
- [ ] Resume PDF downloads successfully
- [ ] Deployed to AWS S3 + CloudFront (redeploying over existing infrastructure)
- [ ] Gesture tutorial onboards users effectively

## Constraints

- **Frontend**: HTML5 + CSS3 + vanilla JavaScript (ES modules)
- **3D Visuals**: Three.js via CDN
- **Hand Tracking**: MediaPipe Hands via CDN
- **Build Tooling**: No bundler (no Vite/Webpack)
  - Use `<script type="module">` with relative imports
  - Lightweight dev server (e.g., `live-server`) for hot reload during development
  - Verify ES module patterns fit best practices via Context7
- **Timeline**: Complete by November 30th, 2025 (3 days)
- **Hosting**: AWS S3 + CloudFront (existing infrastructure)
- **Browser**: Chrome support required
- **Version Control**: GitHub repo
- **Style**: Minimalist, clean, user-friendly - recruiter-focused UX
- **Complexity**: Simple, not overengineered, but polished

## Out of Scope

What we're NOT building:

- Multi-browser support (Chrome only)
- Backend/database
- User authentication
- Analytics dashboard
- Mobile gesture support
- VR headset integration
- Complex particle effects or heavy animations

## Content Source

All content extracted from: `Dai_Brian_Resume_SWEv4.pdf`

### Sections to Include

1. **Intro/About** - Entrepreneurial full-stack developer, NYU Stern + CS
2. **Experience** - Project HolyGrail, Doppio Labs, Omega Robotics
3. **Projects** - UFC Fight Predictor, Aithlete, SurveiLens, CodeDuels
4. **Skills** - Complete tech stack (see below)
5. **Education** - NYU Stern, Great Neck South HS, awards
6. **Contact** - Email, LinkedIn, GitHub
7. **Download Resume** - PDF download
8. **Gesture Tutorial** - Onboarding overlay for first-time users

### Complete Skills List

**Languages (16):**
Java, Python, GoLang, C, C#, C++, JavaScript, TypeScript, PineV6, HTML, CSS, SQL, R, Kotlin, Rust, Ruby, Shell

**Frameworks & Libraries (10):**
React, SwiftUI, TensorFlow, PyTorch, Scikit-learn, Pandas, HuggingFace, Matplotlib, Selenium, Google ML Kit

**Developer Tools (10):**
Git, Docker, Kubernetes, Pinecone, Supabase, Firebase, Vercel, Cursor, Jupyter Notebook, LLMs (OpenAI, Jina API)

### Experience Details

1. **Project HolyGrail** (Sep 2025 – Present) - Founder & AI Architect
   - Quantitative trading algorithm in Pine Script + Python
   - >70% backtested win rate, DQN reinforcement learning
   - SaaS with 10+ paying users, ~$500 MRR

2. **Doppio Labs** (May 2024 – Present) - Software Engineer Intern
   - 1M+ profiles in Pinecone, ETL pipeline (Go, Selenium)
   - 200+ users, $2.4K+ B2B revenue
   - RAG pipeline, reduced hallucination ~23%

3. **Omega Robotics LLC** (Jan 2021 – June 2023) - Co-Founder & Lead Programmer
   - 5-person SDLC, Agile/Scrum, +20% sprint velocity
   - On-robot ML, 15.51% faster actuator response
   - Raised ~$120K, impacted 250K+ students

### Project Details

1. **UFC Fight Predictor** (Oct 2024 – Present)
   - Logistic models on 6,400+ fights
   - 72.2% AUC, beat Vegas on UFC 310
   - ~400% ROI ($1K → $5K)

2. **Aithlete** (Jan 2021 – Present)
   - SwiftUI AI fitness coach
   - Google ML Kit Pose Detection
   - Custom TensorFlow exercise classification

3. **SurveiLens** - Meta Hackathon 3rd Place (Sep – Oct 2025)
   - Edge CV security platform (React/TypeScript)
   - ~30 FPS TensorFlow inference
   - Sub-3s alert pipeline

4. **CodeDuels** (Jan – June 2025)
   - Real-time multiplayer coding arena
   - TypeScript, React, Supabase, WebSockets
   - Judge0 sandboxed execution

### Education & Awards

- **NYU Stern School of Business** - B.S. Business (Finance), B.A. Computer Science (May 2027)
  - GPA: 3.80/4.00
  - Coursework: DSA, CSO, Linear Algebra, Discrete Math
- **Great Neck South HS** - 4.00 GPA, Top 8%
- **Awards**: USACO Gold, VEX World Finalist (~16/1000), Gold PVSA, AP Scholar with Distinction

### Contact Info

- Email: brian.dai@stern.nyu.edu
- LinkedIn: linkedin.com/in/brian-dai/
- GitHub: github.com/BrianDai22

### Interests

Entrepreneurship, VibeCode, Trading, Bouldering, Calisthenics, Tennis, Hockey, Psychology, Philosophy, Brotherhood, E-Sport

## Development Tools

### Context7 MCP - Documentation Lookup
Use for up-to-date documentation on ALL languages/frameworks:
- **Three.js** - 3D scene, camera, renderer, lighting, materials
- **MediaPipe Hands** - Hand landmark detection, gesture recognition
- **JavaScript ES Modules** - Import/export patterns, module best practices
- **HTML5 APIs** - Video, Canvas, getUserMedia (camera access)
- **CSS3** - Flexbox, Grid, animations, transitions

### Claude Code Skills & Agents
| Tool | Purpose |
|------|---------|
| `frontend-design` skill | Creating polished, minimalist UI components |
| `feature-dev:code-architect` | Design architecture before implementation |
| `feature-dev:code-reviewer` | Review code quality during development |
| `pr-review-toolkit:code-simplifier` | Ensure code stays simple, not overengineered |

### Slash Commands
| Command | When to Use |
|---------|-------------|
| `/taches-cc-resources:run-plan` | Execute each phase plan with fresh context |
| `/commit-commands:commit` | Commit after completing each phase |
| `/taches-cc-resources:debug` | Debug complex issues |
| `/code-review:code-review` | Final review before deployment |
