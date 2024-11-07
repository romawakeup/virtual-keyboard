class Key { //* КЛАВИША НА КЛАВИАТУРЕ
  constructor(keyValue, keyDisplay) {
    this.keyValue = keyValue; //* ЗНАЧЕНИЕ КЛАВИШИ, КОТОРОЕ БУДЕТ ОТОБРАЖАТЬСЯ В ПОЛЕ ВВОДА
    this.keyDisplay = keyDisplay; //* ТО ЧТО ОТОБРАЗИТСЯ НА САМОЙ КЛАВИШЕ
    this.langsMenuOpen = false;
  }

  createElement() { //* СОЗДАНИЕ КЛАВИШИ НА КЛАВЕ
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");

    const specialKeys = { //* ОБЪЕКТ ДЛЯ СПЕЦ КЛАВИШЕЙ И ИХ СТИЛЕЙ
      BackSpace: "key-wide",
      CapsLock: "key-wide",
      Space: "key-space",
      Langs: "key-wide",
    };

    if (specialKeys[this.keyValue]) { //* ДОБАВЛЯЕМ НУЖНЫЙ КЛАСС СПЕЦ КЛАВИШЕ
      keyElement.classList.add(specialKeys[this.keyValue]);
    }

    keyElement.textContent = this.keyDisplay; //* ОТРИСОВЫВАЕМ КЛАВИШИ //todo 

    return keyElement;
  }

  handleKeyClick(inputField, capsLockEnabled) { //* ОБРАБОТКА КЛИКА ПО КЛАВИШЕ
    if (this.keyValue === "BackSpace") { //* УБИРАЕМ ПОСЛЕДНИЙ СИМВОЛ В ПОЛЕ ВВОДА
      inputField.value = inputField.value.slice(0, -1);
    } else if (this.keyValue === "CapsLock") {
      return !capsLockEnabled; //* ДЛЯ ПЕРЕКЛЮЧЕНИЯ КЕПСЛОКА
    } else if (this.keyValue === "Langs") { //* ДЛЯ ОТКРЫТИЯ ЗАКРЫТИЯ МЕНЮ ЯЗЫКОВ
      if (this.langsMenuOpen) {
        this.closeLangsMenu();
      } else {
        this.openLangsMenu();
      }
      return capsLockEnabled;
    } else {
      let keyToAdd = this.keyValue;
      if (keyToAdd.length === 1) {
        keyToAdd = capsLockEnabled //* ЕСЛИ КАПСЛОК ВКЛЮЧЕН ТО БУКВА БОЛЬШАЯ
          ? keyToAdd.toUpperCase()
          : keyToAdd.toLowerCase();
      } else if (this.keyValue === "Space") {
        keyToAdd = " ";
      }
      inputField.value += keyToAdd;
    }
    return capsLockEnabled;
  }

  openLangsMenu() { //* ДЛЯ ОТКРЫТИЯ МЕНЮ И ВЫБОРА ЯЗЫКОВ
    const menu = document.createElement("div"); //* СОЗДАЕМ ДИВ, ПОТОМ ДОБАВЛЯЕМ НУЖНЫЙ КСС КЛАСС
    menu.classList.add("langs-menu");
    menu.innerHTML = `
      <div class="lang-item">English</div>
      <div class="lang-item">Русский</div>
      <div class="lang-item">Deutsch</div>
    `;

    document.body.appendChild(menu); //* ДОБАВЛЯЕМ МЕНЮ ЯЗЫКОВ НА СТРАНИЦУ

    const keyElements = Array.from(document.querySelectorAll(".key")); //* НАХОДИМ ЛЕНГС НА СТРАНИЦЕ
    const keyElement = keyElements.find(
      (item) => item.textContent.trim() === "Langs"
    );
    const rect = keyElement.getBoundingClientRect(); //* ПОЛУЧАЕМ КООРДИНАТЫ КЛАВИШИ
    menu.style.position = "absolute";
    menu.style.top = `${rect.bottom}px`;
    menu.style.left = `${rect.left}px`;

    document.addEventListener("click", (event) => { //* ЗАКРЫВАЕМ МЕНЮ ПРИ КЛИКЕ НА СВОБОДНООЕ ПРОСТРАНСТВО
      if (!menu.contains(event.target) && !keyElement.contains(event.target)) {
        this.closeLangsMenu(menu);
      }
    });

    this.langsMenuOpen = true;
  }

  closeLangsMenu() { //* ДЛЯ ЗАКРЫТИЯ ЯЗЫКОВОГО МЕНЮ
    const menu = document.querySelector(".langs-menu");
    if (menu) {
      menu.remove();
    }
    this.langsMenuOpen = false;
  }
}

class Keyboard { //* САМА КЛАВИАТУРА
  constructor() {
    this.capsLockEnabled = false; //* КАПС ВЫКЛЮЧЕН
    this.keyboardKeys = this.createKeys(); //* СОЗДАНИЕ КЛАВИШ КЛАВИАТУРЫ
    this.createKeyboard();

    this.showKeyboard(); //* ДЛЯ ПОЯВЛЕНИЯ КЛАВИАТУРЫ
    this.hideKeyboard(); //* ДЛЯ СКРЫТИЯ КЛАВИАТУРЫ

    document.addEventListener("click", (event) => {
      if (
        !this.keyboard.contains(event.target) &&
        event.target.tagName.toLowerCase() !== "input"
      ) {
        this.keyboard.style.display = "none";
      }
    });
  }

