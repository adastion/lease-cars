// swiper
import Swiper from "swiper/bundle";

// init Swiper:
const swiper = new Swiper(".slider", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  effect: "fade",
  fadeEffect: {
    crossFade: false,
  },
});
