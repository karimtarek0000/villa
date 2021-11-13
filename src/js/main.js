$(function () {
  const year = $("#year");

  // SET YEAR
  year.text(new Date().getFullYear());

  // GET DIRECTION HTML
  const getDir = $("html").attr("dir") === "rtl" ? true : false;

  $(".owl-carousel").owlCarousel({
    items: 1,
    autoplayHoverPause: true,
    loop: true,
    dots: false,
    nav: true,
    rtl: getDir,
    margin: 15,
    navText: [
      "<div class='prev-slide'></div>",
      "<div class='next-slide'></div>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });
});
