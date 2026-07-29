const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');



themeToggle.addEventListener('change', function() {
    if (this.checked) 
        localStorage.setItem('theme', 'light');
    else 
        localStorage.setItem('theme', 'dark');

    document.documentElement.classList.toggle('dark');
    
});
// Функция для установки состояния переключателя
function setToggleState(isLightTheme) {
    themeToggle.checked = isLightTheme;
}

if (savedTheme === 'light') {
    document.documentElement.classList.add('dark');
    setToggleState(true);
} else {
    document.documentElement.classList.remove('dark');
    setToggleState(false);
}