  createKeys() { //* ДЛЯ СОЗДАНИЯ КЛАВИШ КЛАВИАТУРЫ
    return [
      [
        new Key("1", "1"),
        new Key("2", "2"),
        new Key("3", "3"),
        new Key("4", "4"),
        new Key("5", "5"),
        new Key("6", "6"),
        new Key("7", "7"),
        new Key("8", "8"),
        new Key("9", "9"),
        new Key("0", "0"),
        new Key("=", "="),
        new Key("-", "-"),
        new Key("BackSpace", "BackSpace"),
      ],
      [
        new Key("q", "q"),
        new Key("w", "w"),
        new Key("e", "e"),
        new Key("r", "r"),
        new Key("t", "t"),
        new Key("y", "y"),
        new Key("u", "u"),
        new Key("i", "i"),
        new Key("o", "o"),
        new Key("p", "p"),
        new Key("[", "["),
        new Key("]", "]"),
        new Key("\\", "\\"),
      ],
      [
        new Key("CapsLock", "CapsLock"),
        new Key("a", "a"),
        new Key("s", "s"),
        new Key("d", "d"),
        new Key("f", "f"),
        new Key("g", "g"),
        new Key("h", "h"),
        new Key("j", "j"),
        new Key("k", "k"),
        new Key("l", "l"),
        new Key(";", ";"),
        new Key("'", "'"),
      ],
      [
        new Key("z", "z"),
        new Key("x", "x"),
        new Key("c", "c"),
        new Key("v", "v"),
        new Key("b", "b"),
        new Key("Space", ""),
        new Key("n", "n"),
        new Key("m", "m"),
        new Key(",", ","),
        new Key(".", "."),
        new Key("/", "/"),
        new Key("Langs", "Langs"),
      ],
    ];
  }

  createKeyboard() { //* ДЛЯ СОЗДАНИЯ КЛАВИАТУРЫ
    this.keyboard = document.createElement("div");
    this.keyboard.classList.add("keyboard");
    document.body.appendChild(this.keyboard);
    this.keyboard.innerHTML = "";

    this.keyboardKeys.forEach((row) => {
      const keyboardRow = document.createElement("div");
      keyboardRow.classList.add("keyboard-row");

      row.forEach((key) => {
        const keyElement = key.createElement();
        keyboardRow.appendChild(keyElement);
      });

      this.keyboard.appendChild(keyboardRow);
    });
  }

  handleKeyClick(keyDisplay) { //* ОБРАБОТКА СБОЫТИЯ ПО КЛАВИШЕ
    this.capsLockEnabled = this.keyboardKeys
      .flat()
      .find((key) => key.keyDisplay === keyDisplay)
      .handleKeyClick(this.input, this.capsLockEnabled);
  }

  showKeyboard() { //* ДЛЯ ПОЯВЛЕНИЯ КЛАВИАТУРЫ
    document.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "input") {
        this.keyboard.style.display = "block";
        this.input = event.target; 
      }
    });
  }

  hideKeyboard() { //* ДЛЯ СКРЫТИЯ КЛАВИАТУРЫ
    this.keyboard.addEventListener("click", (event) => {
      const keyElement = event.target.closest(".key");
      if (keyElement) {
        const keyValue = keyElement.textContent.trim();
        this.handleKeyClick(keyValue);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !this.keyboard.contains(event.target) &&
        event.target.tagName.toLowerCase() !== "input"
      ) {
        this.keyboard.style.display = "none";
        const keyElements = Array.from(document.querySelectorAll(".key"));
        const langKeyElement = keyElements.find(
          (el) => el.textContent.trim() === "Langs"
        );
        if (langKeyElement && langKeyElement.langsMenuOpen) {
          langKeyElement.closeLangsMenu();
        }
      }
    });
  }
}

const keyboard = new Keyboard();


