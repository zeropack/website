<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Final visual QA

- Verify the boundary between the page's final content section and the shared footer at desktop and mobile widths. There must be no unintended strip, margin, padding, or background-colour gap between them.
- Keep clearance for fixed or sticky calls to action inside the relevant shared chrome (for example, footer bottom padding on mobile), not as bottom padding on the page-level main container.
