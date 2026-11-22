import glob
import re

CREATOR_HTML = """          <div class="footer__creator">
            <span>Made by</span>
            <a href="https://adicrest.com" target="_blank" rel="noopener" aria-label="Website designed and built by Adicrest.com">
              <span>Adicrest.com</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 1.5h7v7M10.5 1.5l-8 8"/></svg>
            </a>
          </div>"""

pattern = re.compile(
    r'(<div class="footer__base">\s*<p>.*?</p>)(\s*<div class="footer__base-links">)',
    re.DOTALL
)

updated_count = 0
for filepath in sorted(glob.glob("*.html")):
    if filepath == "old_website.html":
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if 'class="footer__creator"' in content:
        print(f"Already updated: {filepath}")
        continue

    match = pattern.search(content)
    if match:
        replacement = match.group(1) + "\n" + CREATOR_HTML + match.group(2)
        new_content = pattern.sub(replacement, content, count=1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
        updated_count += 1
    else:
        print(f"Pattern NOT matched in: {filepath}")

print(f"\nTotal files updated: {updated_count}")
