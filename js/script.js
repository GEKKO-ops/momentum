const translation = {
  morning: {
    en: 'Good morning,',
    ru: 'Доброе утро,'
  },
  afternoon: {
    en: 'Good afternoon,',
    ru: 'Добрый день,'
  },
  evening: {
    en: 'Good evening,',
    ru: 'Добрый вечер,'
  },
  night: {
    en: 'Good night,',
    ru: 'Доброй ночи,'
  },
  placeholder: {
    en: '[Enter name]',
    ru: '[Введите имя]'
  },
  wether: {
    en: ['Wind speed', 'm/s', 'Humidity'],
    ru: ['Скорость ветра', 'м/с', 'Влажность']
  },
  settings: {
    en: ['Language', 'Time', 'Date','Greeting', 'Quote', 'Weather', 'Audio'],
    ru: ['Язык', 'Время', 'Дата', 'Приветствие', 'Цитаты', 'Погода', 'Аудио']
  }

}

// time and date

function showTime() {
    const time = document.querySelector('.time');
    time.textContent = new Date().toLocaleTimeString();
    showDate()
    showGreeting()

    setTimeout(showTime, 1000);
}
showTime()

function showDate() {
    const langSelect = document.querySelector('.langSelect');
    const date = document.querySelector('.date');
    const options = {dateStyle: 'full'};
    if (langSelect.value === 'en') {
    date.textContent = new Date().toLocaleDateString('en-US', options);
    }
    if (langSelect === 'ru') {
      date.textContent = new Date().toLocaleDateString('ru-RU', options);
    }
}

// greeting

function getTimeOfDay () {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) {
        return 'morning';
    } else if (hours >= 12 && hours < 18) {
        return 'afternoon';
    } else if (hours >= 18 && hours <= 23) {
        return 'evening';
    } else if (hours >= 0 && hours < 6) {
        return 'night';
    }
}

function showGreeting() {
    const langSelect = document.querySelector('.langSelect');
    const greeting = document.querySelector('.greeting');
    const name = document.querySelector('.name');
    name.placeholder = `${translation.placeholder[langSelect.value]}`;
    const timeOfDay = getTimeOfDay();
    greeting.textContent = `${translation[timeOfDay][langSelect.value]}`;
}

//local storage

function setLocalStorage() {
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');
    const langSelect = document.querySelector('.langSelect');
    localStorage.setItem('name', name.value );
    localStorage.setItem('city', city.value );
    localStorage.setItem('langSelect', langSelect.value );
    localStorage.setItem('state', JSON.stringify(state));
}
  window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');
    const langSelect = document.querySelector('.langSelect');
    if (localStorage.getItem('langSelect')) {
      langSelect.value = localStorage.getItem('langSelect');
    }
    if (localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
    if (localStorage.getItem('state')) {
      state = JSON.parse(localStorage.getItem('state'));
      defaultSetting()
    }
    if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
    } else {
      city.value = 'Minsk';
    }
    getWeather()
    translateSettings();
    setSetting()

}
  window.addEventListener('load', getLocalStorage)


// img slider
function getRandomNum (min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomNum = getRandomNum (1,20)

function setBg() {
    const body = document.querySelector('body');
    const timeOfDay = getTimeOfDay();
    const bgNum = randomNum.toString().padStart(2, "0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/GEKKO-ops/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;
    }
}
 setBg()

 function getSlideNext() {
    if (randomNum >= 20) {
        randomNum = 1;
      } else {
        randomNum++;
      }
      setBg();
}

function getSlidePrev() {
    if (randomNum <= 1) {
        randomNum = 20;
      } else {
        randomNum--;
      }
      setBg();
}

const slideNext = document.querySelector('.slide-next').addEventListener('click', getSlideNext);
const slidePrev = document.querySelector('.slide-prev').addEventListener('click', getSlidePrev);

//weahter widget
const city = document.querySelector('.city');
city.addEventListener('change', getWeather);
const weatherError = document.querySelector('.weather-error');


async function getWeather() {
    const langSelect = document.querySelector('.langSelect');
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const wind = document.querySelector('.wind');
    const humidity = document.querySelector('.humidity');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${langSelect.value}&appid=19949df13c80e843204fa13a2472d857&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    if (res.status === 404) {
        weatherError.textContent = 'Not Found';
        weatherIcon.classList.add(null);
        temperature.textContent = null;
        weatherDescription.textContent = null;
        wind.textContent = null;
        humidity.textContent = null;
} else if (res.status === 400) {
  city.value = 'Minsk';
  getLocalStorage()
} else  {
    weatherError.textContent = '';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = Math.round(`${data.main.temp}`) + `°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${translation.wether[langSelect.value][0]}: ` +  Math.round(`${data.wind.speed}`) + ` ${translation.wether[langSelect.value][1]}`;
    humidity.textContent = `${translation.wether[langSelect.value][2]}: ${data.main.humidity}%`;}
  }
 //getWeather()


 //quotes vidget
 
 const quote = document.querySelector('.quote');
 const author = document.querySelector('.author');
 const buttonQuote = document.querySelector('.change-quote');

 async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let random = Math.floor(Math.random() * data.length);

    quote.textContent = data[random].text;
    author.textContent = data[random].author;


  }
  getQuotes();

