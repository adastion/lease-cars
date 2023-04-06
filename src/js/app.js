// swiper
import Swiper from "swiper/bundle";

// init Swiper:
const swiper = new Swiper(".swiper", {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },


  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
});
