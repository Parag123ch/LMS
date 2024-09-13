function add() {
  (async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Book",
      inputPlaceholder: "Type name of Book",
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
      filter(text);
    }
  })();
}
function searchto() {
  (async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Book",
      inputPlaceholder: "Type name of Book",
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
      window.location.href = "http://localhost:5000/book?search=" + text;
    }
  })();
}

function filter(message) {
  (async () => {
    const { value: number } = await Swal.fire({
      title: "Number of Books?",
      icon: "question",
      input: "range",
      inputLabel: "Number",
      inputAttributes: {
        min: 1,
        max: 200,
        step: 1,
      },
      inputValue: 25,
    });
    if (number) {
      await swal.fire(`${number} books of ${message} were added!!`);
      postmessage(message, number);
    }
  })();
}

function postmessage(book, number) {
  axios
    .post("/book/admin/add", {
      bookname: `${book}`,
      number: `${number}`,
    })
    .then((res) => {
      window.location.href = "http://localhost:5000/book";
      console.log(res);
    });
}

function posthistory() {
  window.location.href="http://localhost:5000/book/history"
}

// function postfilter(tag) {
//   axios
//     .post("/acad/filteracad", {
//       tag: `${tag}`,
//     })
//     .then((res) => {
//       console.log(res);
//       window.location.href = "http://localhost:5000/acad/filterviewacad";
//     });
// }