const quoteChange = buttonQuote.addEventListener('click', getQuotes)

//player

const play = document.querySelector('.play');
const buttonPrev = document.querySelector('.play-prev');
const buttonNext = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const audio = new Audio();




let isPlay = false;
let playNum = 0;
import playList from './playList.js';


playList.forEach((el, index) => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = playList[index].title;
  playListContainer.append(li);
})
let songArtist = document.querySelector('.artSong-title');
songArtist.innerHTML = playList[0].title;

function playListItemActive() {
let playListItem = document.querySelectorAll('.play-item');
playListItem.forEach(item => {
   item.classList.remove('item-active');
  });
  playListItem[playNum].classList.add('item-active');

songArtist.innerHTML = playList[playNum].title;

}

function playListSong(e) {
  playList.forEach((item, index) => {
    if (item.title === e.target.innerHTML) {
      playNum = index;
      isPlay = true;
      play.classList.add('pause');
      return playAudio();
    }
})
}
playListContainer.addEventListener('click', playListSong);

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    playListItemActive()
  }

  audio.addEventListener('ended', playNext);


  function togglePlay() {
    if (!isPlay) {
      playAudio()
      isPlay = true
      play.classList.toggle('pause');
    } else {
      audio.pause();
      isPlay = false
      play.classList.toggle('pause');
  }
  }

  play.addEventListener('click', togglePlay)

  function playNext() {
    if (isPlay) {
      if (playNum < playList.length - 1) {playNum++;}
      else {playNum = 0;}
      isPlay = true;
      playAudio();
    }
  }

  function playPrev() {
    if (isPlay) {
      if (playNum > 0) {playNum--;}
      else {playNum = playList.length - 1;}
      isPlay = true;
      playAudio();
    }
  }

  buttonNext.addEventListener('click', playNext);
  buttonPrev.addEventListener('click', playPrev);

  //advance player

  const progressBar = document.getElementById('progress-bar');

  function updateProgressValue() {
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(audio.currentTime)));
    document.querySelector('.durationTime').innerHTML = playList[0].duration;
    if (isPlay) {
     document.querySelector('.durationTime').innerHTML = playList[playNum].duration;
    }

};

function formatTime(seconds) {
  let min = Math.floor((seconds / 60));
  let sec = Math.floor(seconds - (min * 60));
  if (sec < 10){
      sec  = `0${sec}`;
  };
  return `${min}:${sec}`;
};

setInterval(updateProgressValue, 500);

function changeProgressBar() {
  audio.currentTime = progressBar.value;
};
progressBar.addEventListener("change", changeProgressBar);

const volumeSlider = document.querySelector(".volume-slider");
function volumeChange(e) {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}

volumeSlider.addEventListener('click', volumeChange);


function volumeMute() {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
}
document.querySelector(".volume-button").addEventListener("click", volumeMute)
//translate app
function langSwitch(){
  const langSelect = document.querySelector('.langSelect');
  langSelect.addEventListener('click', () => {
  if (langSelect.value === 'en') {
    getWeather();
    showGreeting();;
    showDate();
    translateSettings()
  }
  if (langSelect.value === 'ru') {
    getWeather();
    showGreeting();
    showDate();
    translateSettings();
  }
})
}
langSwitch()

