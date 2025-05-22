

export class Order{


    сonstructor(){
        this.initForm();
    }

    initForm(){
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.querySelector('.order-form');
          
            form.addEventListener('submit', (e) => {
              e.preventDefault(); // отменяем стандартную отправку
          
              // Ваша логика валидации
              const name = form.name.value.trim();
              const phone = form.phone.value.trim();
              const email = form.email.value.trim();
          
              let valid = true;
          
              // Пример простой валидации
              if (!name) {
                showError(form.name, 'Введите ваше имя.');
                valid = false;
              } else {
                clearError(form.name);
              }
          
              if (!phone || !/^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(phone)) {
                showError(form.phone, 'Введите корректный телефон.');
                valid = false;
              } else {
                clearError(form.phone);
              }
          
              if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError(form.email, 'Введите корректный e-mail.');
                valid = false;
              } else {
                clearError(form.email);
              }
          
              if (!valid) return;
          
              // Если валидация прошла, отправляем форму через fetch
              const formData = new FormData(form);
          
              fetch('/your-backend-endpoint', { // замените на ваш URL
                method: 'POST',
                body: formData
              })
              .then(response => {
                if (!response.ok) throw new Error('Ошибка сети');
                return response.json();
              })
              .then(data => {
                alert('Заказ успешно отправлен!');
                form.reset();
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
          });
          
    }
}