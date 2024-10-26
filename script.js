const header = document.getElementById('header');
const briefSection = document.getElementById('brief_section');
const meSection = document.getElementById('me_section');
const musicSection = document.getElementById('music_section');
const freeTimeSection = document.getElementById('free_time_section');

const firstTabPixelNumber = (briefSection.clientHeight) * 0.7;
const secondTabPixelNumber = (briefSection.clientHeight + meSection.clientHeight - header.clientHeight);
const thirdTabPixelNumber = (briefSection.clientHeight + meSection.clientHeight + musicSection.clientHeight - header.clientHeight);

const aboutMeDiv = document.getElementById('me_tab');
const musicDiv = document.getElementById('music_tab');
const freeTimeDiv = document.getElementById('free_time_tab');
const briefDiv = document.getElementById('brief_section')

let tabs = new Set();

window.onscroll = function() {
  activeTabsSwitcher();
};

function activeTabsSwitcher() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  console.log("size of set: " + tabs.size)

  if (aboutMeDiv && musicDiv && freeTimeDiv) {
    if (scrollTop < firstTabPixelNumber) { // brief
      currentTab = briefDiv;
      updateDivClasses(currentTab);
    } else if (scrollTop >= firstTabPixelNumber && scrollTop < secondTabPixelNumber) { // about me
      currentTab = aboutMeDiv;
      updateDivClasses(currentTab);
    } else if (scrollTop >= secondTabPixelNumber && scrollTop < thirdTabPixelNumber) { // music
      currentTab = musicDiv;
      updateDivClasses(currentTab);
    } else if (scrollTop >= thirdTabPixelNumber) { // free time
      currentTab = freeTimeDiv;
      updateDivClasses(currentTab);
    }
  }
}

function switchTabs(fromTab, toTab) {
  console.log('toTab is: ' + toTab);
  console.log('fromTab is: ' + fromTab);

  if (toTab != briefDiv) {
    toTab.classList.add('content__rectangle--active');
    toTab.classList.remove('content__rectangle--inactive');
  }

  if (fromTab != briefDiv) {
    fromTab.classList.remove('content__rectangle--active')
    fromTab.classList.add('content__rectangle--inactive')
  }   
}

function updateDivClasses(currentTab) {
  console.log('i am on updateDivClasses function!');
  if (tabs.size < 2) {
    tabs.add(currentTab);
  }

  if (tabs.size === 2) {
    console.log(tabs);
    
    let [fromTab, toTab] = tabs;
    tabs.delete(fromTab);
    tabs.delete(toTab);
    switchTabs(fromTab, toTab);
  }
}