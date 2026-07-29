const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.documentElement.classList.add('dark');
    themeToggle.checked = true;
} else {
    document.documentElement.classList.remove('dark');
    themeToggle.checked = false;
}

themeToggle.addEventListener('change', function() {
    if (this.checked) 
        localStorage.setItem('theme', 'light');
    else 
        localStorage.setItem('theme', 'dark');

    document.documentElement.classList.toggle('dark');
    
});



