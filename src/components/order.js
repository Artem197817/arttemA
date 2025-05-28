
//import './carousel.js';
import config from "../../config/config";


export class Order {
    constructor() {

      this.initForm();
      this.initCarousel(); 
      
 
    }
  
    initForm() {
      const form = document.querySelector('.order-form');
      const dropArea = document.getElementById('drop-area');
      const fileElem = document.getElementById('fileElem');
      const fileSelectBtn = document.getElementById('fileSelectBtn');
      const fileList = document.getElementById('file-list');
      let filesToUpload = [];
  
      // Drag & Drop events
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.add('dragover');
        }, false);
      });
  
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.remove('dragover');
        }, false);
      });
  
      dropArea.addEventListener('drop', (e) => {
        const droppedFiles = Array.from(e.dataTransfer.files);
        filesToUpload = filesToUpload.concat(droppedFiles);
        updateFileList();
      });
  
      // Кнопка выбора файлов
      fileSelectBtn.addEventListener('click', () => fileElem.click());
      fileElem.addEventListener('change', (e) => {
        filesToUpload = filesToUpload.concat(Array.from(e.target.files));
        updateFileList();
        fileElem.value = ''; // сбросить input
      });
  
      function updateFileList() {
        fileList.innerHTML = '';
        if (filesToUpload.length === 0) {
          fileList.textContent = 'Файлы не выбраны.';
          return;
        }
        filesToUpload.forEach((file, idx) => {
          const div = document.createElement('div');
          div.textContent = `${file.name} (${Math.round(file.size / 1024)} КБ)`;
          // Кнопка удаления файла
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.textContent = '×';
          removeBtn.style.marginLeft = '10px';
          removeBtn.onclick = () => {
            filesToUpload.splice(idx, 1);
            updateFileList();
          };
          div.appendChild(removeBtn);
          fileList.appendChild(div);
        });
      }
  
      // Валидация и отправка формы
      form.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        const email = form.email.value.trim();
        const orderDescription = form.orderDescription.value.trim();
  
        let valid = true;
        if (!name) { showError(form.name, 'Введите ваше имя.'); valid = false; } else { clearError(form.name); }
        if (!phone || !/^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(phone)) {
          showError(form.phone, 'Введите корректный телефон.'); valid = false;
        } else { clearError(form.phone); }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showError(form.email, 'Введите корректный e-mail.'); valid = false;
        } else { clearError(form.email); }
        if (!valid) return;
  
        // DTO
        const data = { name, phone, email, orderDescription };
  
        // FormData
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        filesToUpload.forEach(file => formData.append('files', file));
  
        fetch(config.host +'/order/dto/submitOrder', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.text();
          })
          .then(msg => {
            alert(msg || 'Заказ успешно отправлен!');
            form.reset();
            filesToUpload = [];
            updateFileList();
          })
          .catch(error => {
            alert('Ошибка отправки: ' + error.message);
          });
      });
  
      function showError(input, message) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback) {
          feedback.textContent = message;
          feedback.style.display = 'block';
        }
      }
  
      function clearError(input) {
        input.classList.remove('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback) {
          feedback.style.display = 'none';
        }
      }
  
      // Инициализация списка файлов
      updateFileList();
    }
    initCarousel(){
        let radius = 350; 
let autoRotate = true;
let rotateSpeed = -60; 
let imgWidth = 250; 
let imgHeight = 250;
setTimeout(init, 300);
let odrag = document.getElementById("drag-container");
let ospin = document.getElementById("spin-container");
let carousel = document.getElementById("carousel");
let aImg = ospin.getElementsByTagName("img");
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
let ground = document.getElementById("ground");
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";
function init(delayTime) {
    for (let i = 0; i < aImg.length; i++) {
        aImg[i].style.transform =
        "rotateY(" +
        i * (360 / aImg.length) +
        "deg) translateZ(" +
        radius +
        "px)";
        aImg[i].style.transition = "transform 1s";
        aImg[i].style.transitionDelay =
        delayTime || (aImg.length - i) / 4 + "s";
    }
}
function applyTranform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}
function playSpin(yes) {
    ospin.style.animationPlayState = yes ? "running" : "paused";
}
let sX,
sY,
nX,
nY,
desX = 0,
desY = 0,
tX = 0,
tY = 10;
if (autoRotate) {
    let animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
    ospin.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
    )}s infinite linear`;
}
carousel.onpointerdown = function(e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    let sX = e.clientX,
    sY = e.clientY;
    this.onpointermove = function(e) {
        e = e || window.event;
        let nX = e.clientX,
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        sX = nX;
        sY = nY;
    };
    this.onpointerup = function(e) {
        odrag.timer = setInterval(function() {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};
    }
  }
  