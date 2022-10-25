//요구사항 정리

//1번째

//Todo 메뉴추가
// - [x] 메뉴에 새로운 메뉴를 확인버튼을 누르면 추가된다
// - [x] 메뉴에 새로운 메뉴를 엔터키 입력을 누르면 추가된다
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화된다.
// - [x] 메뉴가 추가되면 count하여 상단에 보여준다.
// - [x]  추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.

//Todo 메뉴수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받고, 모달창을 띄워준다.
// - [x] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

//Todo 메뉴삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 모달창을 띄워준다.
// - [x] 모달창에서 확인 버튼을 누르면 메뉴가 삭제된다.
// - [x] 메뉴를 삭제하면 count하여 상단에 보여준다.

//2번째

//localStroage Read & Write
// - [x] localStorage에 데이터를 저장할 수 있다.
//  - [x] 메뉴를 추가할 때 저장
//  - [x] 메뉴를 수정할 때 저장
//  - [x] 메뉴를 삭제할 때 저장
// - [x] localStorage에 새로고침을해도 데이터가 남아있을 수 있게 한다.

//카테고리별 메뉴관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

//TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 로딩될 때 localStroage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

//품절
// - [] 품절 버튼을 추가한다.
// - [] 품절 버튼을 클릭하면 localStroage에 상태값이 저장된다.
// - [] 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  //상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명

  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStroage()) {
      this.menu[this.currentCategory] = store.getLocalStroage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            menuItem.soldOut ? "sold-out" : ""
          }">${menuItem.name}</span>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
          품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join("");

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menucount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menucount}개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해 주세요.");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    this.menu[this.currentCategory].push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);

      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#espresso-menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

    $("#espresso-menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("#espresso-menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;

        render();
      }
    });
  };
}

const app = new App();

app.init();
