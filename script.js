window.onscroll = function() {
  activeTabsSwitcher();
};

function activeTabsSwitcher() {
  const aboutMeDiv = document.getElementById('me_section');
  const musicDiv = document.getElementById('music_section');
  const freeTimeDiv = document.getElementById('free_time_section');

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  if (aboutMeDiv && musicDiv && freeTimeDiv) {
    if (scrollTop < 100) { // brief
      updateDivClasses(aboutMeDiv, musicDiv, freeTimeDiv, "brief");
    } else if (scrollTop >= 100 && scrollTop < 200) { // about me
      updateDivClasses(aboutMeDiv, musicDiv, freeTimeDiv, "aboutMe");
    } else if (scrollTop >= 200 && scrollTop < 300) { // music
      updateDivClasses(aboutMeDiv, musicDiv, freeTimeDiv, "music");
    } else if (scrollTop >= 300) { // free time
      updateDivClasses(aboutMeDiv, musicDiv, freeTimeDiv, "freeTime");
    }
  }
}

function updateDivClasses(aboutMeDiv, musicDiv, freeTimeDiv, section) {
  if (section === "brief") {
    // Reset all sections to inactive
    aboutMeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-lavender');
    aboutMeDiv.classList.add('content__rectangle--inactive');

    musicDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-yellow');
    musicDiv.classList.add('content__rectangle--inactive');

    freeTimeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-cyan');
    freeTimeDiv.classList.add('content__rectangle--inactive');
  }

  if (section === "aboutMe") {
    // Activate aboutMe section
    aboutMeDiv.classList.add('content__rectangle--active', 'content__rectangle--border-lavender');
    aboutMeDiv.classList.remove('content__rectangle--inactive');

    musicDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-yellow');
    musicDiv.classList.add('content__rectangle--inactive');

    freeTimeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-cyan');
    freeTimeDiv.classList.add('content__rectangle--inactive');
  }

  if (section === "music") {
    // Activate music section
    musicDiv.classList.add('content__rectangle--active', 'content__rectangle--border-yellow');
    musicDiv.classList.remove('content__rectangle--inactive');

    aboutMeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-lavender');
    aboutMeDiv.classList.add('content__rectangle--inactive');

    freeTimeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-cyan');
    freeTimeDiv.classList.add('content__rectangle--inactive');
  }

  if (section === "freeTime") {
    // Activate freeTime section
    freeTimeDiv.classList.add('content__rectangle--active', 'content__rectangle--border-cyan');
    freeTimeDiv.classList.remove('content__rectangle--inactive');

    aboutMeDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-lavender');
    aboutMeDiv.classList.add('content__rectangle--inactive');

    musicDiv.classList.remove('content__rectangle--active', 'content__rectangle--border-yellow');
    musicDiv.classList.add('content__rectangle--inactive');
  }
}