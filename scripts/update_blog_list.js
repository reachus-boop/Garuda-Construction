const fs = require('fs');
const path = require('path');

const blogFile = path.join(__dirname, '..', 'public', 'blog.html');
let html = fs.readFileSync(blogFile, 'utf8');

const newCards = `
            <!-- New Blog 1: House Construction Cost Chennai -->
            <article class="blog-card" data-category="budgeting">
              <div class="blog-card__meta">
                <span class="blog-card__tag">Pricing Guide 2026</span>
                <span class="blog-card__readtime">9 min read</span>
              </div>
              <h2 class="blog-card__title">House Construction Cost in Chennai (2026 Guide) &mdash; Per Sq.Ft Rates in Avadi, Ambattur &amp; OMR</h2>
              <p class="blog-card__summary">
                A comprehensive per-sq.ft rate analysis for building independent houses and duplex villas across Avadi, Ambattur, Poonamallee, Kelambakkam, and OMR. Compare realistic material costs, stage budgets, and avoid hidden charges.
              </p>
              <div class="blog-card__foot">
                <span class="blog-card__author">By Garuda Architecture Team</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <a href="house-construction-cost-chennai.html" class="blog-card__btn" style="text-decoration: none; border-color: var(--terracotta); color: var(--terracotta); font-weight: 700;">Full Article &nearr;</a>
                </div>
              </div>

              <!-- Hidden Full Content for Modal -->
              <div class="blog-card__full-content" hidden>
                <p>Building an independent house in Chennai suburbs requires transparent budgeting. In 2026, average turnkey construction costs range from &#8377;2,089/sq.ft for basic packages up to &#8377;2,689/sq.ft for luxury villas.</p>
                <h3>Regional Cost Breakdown</h3>
                <p>Areas like Avadi and Thiruvallur offer the highest affordability with standard turnkey packages from &#8377;2,089/sq.ft, while high-density urban areas like Ambattur, Vanagaram, and OMR range between &#8377;2,289 and &#8377;2,689/sq.ft depending on architectural specifications and soil conditions.</p>
                <div class="blog-modal__tip">
                  <strong>Full Article:</strong> Read our complete breakdown with calculator links: <a href="house-construction-cost-chennai.html" style="font-weight: 700; color: var(--terracotta); text-decoration: underline;">Open Complete 2026 Cost Guide &rarr;</a>
                </div>
              </div>
            </article>

            <!-- New Blog 2: CMDA vs DTCP Approval Rules -->
            <article class="blog-card" data-category="planning">
              <div class="blog-card__meta">
                <span class="blog-card__tag">Legal &amp; Sanctions</span>
                <span class="blog-card__readtime">10 min read</span>
              </div>
              <h2 class="blog-card__title">CMDA vs DTCP Approval Rules in Chennai Suburbs: Setback Rules, Document Checklist &amp; Process</h2>
              <p class="blog-card__summary">
                Everything you need to know about getting residential building plan sanctions in Avadi, Ambattur, Poonamallee, and Thiruvallur under TNCDBR rules. Setback tables, fees, and single-window portal filing.
              </p>
              <div class="blog-card__foot">
                <span class="blog-card__author">By Chief Architect, Garuda</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <a href="cmda-dtcp-approval-rules-chennai.html" class="blog-card__btn" style="text-decoration: none; border-color: var(--terracotta); color: var(--terracotta); font-weight: 700;">Full Article &nearr;</a>
                </div>
              </div>

              <!-- Hidden Full Content for Modal -->
              <div class="blog-card__full-content" hidden>
                <p>A legally sanctioned building plan from CMDA or DTCP is vital before commencing residential construction in Chennai and Thiruvallur to prevent legal penalties and ensure EB/water connections.</p>
                <h3>TNCDBR Setback Rules</h3>
                <p>Tamil Nadu Combined Development and Building Rules specify mandatory front setbacks of 1.5m for standard residential plots up to 300 sq.m, alongside rear and side setbacks according to road width and building height.</p>
                <div class="blog-modal__tip">
                  <strong>Full Article:</strong> Read our complete guide with setback tables and checklist: <a href="cmda-dtcp-approval-rules-chennai.html" style="font-weight: 700; color: var(--terracotta); text-decoration: underline;">Open Approval Rules Guide &rarr;</a>
                </div>
              </div>
            </article>
`;

if (!html.includes('house-construction-cost-chennai.html')) {
  html = html.replace('<div class="blog-grid">', '<div class="blog-grid">' + newCards);
  fs.writeFileSync(blogFile, html, 'utf8');
  console.log('Successfully updated blog.html with both new blog preview cards.');
} else {
  console.log('blog.html already contains the new cards.');
}
