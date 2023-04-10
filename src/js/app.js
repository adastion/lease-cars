//tabs
const tabBtn = document.querySelectorAll(".cotalog__btn-tab");
const tabContent = document.querySelectorAll(".cotalog__content-list");

tabBtn.forEach((event) => {
  event.preventDefault();
  event.addEventListener('click', show);
});

function show(event) {
  const tabTarget = event.currentTarget;

  tabBtn.forEach((item) => {
    item.classList.remove("active");
  });

  tabTarget.classList.add("active");
}

// swiper
import Swiper from "swiper/bundle";

// init Swiper:
const swiper = new Swiper(".swiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },

  autoplay: {
    delay: 3000,
  },
});
