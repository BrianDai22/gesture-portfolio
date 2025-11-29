<objective>
Perform an exhaustive code quality review of the gesture-portfolio codebase - a camera-based, gesture-controlled portfolio website using MediaPipe hand tracking and Three.js.

This review will identify issues, document best practices compliance, and provide actionable recommendations across security, maintainability, and performance dimensions.
</objective>

<context>
Project: Gesture-controlled portfolio website
Tech stack: Vanilla JavaScript (ES modules), Three.js for 3D rendering, MediaPipe for hand tracking
Architecture: Browser-based, camera access for gesture recognition, 3D scene navigation

Read @CLAUDE.md for project conventions and guidelines before beginning analysis.
</context>

<data_sources>
Thoroughly examine all source files:
- @src/js/core/*.js - Core application logic (app.js, handTracking.js)
- @src/js/scene/*.js - Three.js scene management
- @src/js/gestures/*.js - Gesture recognition system
- @src/js/ui/*.js - UI components
- @index.html - Main HTML structure
- @src/css/*.css - Stylesheets

Also examine:
- @package.json - Dependencies
- Any configuration files present
</data_sources>

<analysis_requirements>

<security_analysis>
Thoroughly analyze for security vulnerabilities:

1. **XSS Prevention**
   - Check for unsafe DOM manipulation patterns (innerHTML, legacy document writing methods)
   - Verify user input sanitization
   - Review dynamic content injection

2. **Content Security Policy**
   - Verify CSP headers/meta tags are properly configured
   - Check for inline scripts/styles that violate CSP
   - Identify any dynamic code execution patterns

3. **Camera/Media Security**
   - Review camera permission handling
   - Check for proper stream cleanup on page exit
   - Verify no unintended data transmission

4. **Data Validation**
   - Check all external data inputs (query params, storage, etc.)
   - Verify type checking and bounds validation
   - Review error handling for security implications
</security_analysis>

<maintainability_analysis>
Deeply examine code organization and quality:

1. **Code Structure**
   - Module organization and separation of concerns
   - Consistent naming conventions (camelCase, descriptive names)
   - File and folder structure appropriateness

2. **Code Quality**
   - DRY principle adherence (identify duplicated code)
   - Single Responsibility Principle compliance
   - Function/method length and complexity
   - Magic numbers and hardcoded values

3. **Documentation**
   - JSDoc comments for public APIs
   - Inline comments for complex logic
   - README and setup documentation adequacy

4. **Error Handling**
   - Consistent error handling patterns
   - User-facing error messages
   - Logging and debugging support

5. **Dependencies**
   - External library usage appropriateness
   - Version pinning and update strategy
   - Bundle size implications
</maintainability_analysis>

<performance_analysis>
Identify optimization opportunities:

1. **Memory Management**
   - Check for memory leaks (event listeners, closures, timers)
   - Three.js object disposal patterns
   - MediaPipe resource cleanup

2. **Render Performance**
   - Animation frame handling (requestAnimationFrame usage)
   - Three.js render loop efficiency
   - DOM manipulation batching

3. **Initialization**
   - Lazy loading opportunities
   - Asset loading strategy
   - Camera/MediaPipe initialization timing

4. **Event Handling**
   - Event listener cleanup
   - Debouncing/throttling for frequent events
   - Event delegation patterns

5. **Resource Usage**
   - Camera frame processing efficiency
   - Gesture detection optimization
   - WebGL context management
</performance_analysis>

</analysis_requirements>

<output_format>

Structure the analysis as follows:

## Executive Summary
- Overall code quality rating (1-10)
- Critical issues count by category
- Top 3 priority recommendations

## Security Analysis
### Critical Issues
### High Priority Issues
### Medium Priority Issues
### Best Practices Compliance

## Maintainability Analysis
### Code Organization Assessment
### Technical Debt Identified
### Refactoring Recommendations
### Documentation Gaps

## Performance Analysis
### Memory Management Issues
### Render Performance Issues
### Optimization Opportunities

## Detailed Findings
For each issue found, document:
- **Location**: file:line_number
- **Severity**: Critical / High / Medium / Low
- **Description**: What the issue is
- **Impact**: Why it matters
- **Recommendation**: How to fix it
- **Code Example**: Before/after when applicable

## Action Items
Prioritized list of improvements with effort estimates (small/medium/large)

Save analysis to: `./analyses/001-code-review.md`
</output_format>

<verification>
Before completing, verify:
- All JavaScript files in src/js have been examined
- Security analysis covers all OWASP-relevant concerns
- Performance analysis includes Three.js and MediaPipe specific considerations
- Every finding includes location, severity, and actionable recommendation
- Action items are prioritized by impact vs effort
</verification>

<success_criteria>
- Comprehensive coverage of all source files
- At least 10 specific, actionable findings documented
- Clear severity ratings for all issues
- Prioritized action items ready for implementation
- Analysis saved to ./analyses/001-code-review.md
</success_criteria>
