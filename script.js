document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCost);
    }

    // Анимация скрытия/показа навигации при скролле
    let lastScrollY = window.scrollY;
    const header = document.getElementById('navbar').parentElement;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Скролл вниз
            header.classList.add('hidden');
        } else {
            // Скролл вверх
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Анимация появления элементов при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-item, .calc-form, .result');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    // Установка начального состояния для анимации
    const elementsToAnimate = document.querySelectorAll('.feature-item, .calc-form, .result');
    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    window.addEventListener('scroll', animateOnScroll);
    // Запустить сразу на случай, если элементы уже в поле зрения
    animateOnScroll();

    // Валидация формы контактов
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время!');
            contactForm.reset();
        });
    }
});

function calculateCost() {
    // Получаем значения из формы
    const language = document.getElementById('language');
    const languageName = language.options[language.selectedIndex].text;
    const basePrice = parseFloat(document.getElementById('language').value);
    const intensity = document.getElementById('intensity');
    const intensityName = intensity.options[intensity.selectedIndex].text;
    const intensityMultiplier = parseFloat(document.getElementById('intensity').value);
    const months = parseInt(document.getElementById('months').value);

    // Более сложная и реалистичная логика расчета
    let totalCost = 0;
    let details = []; // Для детализации расчета

    // 1. Базовая стоимость за все месяцы
    const baseCost = basePrice * months;
    totalCost += baseCost;
    details.push(`Базовая стоимость (${basePrice} руб/мес × ${months} мес): <strong>${baseCost.toLocaleString()} руб</strong>`);

    // 2. Надбавка за интенсивность
    if (intensityMultiplier > 1) {
        const intensityExtra = baseCost * (intensityMultiplier - 1);
        totalCost += intensityExtra;
        details.push(`Надбавка за интенсивность (${intensityName}): <strong>+${intensityExtra.toLocaleString()} руб</strong>`);
    }

    // 3. Скидка за длительность курса
    let discount = 0;
    let discountPercent = 0;
    
    if (months >= 6 && months < 9) {
        discountPercent = 5;
    } else if (months >= 9 && months < 12) {
        discountPercent = 10;
    } else if (months >= 12) {
        discountPercent = 15;
    }

    if (discountPercent > 0) {
        discount = totalCost * discountPercent / 100;
        totalCost -= discount;
        details.push(`Скидка за ${months} месяцев (${discountPercent}%): <strong>-${discount.toLocaleString()} руб</strong>`);
    }

    // 4. Дополнительные услуги
    const materialsCost = 500 * months; // Учебные материалы
    totalCost += materialsCost;
    details.push(`Учебные материалы (500 руб/мес): <strong>+${materialsCost.toLocaleString()} руб</strong>`);

    // 5. Регистрационный взнос
    const registrationFee = 1000;
    totalCost += registrationFee;
    details.push(`Регистрационный взнос: <strong>+${registrationFee.toLocaleString()} руб</strong>`);

    // Отображаем результат
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <h3>Детальный расчет для "${languageName}"</h3>
        <div class="calculation-details">
            ${details.map(detail => `<p>${detail}</p>`).join('')}
        </div>
        <div class="total-cost">
            <h4>Итоговая стоимость: <strong>${Math.round(totalCost).toLocaleString()} руб</strong></h4>
            <p class="monthly-cost">≈ ${Math.round(totalCost / months).toLocaleString()} руб/месяц</p>
        </div>
        <div class="payment-options">
            <p><strong>Варианты оплаты:</strong></p>
            
            ${months >= 3 ? `
                <div class="payment-option best">
                    <p><strong>ВЫГОДНО</strong> - Полная оплата: <strong>${Math.round(totalCost * 0.9).toLocaleString()} руб</strong> (экономия ${Math.round(totalCost * 0.1).toLocaleString()} руб)</p>
                </div>
                <div class="payment-option">
                    <p>Рассрочка на ${months} месяцев: <strong>${Math.round(totalCost / months).toLocaleString()} руб/мес</strong> (без переплаты)</p>
                </div>
            ` : `
                <div class="payment-option only">
                    <p>Полная оплата: <strong>${Math.round(totalCost).toLocaleString()} руб</strong></p>
                    <p class="note">Для курсов менее 3 месяцев рассрочка не предусмотрена</p>
                </div>
            `}
        </div>
    `;
    
    resultElement.style.display = 'block';

    // Анимация появления
    resultElement.style.opacity = "0";
    resultElement.style.transform = "translateY(20px)";
    
    setTimeout(() => {
        resultElement.style.opacity = "1";
        resultElement.style.transform = "translateY(0)";
    }, 50);
}