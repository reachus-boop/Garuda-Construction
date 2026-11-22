const fs = require('fs');
const path = require('path');

// 1. Update calculator.html
const calcFile = path.join(__dirname, '..', 'public', 'calculator.html');
let calcHtml = fs.readFileSync(calcFile, 'utf8');

const oldCardsStart = '<div class="pkg-cards-grid pkg-cards-grid--compact" id="packages-cards" data-reveal>';
const oldCardsEnd = '<!-- FAQ SECTION';

const newCompactCards = `<div class="pkg-cards-grid pkg-cards-grid--compact" id="packages-cards" data-reveal>
            <!-- Basic Package -->
            <div class="pkg-card pkg-card--compact" data-pkg="basic">
              <div class="pkg-card__top">
                <span class="pkg-card__tag">Budget</span>
                <h3 class="pkg-card__title">Basic</h3>
                <div class="pkg-card__rate">&#8377;2,089 <span>/ sqft</span></div>
              </div>
              <ul class="pkg-card__features">
                <li><span class="feat-chk">&#10004;</span> Fe550D Steel &amp; 53G</li>
                <li><span class="feat-chk">&#10004;</span> Chamber Red Bricks</li>
                <li><span class="feat-chk">&#10004;</span> Cera Bath &amp; Tiles</li>
                <li><span class="feat-chk">&#10004;</span> 10-Yr Guarantee</li>
              </ul>
              <div class="pkg-card__actions">
                <button type="button" class="pkg-card__btn js-choose-pkg" data-pkg="basic" data-pkg-name="Basic" data-pkg-rate="&#8377;2,089 / sqft">
                  Choose Plan
                </button>
              </div>
            </div>

            <!-- Classic Package -->
            <div class="pkg-card pkg-card--compact is-popular" data-pkg="classic">
              <div class="pkg-card__top">
                <span class="pkg-card__tag">&#9733; Popular</span>
                <h3 class="pkg-card__title">Classic</h3>
                <div class="pkg-card__rate">&#8377;2,289 <span>/ sqft</span></div>
              </div>
              <ul class="pkg-card__features">
                <li><span class="feat-chk">&#10004;</span> Jindal Fe550D</li>
                <li><span class="feat-chk">&#10004;</span> Teak Door + UPVC</li>
                <li><span class="feat-chk">&#10004;</span> Hindware &amp; Granite</li>
                <li><span class="feat-chk">&#10004;</span> 10-Yr Guarantee</li>
              </ul>
              <div class="pkg-card__actions">
                <button type="button" class="pkg-card__btn js-choose-pkg" data-pkg="classic" data-pkg-name="Classic" data-pkg-rate="&#8377;2,289 / sqft">
                  Choose Plan
                </button>
              </div>
            </div>

            <!-- Premium Package -->
            <div class="pkg-card pkg-card--compact" data-pkg="premium">
              <div class="pkg-card__top">
                <span class="pkg-card__tag">Architect</span>
                <h3 class="pkg-card__title">Premium</h3>
                <div class="pkg-card__rate">&#8377;2,489 <span>/ sqft</span></div>
              </div>
              <ul class="pkg-card__features">
                <li><span class="feat-chk">&#10004;</span> UltraTech &amp; Jindal</li>
                <li><span class="feat-chk">&#10004;</span> Teak Main + Puja</li>
                <li><span class="feat-chk">&#10004;</span> Jaquar &amp; Granite</li>
                <li><span class="feat-chk">&#10004;</span> 10-Yr Guarantee</li>
              </ul>
              <div class="pkg-card__actions">
                <button type="button" class="pkg-card__btn js-choose-pkg" data-pkg="premium" data-pkg-name="Premium" data-pkg-rate="&#8377;2,489 / sqft">
                  Choose Plan
                </button>
              </div>
            </div>

            <!-- Royal Package -->
            <div class="pkg-card pkg-card--compact" data-pkg="royal">
              <div class="pkg-card__top">
                <span class="pkg-card__tag">Luxury</span>
                <h3 class="pkg-card__title">Royal</h3>
                <div class="pkg-card__rate">&#8377;2,689 <span>/ sqft</span></div>
              </div>
              <ul class="pkg-card__features">
                <li><span class="feat-chk">&#10004;</span> UltraTech &amp; Vizag</li>
                <li><span class="feat-chk">&#10004;</span> Carved Teak &amp; UPVC</li>
                <li><span class="feat-chk">&#10004;</span> Kohler &amp; Marble</li>
                <li><span class="feat-chk">&#10004;</span> 10-Yr Guarantee</li>
              </ul>
              <div class="pkg-card__actions">
                <button type="button" class="pkg-card__btn js-choose-pkg" data-pkg="royal" data-pkg-name="Royal" data-pkg-rate="&#8377;2,689 / sqft">
                  Choose Plan
                </button>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="compare-packages.html" class="btn btn--primary" style="padding: 10px 22px; font-weight: 700; font-size: 13.5px;">
              Compare 2 Packages Side-by-Side (Interactive Tool) &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION`;

const sIdx = calcHtml.indexOf(oldCardsStart);
const eIdx = calcHtml.indexOf(oldCardsEnd);

if (sIdx !== -1 && eIdx !== -1) {
  calcHtml = calcHtml.substring(0, sIdx) + newCompactCards + calcHtml.substring(eIdx + '<!-- FAQ SECTION'.length);
  fs.writeFileSync(calcFile, calcHtml, 'utf8');
  console.log('Successfully updated calculator.html with ultra-compact 2-col cards.');
} else {
  console.log('Could not find card boundaries in calculator.html', sIdx, eIdx);
}