// en: [
  //         [
  //           new Key("1", "1"),
  //           new Key("2", "2"),
  //           new Key("3", "3"),
  //           new Key("4", "4"),
  //           new Key("5", "5"),
  //           new Key("6", "6"),
  //           new Key("7", "7"),
  //           new Key("8", "8"),
  //           new Key("9", "9"),
  //           new Key("0", "0"),
  //           new Key("=", "="),
  //           new Key("-", "-"),
  //           new Key("BackSpace", "BackSpace"),
  //         ],
  //         [
  //           new Key("q", "q"),
  //           new Key("w", "w"),
  //           new Key("e", "e"),
  //           new Key("r", "r"),
  //           new Key("t", "t"),
  //           new Key("y", "y"),
  //           new Key("u", "u"),
  //           new Key("i", "i"),
  //           new Key("o", "o"),
  //           new Key("p", "p"),
  //           new Key("[", "["),
  //           new Key("]", "]"),
  //           new Key("\\", "\\"),
  //         ],
  //         [
  //           new Key("CapsLock", "CapsLock"),
  //           new Key("a", "a"),
  //           new Key("s", "s"),
  //           new Key("d", "d"),
  //           new Key("f", "f"),
  //           new Key("g", "g"),
  //           new Key("h", "h"),
  //           new Key("j", "j"),
  //           new Key("k", "k"),
  //           new Key("l", "l"),
  //           new Key(";", ";"),
  //           new Key("'", "'"),
  //         ],
  //         [
  //           new Key("z", "z"),
  //           new Key("x", "x"),
  //           new Key("c", "c"),
  //           new Key("v", "v"),
  //           new Key("b", "b"),
  //           new Key("Space", "Space"),
  //           new Key("n", "n"),
  //           new Key("m", "m"),
  //           new Key(",", ","),
  //           new Key(".", "."),
  //           new Key("/", "/"),
  //           new Key("Langs", "Langs"),
  //         ],
  //       ],
  //       ru: [
  //         [
  //           new Key("1", "1"),
  //           new Key("2", "2"),
  //           new Key("3", "3"),
  //           new Key("4", "4"),
  //           new Key("5", "5"),
  //           new Key("6", "6"),
  //           new Key("7", "7"),
  //           new Key("8", "8"),
  //           new Key("9", "9"),
  //           new Key("0", "0"),
  //           new Key("=", "="),
  //           new Key("-", "-"),
  //           new Key("BackSpace", "BackSpace"),
  //         ],
  //         [
  //           new Key("й", "й"),
  //           new Key("ц", "ц"),
  //           new Key("у", "у"),
  //           new Key("к", "к"),
  //           new Key("е", "е"),
  //           new Key("н", "н"),
  //           new Key("г", "г"),
  //           new Key("ш", "ш"),
  //           new Key("щ", "щ"),
  //           new Key("p", "p"),
  //           new Key("х", "х"),
  //           new Key("[", "["),
  //           new Key("]", "]"),
  //           new Key("\\", "\\"),
  //         ],
  //         [
  //           new Key("CapsLock", "CapsLock"),
  //           new Key("ф", "ф"),
  //           new Key("ы", "ы"),
  //           new Key("в", "в"),
  //           new Key("а", "а"),
  //           new Key("п", "п"),
  //           new Key("р", "р"),
  //           new Key("о", "о"),
  //           new Key("л", "л"),
  //           new Key("д", "д"),
  //           new Key("ж", "э"),
  //           new Key(";", ";"),
  //           new Key("'", "'"),
  //         ],
  //         [
  //           new Key("я", "я"),
  //           new Key("ч", "ч"),
  //           new Key("с", "с"),
  //           new Key("м", "м"),
  //           new Key("и", "и"),
  //           new Key("Space", "Space"),
  //           new Key("т", "т"),
  //           new Key("ь", "ь"),
  //           new Key("б", "б"),
  //           new Key("ю", "ю"),
  //           new Key(",", ","),
  //           new Key(".", "."),
  //           new Key("/", "/"),
  //           new Key("Langs", "Langs"),
  //         ],
  //       ],
  //       de: [
  //         [
  //           new Key("1", "1"),
  //           new Key("2", "2"),
  //           new Key("3", "3"),
  //           new Key("4", "4"),
  //           new Key("5", "5"),
  //           new Key("6", "6"),
  //           new Key("7", "7"),
  //           new Key("8", "8"),
  //           new Key("9", "9"),
  //           new Key("0", "0"),
  //           new Key("=", "="),
  //           new Key("-", "-"),
  //           new Key("BackSpace", "BackSpace"),
  //         ],
  //         [
  //           new Key("н", "н"),
  //           new Key("w", "w"),
  //           new Key("e", "e"),
  //           new Key("r", "r"),
  //           new Key("t", "t"),
  //           new Key("y", "y"),
  //           new Key("u", "u"),
  //           new Key("i", "i"),
  //           new Key("o", "o"),
  //           new Key("p", "p"),
  //           new Key("[", "["),
  //           new Key("]", "]"),
  //           new Key("\\", "\\"),
  //         ],
  //         [
  //           new Key("CapsLock", "CapsLock"),
  //           new Key("a", "a"),
  //           new Key("s", "s"),
  //           new Key("d", "d"),
  //           new Key("f", "f"),
  //           new Key("g", "g"),
  //           new Key("h", "h"),
  //           new Key("j", "j"),
  //           new Key("k", "k"),
  //           new Key("l", "l"),
  //           new Key(";", ";"),
  //           new Key("'", "'"),
  //         ],
  //         [
  //           new Key("z", "z"),
  //           new Key("x", "x"),
  //           new Key("c", "c"),
  //           new Key("v", "v"),
  //           new Key("b", "b"),
  //           new Key("Space", "Space"),
  //           new Key("n", "n"),
  //           new Key("m", "m"),
  //           new Key(",", ","),
  //           new Key(".", "."),
  //           new Key("/", "/"),
  //           new Key("Langs", "Langs"),
  //         ],
  //       ],
  //     };
