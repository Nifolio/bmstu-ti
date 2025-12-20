function getComparer(key) {
  return (firstSkill, secondSkill) => {
    const firstValue = firstSkill[key];
    const secondValue = secondSkill[key];

    if (typeof firstValue === "string" && typeof secondValue === "string") {
      return firstValue.localeCompare(secondValue);
    }

    if (firstValue > secondValue) {
      return 1;
    }

    if (firstValue < secondValue) {
      return -1;
    }

    return 0;
  };
}

const skills = {
  data: [
    { name: "html", level: 90, icon: "skills/html.svg" },
    { name: "css", level: 85, icon: "skills/css.svg" },
    { name: "python", level: 75, icon: "skills/python.svg" },
    { name: "javascript", level: 80, icon: "skills/javascript.svg" },
    { name: "java", level: 70, icon: "skills/java.svg" },
    
  ],
  sortMode: null,
  listElement: null,

  generateList(parentElement) {
    if (!parentElement) {
      return;
    }

    this.listElement = parentElement;
    parentElement.innerHTML = "";

    this.data.forEach((skill) => {
      const term = document.createElement("dt");
      term.classList.add("skill-item");
      term.textContent = skill.name;
      term.style.backgroundImage = `url("img/${skill.icon}")`;

      const definition = document.createElement("dd");
      definition.classList.add("skill-level");

      const progress = document.createElement("div");
      progress.style.width = `${skill.level}%`;

      definition.append(progress);
      parentElement.append(term, definition);
    });
  },

  sortList(type) {
    if (!this.listElement) {
      return;
    }

    if (this.sortMode !== type) {
      this.data.sort(getComparer(type));
      this.sortMode = type;

    } else {
      this.data.reverse();
    }

    this.generateList(this.listElement);
    }
};

const skillList = document.querySelector(".skill-list");
skills.generateList(skillList);

const skillsSortControls = document.querySelector(".skills-sort");

if (skillsSortControls) {
  skillsSortControls.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.nodeName !== "BUTTON") {
      return;
    }

    const sortType = target.dataset.sortType;

    switch (sortType) {
      case "name":
        skills.sortList("name");
        break;
      case "level":
        skills.sortList("level");
        break;
      default:
        break;
    }
  });
}

const theme = {
  className: "dark-theme",
  storageKey: "portfolio-theme",
  checkbox: document.querySelector(".switch-checkbox"),
  current: "dark",

  setStoredTheme(themeName) {
    try {
      localStorage.setItem(this.storageKey, themeName);
    } catch (error) {
      console.warn("Theme preference is not saved:", error);
    }
  },

  getStoredTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (error) {
      console.warn("Theme preference is not available:", error);
      return null;
    }
  },

  apply(themeName, options = {}) {
    const isDark = themeName === "dark";

    document.body.classList.toggle(this.className, isDark);
    this.current = isDark ? "dark" : "light";

    if (this.checkbox) {
      this.checkbox.checked = !isDark;
    }

    if (!options.skipSave) {
      this.setStoredTheme(this.current);
    }
  },

  init() {
    const storedTheme = this.getStoredTheme();
    const isStoredThemeValid = storedTheme === "dark" || storedTheme === "light";
    const bodyHasDarkClass = document.body.classList.contains(this.className);

    const initialTheme =
      (isStoredThemeValid && storedTheme) ||
      (bodyHasDarkClass ? "dark" : null) ||
      "dark";

    this.apply(initialTheme || "dark", { skipSave: !isStoredThemeValid });

    if (this.checkbox) {
      this.checkbox.addEventListener("change", () => {
        const nextTheme = this.checkbox.checked ? "light" : "dark";
        this.apply(nextTheme);
      });
    }
  }
};

theme.init();

const menu = {
  navElement: null,
  buttonElement: null,

  init({ navElement, buttonElement }) {
    this.navElement = navElement;
    this.buttonElement = buttonElement;

    this.close();

    this.buttonElement.addEventListener("click", () => {
      this.isOpen() ? this.close() : this.open();
    });
  },

  isOpen() {
    return !this.navElement.classList.contains("main-nav_closed");
  },

  open() {
    this.navElement.classList.remove("main-nav_closed");
    this.buttonElement.classList.remove("nav-btn_open");
    this.buttonElement.classList.add("nav-btn_close");
  },

  close() {
    this.navElement.classList.add("main-nav_closed");
    this.buttonElement.classList.remove("nav-btn_close");
    this.buttonElement.classList.add("nav-btn_open");
  },
};

menu.init({
  navElement: document.querySelector(".main-nav"),
  buttonElement: document.querySelector(".nav-btn"),
});