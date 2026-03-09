<script>
(function() {
  console.log('СКРИПТ: инициализация');
  
  let isProcessing = false;
  
  function findSubmitButton() {
    return document.querySelector('[type="submit"]') || 
           document.querySelector('.t-submit') ||
           document.querySelector('.js-form-submit');
  }
  
  function setupButtonHandler() {
    const submitButton = findSubmitButton();
    
    if (!submitButton) {
      console.log('СКРИПТ: кнопка не найдена, повтор через 1с');
      setTimeout(setupButtonHandler, 1000);
      return;
    }
    
    console.log('СКРИПТ: кнопка найдена, устанавливаем обработчик');
    
    submitButton.removeEventListener('click', handleButtonClick);
    submitButton.addEventListener('click', handleButtonClick);
    submitButton.setAttribute('data-handler-set', 'true');
  }
  
  async function handleButtonClick(e) {
    if (isProcessing) {
      console.log('СКРИПТ: уже обрабатывается, игнорируем');
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    console.log('СКРИПТ: кнопка нажата');
    isProcessing = true;
    
    e.preventDefault();
    e.stopPropagation();
    
    const form = document.querySelector('form') || 
                 document.querySelector('.t-form');
    
    const phoneInput = document.querySelector('input.js-phonemask-result.js-tilda-rule[name="Phone"]') ||
                      document.querySelector('input[name="Phone"]') ||
                      document.querySelector('.js-phonemask-result');
    
    console.log('СКРИПТ: поле телефона найдено?', !!phoneInput);
    
    if (!phoneInput) {
      alert('Ошибка: поле телефона не найдено');
      isProcessing = false;
      return;
    }
    
    const phone = phoneInput.value.trim();
    const cleanPhone = phone.replace(/\D/g, '');
    
    console.log('СКРИПТ: телефон (очищенный):', cleanPhone);
    
    if (cleanPhone.length < 10) {
      alert('Введите корректный номер телефона');
      isProcessing = false;
      return;
    }
	
	// Обновлённая ссылка на CSV-файл в репозитории Ibeliveicanfly666/spam_filter
	const csvUrl = 'https://raw.githubusercontent.com/Ibeliveicanfly666/spam_filter/main/users.csv'; 
    
    try {
      console.log('СКРИПТ: загружаем CSV...');
	  
	  const response = await fetch(csvUrl);
      if (!response.ok) throw new Error('Ошибка загрузки CSV');
      const csvText = await response.text();
      
      console.log('СКРИПТ: CSV загружен, длина:', csvText.length);
      // Выводим только начало содержимого для безопасности
      console.log('СКРИПТ: Начало CSV содержимого:', csvText.substring(0, 200));
      
      const lines = csvText.split('\n');
      let phoneFound = false;
      
      const firstLine = lines[0]?.toLowerCase() || '';
      const hasHeader = firstLine.includes('phone');
      
      const startIndex = hasHeader ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const csvPhone = line.replace(/\D/g, '');
        console.log(`СКРИПТ: Телефон в файле ${csvPhone}`);
          
        if (csvPhone.slice(-10) === cleanPhone.slice(-10)) {
            phoneFound = true;
            console.log('СКРИПТ: совпадение в строке', i);
            break;
        }

      }
      
      console.log('СКРИПТ: телефон найден в CSV?', phoneFound);
      
      if (phoneFound) {
        console.log('СКРИПТ: телефон найден, редирект');
        // Обновлённая целевая ссылка (по желанию, можно оставить старую)
        // window.location.href = 'https://palatkadome.tilda.ws/pol';
        // Или использовать другую, если нужно
         window.location.href = 'https://palatkadome.tilda.ws/pol  '; // Старая осталась
      } else {
        console.log('СКРИПТ: телефон не найден, отправляем форму');
        
        // Удаляем обработчик перед отправкой
        const currentButton = findSubmitButton();
        if (currentButton) {
          currentButton.removeEventListener('click', handleButtonClick);
        }
        
        // Небольшая задержка перед отправкой
        setTimeout(() => {
          const freshButton = findSubmitButton();
          if (freshButton) {
            console.log('СКРИПТ: кликаем свежую кнопку');
            freshButton.click();
          } else if (form) {
            console.log('СКРИПТ: отправляем форму программно');
            form.submit();
          }
          
          // Возвращаем обработчик через некоторое время
          setTimeout(() => {
            isProcessing = false;
            setupButtonHandler();
          }, 1000);
        }, 50);
      }
      
    } catch (error) {
      console.error('СКРИПТ: ошибка', error);
      isProcessing = false;
      
      // В случае ошибки отправляем форму
      setTimeout(() => {
        const freshButton = findSubmitButton();
        if (freshButton) {
          freshButton.click();
        } else if (form) {
          form.submit();
        }
      }, 50);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtonHandler);
  } else {
    setupButtonHandler();
  }
  
  const observer = new MutationObserver(function(mutations) {
    if (isProcessing) return;
    
    const button = findSubmitButton();
    if (button && !button.hasAttribute('data-handler-set')) {
      console.log('СКРИПТ: MutationObserver нашел новую кнопку');
      button.addEventListener('click', handleButtonClick);
      button.setAttribute('data-handler-set', 'true');
    }
  });
  
  setTimeout(() => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }, 1000);
  
})();
</script>