// Obsługa podglądu zdjęcia w formularzu zadania

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const oldImageContainer = document.getElementById('oldImageContainer');
    const form = document.querySelector('.task-form');

    if (!imageInput || !preview || !previewImg) return;

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            showStyledAlert('Dozwolone są tylko pliki PNG, JPG i JPEG!');
            imageInput.value = "";
            if (preview) {
                preview.style.display = 'none';
                previewImg.src = "";
            }
            return;
        }
        if (oldImageContainer) oldImageContainer.style.display = file ? 'none' : '';
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            if (oldImageContainer) oldImageContainer.style.display = '';
        }
    });

    if (form) {
        form.addEventListener('submit', function(e) {
            if (!imageInput.files.length) return;
            const file = imageInput.files[0];
            if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                e.preventDefault();
                showStyledAlert('Dozwolone są tylko pliki PNG, JPG i JPEG!');
            }
        });
    }

    function showStyledAlert(message) {
        const oldAlert = document.querySelector('.custom-upload-alert');
        if (oldAlert) oldAlert.remove();

        const div = document.createElement('div');
        div.className = 'alert alert-danger custom-upload-alert mt-3';
        div.innerHTML = `<i class=\"bi bi-exclamation-triangle\"></i> ${message}`;

        if (form) {
            form.parentNode.insertBefore(div, form);
            div.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (imageInput) imageInput.value = "";
        
        if (preview) {
            preview.style.display = 'none';
            previewImg.src = "";
        }
    }
}); 