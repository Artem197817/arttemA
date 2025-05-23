//import Swiper, { EffectCube, Pagination, Autoplay } from 'swiper';
import { register } from 'swiper/element/bundle';
register();
import 'swiper/css';

export class Order {
    constructor() {

      this.initForm();  
      
/** var swiper = new Swiper(".mySwiper", {
        effect: "cube",
        grabCursor: true,
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        autoplay: {
            delay: 2600,
            pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".swiper-pagination",
        },
      });
 */
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
  
        fetch('/order/dto/submitOrder', {
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
  }
  