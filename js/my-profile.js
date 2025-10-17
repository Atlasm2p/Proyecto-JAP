document.getElementById('change-picture-button').addEventListener('click', function() {
  document.getElementById('profile-picture-input').click();
});

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('profile-picture-input');
    const img = document.querySelector('.profile-picture img');

    const saved = localStorage.getItem('profile-picture');
    img.src = saved;
    input.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (img) img.src = e.target.result;
                localStorage.setItem('profile-picture', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});
