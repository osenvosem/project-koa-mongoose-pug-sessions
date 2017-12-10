// forms validation
const form = document.forms[0];
if (form)
  form.addEventListener(
    "submit",
    e => {
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    },
    false
  );

// alerts
$(".alert").alert();