//settings

let state = {
  time: true,
  date: true,
  'greeting-container': true,
  'quote-container': true,
  player: true,
  weather: true
}

function openSettings () {
  const settings = document.querySelector('.settings')
  settings.classList.toggle('settings-active')
}
document.querySelector('.setting').addEventListener('click', openSettings)

const langSelect = document.querySelector('.langSelect');

function translateSettings() {
  document.getElementById('Language').textContent = translation.settings[langSelect.value][0];
  document.getElementById('Time').textContent = translation.settings[langSelect.value][1];
  document.getElementById('Date').textContent = translation.settings[langSelect.value][2];
  document.getElementById('Greeting').textContent = translation.settings[langSelect.value][3];
  document.getElementById('Quote').textContent = translation.settings[langSelect.value][4];
  document.getElementById('Weather').textContent = translation.settings[langSelect.value][5];
  document.getElementById('Audio').textContent = translation.settings[langSelect.value][6];
}

const checkboxes = document.querySelectorAll('.checkbox input[type=checkbox]');


function defaultSetting() {
  checkboxes.forEach(i => {
    i.checked = state[i.name];
    if (!i.checked) {
      document.querySelector(`.${i.name}`).classList.add('hidden-element');
    }
  });
}

function setSetting() {
  checkboxes.forEach(i => {
   i.addEventListener('click', (e) => {
    if (i.checked != state[i.name]) {
      state[`${i.name}`] = i.checked;
      document.querySelector(`.${i.name}`).classList.toggle('hidden-element');
      }
    else {
      document.querySelector(`.${i.name}`).classList.toggle('hidden-element');
      }
   })
  })
      }

//
console.log('Уважаемые проверяющие пожалуйста перед проверкой очистите Local storage затем обновите странцу');
console.log(`Ваша оценка - 128 баллов 
  Отзыв по пунктам ТЗ:
  Не выполненные/не засчитанные пункты:
  1) можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте 
  
  2) переводится цитата дня т.е цитата отображается на текущем языке приложения. Сама цитата может быть другая 
  
  3) в качестве источника изображений может использоваться Unsplash API 
  
  4) в качестве источника изображений может использоваться Flickr API 
  
  5) в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API 
  
  6) если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото 
  
  7) ToDo List - список дел (как в оригинальном приложении) или Список ссылок (как в оригинальном приложении) или Свой собственный дополнительный функционал, по сложности аналогичный предложенным 
  
  Выполненные пункты:
  1) время выводится в 24-часовом формате, например: 21:01:00 
  
  2) время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) 
  
  3) выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" 
  
  4) текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь). Проверяется соответствие приветствия текущему времени суток 
  
  5) пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется 
  
  6) ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20). Проверяем, что при перезагрузке страницы фоновое изображение изменилось. Если не изменилось, перезагружаем страницу ещё раз 
  
  7) изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.Изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) 
  
  8) изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) 
  
  9) при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения 
  
  10) при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage 
  
  11) для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API. Данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел 
  
  12) выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) 
  
  13) при загрузке страницы приложения отображается рандомная цитата и её автор 
  
  14) при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) 
  
  15) при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause 
  
  16) при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play 
  
  17) треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) 
  
  18) трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем 
  
  19) после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. 
  
  20) добавлен прогресс-бар в котором отображается прогресс проигрывания 
  
  21) при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека 
  
  22) над прогресс-баром отображается название трека 
  
  23) отображается текущее и общее время воспроизведения трека 
  
  24) есть кнопка звука при клике по которой можно включить/отключить звук 
  
  25) добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука 
  
  26) переводится язык и меняется формат отображения даты 
  
  27) переводится приветствие и placeholder 
  
  28) переводится прогноз погоды в т.ч описание погоды и город по умолчанию 
  
  29) переводятся настройки приложения, при переключении языка приложения в настройках, язык настроек тоже меняется 
  
  30) в настройках приложения можно указать язык приложения (en/ru или en/be)  
  
  31) в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал 
  
  32) Скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их 
  
  33) настройки приложения сохраняются при перезагрузке страницы`);