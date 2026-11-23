document.addEventListener('DOMContentLoaded', function () {
  var printBtn = document.getElementById('print-portfolio-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }
});
