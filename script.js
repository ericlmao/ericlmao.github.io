const USER = "ericlmao";
const FEATURED = new Set([
  "alumina", "pew", "leaderboardsplus", "timezone-catalog", "kotlinkitpvp", "jda-extras",
  `${USER}.github.io`, USER,
]);
const LANG_CLASS = { Java: "java", Kotlin: "kt", TypeScript: "ts", Shell: "sh" };

document.getElementById("year").textContent = new Date().getFullYear();

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

async function loadRepos() {
  const list = document.getElementById("repo-list");
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=30&type=owner`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json())
      .filter((r) => !r.fork && !r.archived && !FEATURED.has(r.name.toLowerCase()))
      .slice(0, 8);

    list.replaceChildren();
    if (!repos.length) {
      list.append(el("li", "repo-empty", "No other public repositories yet."));
      return;
    }
    for (const repo of repos) {
      const li = el("li");
      const a = el("a");
      a.href = repo.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.append(el("span", "repo-name", repo.name));
      const meta = el("span", "repo-meta");
      if (repo.language) {
        meta.append(el("span", `lang ${LANG_CLASS[repo.language] ?? ""}`, repo.language));
        meta.append(" · ");
      }
      meta.append(timeAgo(repo.pushed_at));
      a.append(meta);
      a.append(el("span", "repo-desc", repo.description || "No description."));
      li.append(a);
      list.append(li);
    }
  } catch {
    list.replaceChildren(el("li", "repo-empty", "Couldn't load repositories right now. See them on GitHub."));
  }
}

async function loadStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}`);
    if (!res.ok) return;
    const user = await res.json();
    document.querySelector('[data-stat="repos"]').textContent = user.public_repos;
    document.querySelector('[data-stat="since"]').textContent = new Date(user.created_at).getFullYear();
  } catch {
    /* keep static fallback values */
  }
}

loadRepos();
loadStats();
