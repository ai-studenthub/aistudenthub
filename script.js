/* =========================================================
   AI Student Hub — script.js
   Handles: mobile nav toggle, article data rendering,
   live search, and category tab filtering.
   No external libraries.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Mobile nav toggle ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Article data ----------------
     Each entry: title, category (matches tab data-cat),
     description, tool name, and a link. Links point to the
     tool's own site where relevant — replace with your own
     in-depth articles as you write them. */
  var ARTICLES = [
    {
      title: "Turning lecture recordings into clean study notes",
      category: "study",
      tool: "Otter.ai",
      desc: "How to capture a lecture, get an automatic transcript, and turn it into a one-page summary you can actually revise from.",
      link: "https://otter.ai"
    },
    {
      title: "Building flashcards from your own readings in minutes",
      category: "study",
      tool: "Anki + AI add-ons",
      desc: "A workflow for feeding a PDF chapter into a flashcard generator so spaced repetition starts the same day you read it.",
      link: "https://apps.ankiweb.net"
    },
    {
      title: "Getting a second explanation when the textbook isn't clicking",
      category: "study",
      tool: "ChatGPT",
      desc: "Prompts that ask for a concept to be re-explained at a different level, with worked examples instead of definitions.",
      link: "https://chat.openai.com"
    },
    {
      title: "Quizzing yourself before an exam without writing questions by hand",
      category: "study",
      tool: "Quizlet AI",
      desc: "Turning a set of notes into a practice quiz automatically, and why timing the quiz matters more than the tool itself.",
      link: "https://quizlet.com"
    },
    {
      title: "Debugging a broken assignment without just copying an answer",
      category: "coding",
      tool: "GitHub Copilot",
      desc: "Using inline suggestions to understand an error message instead of pasting code you can't explain in a viva.",
      link: "https://github.com/features/copilot"
    },
    {
      title: "Explaining unfamiliar code line by line",
      category: "coding",
      tool: "ChatGPT",
      desc: "A short routine for pasting a function and getting a plain-language walkthrough before you modify it.",
      link: "https://chat.openai.com"
    },
    {
      title: "Catching bugs before your professor does",
      category: "coding",
      tool: "Codeium",
      desc: "Free autocomplete and chat for VS Code, and where it tends to help most in coursework-sized projects.",
      link: "https://codeium.com"
    },
    {
      title: "Writing your first README that actually explains the project",
      category: "coding",
      tool: "ChatGPT",
      desc: "A template for turning a rushed group project into documentation a grader can follow in two minutes.",
      link: "https://chat.openai.com"
    },
    {
      title: "Finding real papers instead of guessing at citations",
      category: "research",
      tool: "Consensus",
      desc: "A search engine that answers questions with findings pulled from published papers, with links back to each source.",
      link: "https://consensus.app"
    },
    {
      title: "Summarizing a 40-page paper before deciding if it's worth reading",
      category: "research",
      tool: "Elicit",
      desc: "How to get a structured summary of a paper's method and results without losing the details your citation needs.",
      link: "https://elicit.com"
    },
    {
      title: "Keeping your citations from getting flagged",
      category: "research",
      tool: "Zotero",
      desc: "Free reference management that formats citations correctly and keeps your source list honest as it grows.",
      link: "https://www.zotero.org"
    },
    {
      title: "Asking an AI tool for sources without inventing any",
      category: "research",
      tool: "Perplexity",
      desc: "Why answers with visible citations are safer to build on than answers with none, and how to check them fast.",
      link: "https://www.perplexity.ai"
    },
    {
      title: "Turning an outline into slides you're not embarrassed to present",
      category: "presentations",
      tool: "Gamma",
      desc: "A free tier that builds a slide deck from a text outline, then lets you edit layout without starting from scratch.",
      link: "https://gamma.app"
    },
    {
      title: "Writing speaker notes that sound like you, not a script",
      category: "presentations",
      tool: "ChatGPT",
      desc: "Getting talking points instead of a paragraph to read aloud, so the presentation still feels live.",
      link: "https://chat.openai.com"
    },
    {
      title: "Designing a poster for a research symposium in an afternoon",
      category: "presentations",
      tool: "Canva",
      desc: "Free academic poster templates and the handful of settings worth changing before you print.",
      link: "https://www.canva.com"
    },
    {
      title: "Practicing a presentation before the real audience",
      category: "presentations",
      tool: "Yoodli",
      desc: "A free tool that reviews a recorded practice run for pacing and filler words before your actual presentation.",
      link: "https://yoodli.ai"
    },
    {
      title: "Planning a week that survives three overlapping deadlines",
      category: "productivity",
      tool: "Notion AI",
      desc: "Using a single weekly page to break assignments into tasks the AI can help you re-schedule when plans slip.",
      link: "https://www.notion.so"
    },
    {
      title: "Turning a messy inbox of course emails into an actual to-do list",
      category: "productivity",
      tool: "Todoist",
      desc: "A quick-capture habit for professors' emails so nothing about a deadline gets lost in a crowded inbox.",
      link: "https://todoist.com"
    },
    {
      title: "Getting a clear summary of a long group chat before a meeting",
      category: "productivity",
      tool: "ChatGPT",
      desc: "Pasting a chat thread and getting decisions and open questions back, instead of re-reading fifty messages.",
      link: "https://chat.openai.com"
    },
    {
      title: "Blocking distractions during exam week without deleting every app",
      category: "productivity",
      tool: "Forest",
      desc: "A lightweight focus timer that makes long study blocks easier to start, not just easier to track.",
      link: "https://www.forestapp.cc"
    }
  ];

  var CATEGORY_LABELS = {
    study: "Study",
    coding: "Coding",
    research: "Research",
    presentations: "Presentations",
    productivity: "Productivity"
  };

  var grid = document.getElementById("article-grid");
  if (!grid) return; // Homepage-only script from here on.

  var searchInput = document.getElementById("search-input");
  var searchForm = document.getElementById("search-form");
  var tabButtons = document.querySelectorAll(".tab-btn");
  var resultsCount = document.getElementById("results-count");
  var noResults = document.getElementById("no-results");

  var state = {
    query: "",
    category: "all"
  };

  function cardHTML(article) {
    var label = CATEGORY_LABELS[article.category] || article.category;
    return (
      '<article class="article-card" data-category="' + article.category + '">' +
        '<p class="card-tag">' + label + " \u00b7 " + escapeHTML(article.tool) + "</p>" +
        "<h3>" + escapeHTML(article.title) + "</h3>" +
        "<p>" + escapeHTML(article.desc) + "</p>" +
        '<a class="card-link" href="' + article.link + '" target="_blank" rel="noopener">Visit tool</a>' +
      "</article>"
    );
  }

  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var filtered = ARTICLES.filter(function (a) {
      var matchesCategory = state.category === "all" || a.category === state.category;
      var matchesQuery =
        q === "" ||
        a.title.toLowerCase().indexOf(q) !== -1 ||
        a.tool.toLowerCase().indexOf(q) !== -1 ||
        a.desc.toLowerCase().indexOf(q) !== -1;
      return matchesCategory && matchesQuery;
    });

    grid.innerHTML = filtered.map(cardHTML).join("");

    if (resultsCount) {
      var noun = filtered.length === 1 ? "resource" : "resources";
      resultsCount.textContent = filtered.length + " " + noun + " found";
    }

    if (noResults) {
      noResults.classList.toggle("visible", filtered.length === 0);
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      state.query = e.target.value;
      render();
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabButtons.forEach(function (b) {
        b.setAttribute("aria-selected", "false");
      });
      btn.setAttribute("aria-selected", "true");
      state.category = btn.getAttribute("data-cat");
      render();
    });
  });

  render();
})();
         
