async function checkId(element, avail) {
  console.log(element);
  await confirm(element, avail);
}
async function getId(element) {
  console.log(element);
  await checkconfirm(element);
}

function postbutton(element, avail) {
  if (avail) {
    avail = 0;
  } else {
    avail = 1;
  }
  axios
    .post("/book/admin/update", {
      id: element,
      avail: avail,
    })
    .then((res) => {
      console.log(res);
      window.location.href = "http://localhost:5000/book";
    });
}

async function confirm(element, avail) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You are changing state of this book",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, go ahead!",
  });
  if (result.isConfirmed) {
    console.log("permission granted");

    Swal.fire("Done!", "State is now changed.", "success");
    postbutton(element, avail);
  }
}

async function checkconfirm(element) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You are going to checkout this book",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, go ahead!",
  });
  if (result.isConfirmed) {
    console.log("permission granted");

    Swal.fire("Done!", "Successful checkout.", "success");
    console.log("postcheck called")
    postcheck(element);
  }
}

function postcheck(element) {
  console.log("request")
  axios
    .post("/book", {
      bookid: element,
    })
    .then((res) => {
      console.log(res);
      window.location.href = "http://localhost:5000/book";
    });
}
