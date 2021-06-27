const burger = document.querySelector('.burger');
const menu = document.querySelector('.burger__menu');

burger.addEventListener('click', () => {
    const display = menu.style.display;

    if (display === 'block') menu.style.display = 'none';
    else menu.style.display = 'block';
});