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
        margin: 15,
      },
    },
  });
  // NAVBAR
  // GO TO SECTION WITH SCROLL
  const btnToggle = $("#toggle-sidebar");
  $(".link").on("click", function () {
    //
    const goToSection = $(`#${$(this).attr("data-target")}`).offset().top - 30;
    $("html, body").animate(
      {
        scrollTop: goToSection,
      },
      500
    );
    //
    if ($(".navbar__items").hasClass("navbar__items--active")) {
      $(".navbar__items").removeClass("navbar__items--active");
      $("html, body").css("overflow-y", "visible");
      $(".backdrop").css("display", "none");
    }
  });

  btnToggle.on("click", function () {
    if ($(".navbar__items").hasClass("navbar__items--active")) {
      $(".navbar__items").removeClass("navbar__items--active");
      $(".backdrop").css("display", "none");
      $("html, body").css("overflow-y", "visible");
      return;
    }

    $(".navbar__items").addClass("navbar__items--active");
    $("html, body").css("overflow-y", "hidden");
    $(".backdrop").css("display", "block");
  });

  // CLOSE SIDEBAR NAVBAR IF CLICKED ON BACKDROP
  $(".backdrop").on("click", function () {
    btnToggle.trigger("click");
  });

  // SCROLL ANIMATION
  AOS.init({
    duration: 1000,
    once: true,
  });
});
