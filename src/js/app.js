// swiper
import Swiper from 'swiper/bundle';

// init Swiper:
const swiper = new Swiper('.slider', {
  autoplay: {
    delay: 3000,
  },

  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

  pagination: {
    el: ".swiper-pagination",
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  loop: true,
});