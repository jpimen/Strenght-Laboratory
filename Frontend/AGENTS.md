---
agents:
  - name: Frontend
    description: Frontend development with the Frontend Excellence skill - builds high-quality UI/UX following professional patterns and best practices
    skills:
      - ./SKILL.md
    keywords: [component, feature, ui, ux, react, nextjs, typescript, styling, state, hooks]

instructions: |
  When working on frontend features, apply the Frontend Excellence skill to ensure:
  - Type-first development with clear TypeScript interfaces
  - Feature-based architecture with proper separation of concerns
  - Quality checklist compliance before marking features complete
  
  This agent is the primary developer for all frontend work in this project.
---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
