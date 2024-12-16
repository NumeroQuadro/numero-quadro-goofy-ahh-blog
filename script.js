document.revealDescription = function (descriptionId) {
  console.log('revealing', descriptionId);
  let description = document.getElementById(descriptionId);
  description.classList.add("visible");
};

document.hideDescription = function (descriptionId) {
  console.log('hiding', descriptionId);
  let description = document.getElementById(descriptionId);
  description.classList.remove("visible");
};

document.revealAuthor = function (quoteId) {
  console.log('revealing quote author');
  let quote = document.getElementById(quoteId);
  quote.classList.add("visible");
};

document.hideAuthor = function (quoteId) {
  console.log('hiding quote author');
  let quote = document.getElementById(quoteId);
  quote.classList.remove("visible");
};

function copyTextToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
  }
  catch {
    console.error('Could not copy text: ', err);
  }
}

document.getElementById('copyButtonTelegram').onclick = function () {
  const contentToCopy = "https://t.me/numero_quadro";
  const notificationMessage = "Telegram link copied to clipboard!";
  sendNotification(notificationMessage, 3000);
  copyTextToClipboard(contentToCopy);
};
document.getElementById('copyButtonVk').onclick = function () {
  const contentToCopy = "https://vk.com/numero_quadro";
  const notificationMessage = "Vkontakte link copied to clipboard!";
  sendNotification(notificationMessage, 3000);
  copyTextToClipboard(contentToCopy);
};
document.getElementById('copyButtonGithub').onclick = function () {
  const contentToCopy = "https://github.com/NumeroQuadro";
  const notificationMessage = "Github link copied to clipboard!";
  sendNotification(notificationMessage, 3000);
  copyTextToClipboard(contentToCopy);
};
document.getElementById('copyButtonGmail').onclick = function () {
  const contentToCopy = "dimabelunin7@gmail.com";
  const notificationMessage = "Gmail copied to clipboard!";
  sendNotification(notificationMessage, 3000);
  copyTextToClipboard(contentToCopy);
};

function sendNotification(text, duration_ms) {
  Toastify({
    text: text,
    duration: duration_ms,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#01823E",
    },
    onClick: function () { } // Callback after click
  }).showToast();
}

function currentDocumentPathTracker() {
  const currentPage = window.location.pathname.split('/').pop();

  const navItems = document.querySelectorAll('.header__navigation_item');

  navItems.forEach(navItem => {
    const href = navItem.getAttribute('href');
    if (href && href === currentPage) {
      navItem.classList.add('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", currentDocumentPathTracker());

(function () {
  window.addEventListener('load', function () {
    const loadTime = (performance.now() / 1000).toFixed(3);

    const loadTimeText = document.getElementById('load-time-text');
    if (loadTimeText) {
      loadTimeText.textContent = `Page load time is ${loadTime} Seconds`;
    }
  });
})();