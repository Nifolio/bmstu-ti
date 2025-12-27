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
  data: [],
  sortMode: null,
  listElement: null,
  controlsElement: null,
  messageElement: null,

  generateList(parentElement) {
    if (!parentElement) {
      return;
    }

    if (!this.data.length) {
      return;
    }

    this.hideMessage();
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
  },

  toggleControls(isDisabled) {
    if (!this.controlsElement) {
      return;
    }

    this.controlsElement
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = isDisabled;
      });
  },

  clearList() {
    if (this.listElement) {
      this.listElement.innerHTML = "";
    }
  },

  showMessage(text) {
    if (!this.messageElement) {
      return;
    }

    this.messageElement.textContent = text;
    this.messageElement.classList.remove("skills-message_hidden");
  },

  hideMessage() {
    if (!this.messageElement) {
      return;
    }

    this.messageElement.textContent = "";
    this.messageElement.classList.add("skills-message_hidden");
  },

  async getData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data format");
      }

      this.data = data;

      if (!this.data.length) {
        this.clearList();
        this.showMessage("Навыков пока нет.");
        this.toggleControls(true);
        return;
      }

      this.toggleControls(false);
      this.generateList(this.listElement);
    } catch (error) {
      console.error("Не удалось загрузить навыки:", error);
      this.data = [];
      this.clearList();
      this.showMessage("Не удалось загрузить навыки. Попробуйте обновить страницу.");
      this.toggleControls(true);
    }
  },

  init({ listElement, controlsElement, messageElement, dataUrl }) {
    this.listElement = listElement;
    this.controlsElement = controlsElement;
    this.messageElement = messageElement;

    this.toggleControls(true);
    this.hideMessage();
    this.clearList();

    if (dataUrl) {
      this.getData(dataUrl);
    }
  }  
};

const skillList = document.querySelector(".skill-list");
const skillsSortControls = document.querySelector(".skills-sort");
const skillsMessage = document.querySelector(".skills-message");

skills.init({
  listElement: skillList,
  controlsElement: skillsSortControls,
  messageElement: skillsMessage,
  dataUrl: "db/skills.json"
});

if (skillsSortControls) {
  skillsSortControls.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || target.nodeName !== "BUTTON") {
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

  setTheme(themeName, options = {}) {
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

    this.setTheme(initialTheme || "dark", { skipSave: !isStoredThemeValid });

    if (this.checkbox) {
      this.checkbox.addEventListener("change", () => {
        const nextTheme = this.checkbox.checked ? "light" : "dark";
        this.setTheme(nextTheme);
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

  setButtonText(text) {
  const span = this.buttonElement.querySelector(".visually-hidden");
  if (span) {
    span.textContent = text;
  }
  },

  open() {
    this.navElement.classList.remove("main-nav_closed");
    this.buttonElement.classList.remove("nav-btn_open");
    this.buttonElement.classList.add("nav-btn_close");
    this.setButtonText("Закрыть меню");
  },

  close() {
    this.navElement.classList.add("main-nav_closed");
    this.buttonElement.classList.remove("nav-btn_close");
    this.buttonElement.classList.add("nav-btn_open");
    this.setButtonText("Открыть меню");
  },
};

menu.init({
  navElement: document.querySelector(".main-nav"),
  buttonElement: document.querySelector(".nav-btn"),
});