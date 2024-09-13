
$(document).ready(function () {
  //DropDown input - select
  $(".t-dropdown-input").on("click", function () {
    $(this).parent().next().slideDown("fast");
  });

  $(".t-select-btn").on("click", function () {
    $(".t-dropdown-list").slideUp("fast");

    if (!$(this).prev().attr("disabled")) {
      $(this).prev().trigger("click");
    }
  });

  $(".t-dropdown-input").width(
    $(".t-dropdown-select").width() - $(".t-select-btn").width() - 13
  );

  $(".t-dropdown-list").width($(".t-dropdown-select").width());

  $(".t-dropdown-input").val("");

  $("li.t-dropdown-item").on("click", function () {
    var text = $(this).html();
    $(this).parent().prev().find(".t-dropdown-input").val(text);
    $(".t-dropdown-list").slideUp("fast");
  });

  $(document).on("click", function (event) {
    if ($(event.target).closest(".t-dropdown-input, .t-select-btn").length)
      return;
    $(".t-dropdown-list").slideUp("fast");
    event.stopPropagation();
  });
  // END //
});
