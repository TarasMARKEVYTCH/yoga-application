const main = document.querySelector("main");

const arrayBase = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];

let exerciceArray = [];

(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = arrayBase;
  }
})();

class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.secondes = 0;
  }

  updateCoundown() {
    this.secondes = this.secondes < 10 ? "0" + this.secondes : this.secondes;
    setTimeout(() => {
      if (this.minutes == 0 && this.secondes === "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.secondes = 0;
          this.updateCoundown();
        } else {
          return page.finishPage();
        }
      } else if (this.secondes === "00") {
        this.minutes--;
        this.secondes = 59;
        this.updateCoundown();
      } else {
        this.secondes--;
        this.updateCoundown();
      }
    }, 1000);

    return (main.innerHTML = `
    <div class="exercice-container">
      <p>${this.minutes}:${this.secondes}</p>
      <img src="img/${exerciceArray[this.index].pic}.png">
      <div>${this.index}/${exerciceArray.length}</div>
    </div>
    `);
  }
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            console.log(e.target);
            this.store();
          }
        });
      });
    });
  },
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            page.homePage();
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },
  deleteCard: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArr = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArr.push(exo);
          }
        });
        exerciceArray = newArr;
        page.homePage();
        this.store();
      });
    });
  },
  reboot: function () {
    exerciceArray = arrayBase;
    page.homePage();
    this.store();
  },

  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
  
};
//------------------------------

const page = {
  homePage: function () {
    let mapArray = exerciceArray
      .map((exo) => {
        return `
        <li class = "item" draggable="false">
          <div class="card-header" draggable="false">
            <input type="number" draggable="false" id=${exo.pic} min="1" max="10" value=${exo.min}>
            <span draggable="false">min</span>
          </div>
          <img src="img/${exo.pic}.png" draggable="false">
          <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic} draggable="false"></i>
          <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic} draggable="false"></i>
        </li>
        `;
      })
      .join("");
    utils.pageContent(
      "Paramétrer ma séance <i id='reboot' class='fas fa-undo'></i> ",
      "<ul class='list'>" + mapArray + "</ul>",
      // "<div id='time'></div>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteCard();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => this.exercicePage());
  },

  exercicePage: function () {
    const exercice = new Exercice();

    utils.pageContent("Entrainement", exercice.updateCoundown(), null);
  },

  finishPage: function () {
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Reinitialiser<i class='fas fa-times-circle'></i></button>"
    );
    start.addEventListener("click", () => this.exercicePage());
    reboot.addEventListener("click", () => page.homePage());
  },
};

page.homePage();

// document.addEventListener("dragstart", (e) => {
//   console.log(e.target, "dragstart");
//   itemDrop = e.target;
// });

// document.addEventListener("dragover", (e) => {
//   e.preventDefault();
// });

// document.addEventListener("drop", (e) => {
//   if (e.target.calssName !== "placeholder") {
//     e.preventDefault(e);
//     e.target.append(itemDrop);
//     console.log(e.target);
//   }
//   // console.log("ok");
// });
