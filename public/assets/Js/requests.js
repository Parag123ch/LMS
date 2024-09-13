async function checkingId(element, bid) {
  console.log(element);
  await confirm(element, bid);
}
async function gettingId(element, bid) {
  console.log(element);
  await checkconfirm(element, bid);
}

function postbutton(element, bid) {
  axios
    .post("/book/admin", {
      id: element,
      status: 0,
      bookid: bid,
    })
    .then((res) => {
      console.log(res);
      window.location.href = "http://localhost:5000/book/admin";
    });
}

async function confirm(element, bid) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You are declining this request",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, go ahead!",
  });
  if (result.isConfirmed) {
    console.log("permission granted");

    Swal.fire("Done!", "Request declined", "success");
    postbutton(element, bid);
  }
}

async function checkconfirm(element, bid) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You are accepting this request",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, go ahead!",
  });
  if (result.isConfirmed) {
    console.log("permission granted");

    Swal.fire("Done!", "Successful granted.", "success");
    postcheck(element, bid);
  }
}

function postcheck(element, bid) {
  console.log("request");
  axios
    .post("/book/admin", {
      id: element,
      status: 1,
      bookid: bid,
    })
    .then((res) => {
      console.log(res);
      window.location.href = "http://localhost:5000/book/admin";
    });
}
document.getElementById("filter").addEventListener("click", searchto);
function searchto() {
  (async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Book",
      inputPlaceholder: "Type name of User",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    if (text) {
      window.location.href =
        "http://localhost:5000/book/admin/history?username=" + text;
    }
  })();
}

async function returned(element, bookin) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You are returning this book!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, go ahead!",
  });
  if (result.isConfirmed) {
    console.log("permission granted");

    Swal.fire("Done!", "Successful granted.", "success");
    returnpost(element,bookin);
  }
}

function returnpost(element, bookin) {
  axios
    .post("/book/admin/return", {
      id: element,
      bookid: bookin,
    })
    .then((res) => {
      window.location.href = "http://localhost:5000/book/admin";
    });
}
