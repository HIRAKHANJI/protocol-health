// ruleCard: returns an HTML card for one rule (number, title, sub-text, optional accent color)
export function ruleCard(num, title, sub, color='var(--accent)') {
  return `<div class="rule-card" style="border-left-color:${color}"><div class="rule-num">${num}</div><div class="rule-text">${title}</div>${sub ? `<div class="rule-sub">${sub}</div>` : ''}</div>`;
}
