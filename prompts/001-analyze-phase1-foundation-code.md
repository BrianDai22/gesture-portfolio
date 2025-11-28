<objective>
Thoroughly analyze all Phase I (Foundation) code for codebase structure, performance, and code quality.

Purpose: Evaluate what was built correctly, identify issues, and provide actionable recommendations before Phase 2 begins. This analysis will inform improvements and code review prep.

Output: A detailed analysis report saved to `./analyses/phase1-foundation-analysis.md`
</objective>

<context>
This is a gesture-controlled portfolio website using:
- Vanilla JavaScript (ES Modules)
- Three.js (3D graphics)
- MediaPipe Hands (hand tracking)
- No build tools - uses live-server for development

Phase I established the foundation with 3 plans:
1. GitHub repo and project structure
2. Dev server setup with live-server
3. HTML scaffold, CSS, and JS entry point
</context>

<files_to_analyze>
Examine each of these files thoroughly:

@index.html - HTML5 scaffold with CDN imports for Three.js and MediaPipe
@styles/main.css - Minimalist dark theme with CSS custom properties
@src/js/main.js - ES module entry point (currently minimal)
@package.json - npm configuration with live-server
@.gitignore - Git ignore patterns
@README.md - Project documentation

Also examine:
- Directory structure (src/js/, styles/, assets/)
- Any other files in the project root
</files_to_analyze>

<analysis_requirements>

<section name="Codebase Structure">
Evaluate:
- Directory organization and conventions
- File naming patterns
- Logical separation of concerns
- Scalability of current structure for future phases
- Alignment with vanilla JS + ES modules patterns

Questions to answer:
- Is the structure appropriate for a no-build-tool project?
- Will this structure scale as more modules are added in Phase 2?
- Are there any structural anti-patterns?
</section>

<section name="Performance">
Evaluate:
- CDN import strategy (blocking vs async, defer)
- CSS efficiency (reflows, repaints potential)
- JavaScript loading strategy
- Asset loading (current and potential issues)
- Network waterfall implications

Questions to answer:
- Are CDN scripts loading optimally?
- Are there any render-blocking resources?
- Is the CSS optimized for the full-viewport canvas use case?
</section>

<section name="Code Quality">
For each file, evaluate:

HTML (index.html):
- Semantic HTML5 usage
- Accessibility (a11y) considerations
- Meta tags completeness
- Script/link ordering
- CDN version pinning and security (SRI hashes)

CSS (styles/main.css):
- CSS custom properties usage
- Specificity management
- Reset approach effectiveness
- Maintainability for future expansion
- Browser compatibility

JavaScript (src/js/main.js):
- ES module patterns
- Code organization for growth
- Error handling (or lack thereof)
- Documentation quality

Supporting files:
- package.json completeness
- .gitignore coverage
- README.md accuracy

Questions to answer:
- What is done well and should be maintained?
- What should be improved before Phase 2?
- Are there any bugs or issues?
- Are there security considerations?
</section>

</analysis_requirements>

<output_format>
Create a detailed markdown report at `./analyses/phase1-foundation-analysis.md` with this structure:

```markdown
# Phase I Foundation Analysis

## Executive Summary
[2-3 sentence overview of findings]

## Overall Assessment
[Grade: A/B/C/D/F with brief justification]

---

## Codebase Structure Analysis

### What's Good
[Bullet points of structural strengths]

### Issues Found
[Bullet points of problems with severity: Critical/Medium/Low]

### Recommendations
[Specific, actionable improvements]

---

## Performance Analysis

### What's Good
[Performance strengths]

### Issues Found
[Performance problems with severity]

### Recommendations
[Specific optimizations]

---

## Code Quality Analysis

### index.html
**Grade: [A-F]**
- Strengths: [list]
- Issues: [list with severity]
- Recommendations: [list]

### styles/main.css
**Grade: [A-F]**
- Strengths: [list]
- Issues: [list with severity]
- Recommendations: [list]

### src/js/main.js
**Grade: [A-F]**
- Strengths: [list]
- Issues: [list with severity]
- Recommendations: [list]

### Supporting Files
[Brief assessment of package.json, .gitignore, README.md]

---

## Security Considerations
[Any security-related observations]

---

## Priority Actions Before Phase 2
[Ordered list of recommended changes, most important first]

---

## Appendix: File-by-File Details
[Optional: Line-by-line observations if significant]
```
</output_format>

<verification>
Before completing the analysis:
- [ ] All 6 main files have been read and analyzed
- [ ] Each analysis section (structure, performance, quality) is complete
- [ ] Grades are justified with specific evidence
- [ ] Recommendations are specific and actionable
- [ ] Report saved to ./analyses/phase1-foundation-analysis.md
</verification>

<success_criteria>
- Comprehensive coverage of all Phase I files
- Clear identification of strengths and weaknesses
- Actionable recommendations with priority ordering
- Analysis enables informed decisions for Phase 2
- No generic or vague assessments - all points backed by specific observations
</success_criteria>
