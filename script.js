const API_URL = window.location.origin;
// Database Aplikasi
let database = {
    activities: [],
    teachers: [],
    students: []
};


async function loadData() {
    try {
        const response = await fetch("/api/all");

        database = await response.json();

        console.log("Database:", database);

        renderContent();
    } catch (error) {
        console.error(error);
    }
}

loadData();

let currentPage = 'home';
let currentCategory = 'all';

// Fungsi Pindah Halaman
function changePage(pageId) {
    currentPage = pageId;
    currentCategory = 'all';
    
    // UI Update
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.querySelector(`[data-page="${pageId === 'home' ? 'home' : pageId === 'teachers' ? 'teachers' : pageId === 'activities' ? 'activities' : pageId === 'students' ? 'students' : ""}"]`)?.classList.add('active');

    if (pageId === 'home') {
        document.getElementById('home').classList.add('active');
    } else {
       document.getElementById('content-page').classList.add('active');

        setTimeout(() => {
            renderContent();
        }, 0);
    }
}

// Render Header & Filter
function renderContent() {
    const title = document.getElementById('page-title');
    const filterContainer = document.getElementById('filter-container');
    filterContainer.innerHTML = '';
    
    let filters = [];
    
    if (currentPage === 'activities') {
        title.innerText = "Galeri Kegiatan";
        filters = ['all', 'angkatan', 'kelas', 'mpls', 'pta', 'gtc', 'kemah', 'smaitfair'];
    } else if (currentPage === 'students') {
        title.innerText = "Data Siswa";
        filters = ['all', 'xii-a', 'xii-b', 'xii-c', 'xii-d', 'xii-e', 'xii-f', 'xii-g', 'xii-h'];
    } else {
        title.innerText = "Dewan Guru";
    }

    filters.forEach(f => {
        const btn = document.createElement('button');
        btn.className = `chip ${currentCategory === f ? 'active' : ''}`;
        btn.innerText = f.toUpperCase();
        btn.onclick = () => {
            currentCategory = f;
            renderContent();
        };
        filterContainer.appendChild(btn);
    });

    document.getElementById('uploadBtn').style.display =
        currentPage === 'activities'
            ? 'flex'
            : 'none';
    updateGrid();
}

// Update Grid berdasarkan Filter & Search
function updateGrid() {
    const grid = document.getElementById('main-grid');
    const searchTerm = document.getElementById('main-search').value.toLowerCase();
    let data = database[currentPage] || [];
    
    // Filter Kategori
    if (currentCategory !== 'all') {
        data = data.filter(item => (item.category === currentCategory || item.class === currentCategory));
    }

    // Filter Search
    data = data.filter(item => 
        (item.title || item.name).toLowerCase().includes(searchTerm)
    );


    console.log(data);
    // change 1
    grid.innerHTML = data.map(item => `
        <div class="card"
            data-image="${item.image}"
            data-title="${item.title || item.name}"
            data-desc="${item.category || item.class || item.role}">;
           
            <img src="${item.image.replace(/\\/g, '/')}" alt="image" loading=lazy decoding=async>
           console.log(item.image);
            <div class="card-content">
                <span class="card-tag">${item.category || item.class || item.role}</span>
                <h4>${item.title || item.name}</h4>
            </div>
        </div>
    `).join('');
}

// Lightbox
function openLightbox(img, title, desc) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = img;
    document.getElementById('lb-title').innerText = title;
    document.getElementById('lb-desc').innerText = desc.toUpperCase();
    lb.style.display = 'flex';
}

// Event Listeners
document.querySelectorAll('.nav-item').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        currentCategory = 'all';
        changePage(link.getAttribute('data-page'));
    };
});

document.getElementById('main-search').addEventListener('input', () => {
    updateGrid();
});
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('main-search').value = '';
    updateGrid();
});

// change 1
document.getElementById('main-grid').addEventListener('click', (e) => {
    console.log("clicked", e.target);
    const card = e.target.closest('.card');
    console.log("card", card);
    if (!card) return;

    openLightbox(
        card.dataset.image,
        card.dataset.title,
        card.dataset.desc
    );
});

document.querySelector('.close-btn').onclick = () => {
    document.getElementById('lightbox').style.display = 'none';
};

window.onclick = (e) => {
    if (e.target.id === 'lightbox') document.getElementById('lightbox').style.display = 'none';
};

console.log("Script loaded");
function showToast(message, type){

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

const uploadBtn = document.getElementById("uploadBtn");
const uploadModal = document.getElementById("uploadModal");
const closeUploadModal = document.getElementById("closeUploadModal");

uploadBtn.addEventListener("click", () => {
    uploadModal.classList.add("show");
});

closeUploadModal.addEventListener("click", () => {
    uploadModal.classList.remove("show");
});

document
.getElementById("submitUpload")
.addEventListener("click", async () => {

    const file =
        document.getElementById("photoUpload").files[0];

    const title =
        document.getElementById("photoTitle").value;

    const category =
        document.getElementById("photoCategory").value;

    if (!file) {
        alert("Pilih foto terlebih dahulu");
        return;
    }

    const formData = new FormData();

    formData.append("photo", file);
    formData.append("title", title);
    formData.append("category", category);

    const loading = document.getElementById("uploadLoading");

    try {

        loading.classList.remove("hidden");

        const response = await fetch("/api/upload/photo", {
            method: "POST",
            body: formData
});

        const result = await response.json();
        console.log(result);
        if(result.success){

    showToast(
        "✅ Upload foto berhasil",
        "success"
    );

    loadData();
    uploadModal.classList.remove("show");

}else{

    showToast(
        "❌ Upload foto gagal",
        "error"
    );
}

    } catch(error){

    console.error(error);

    showToast(
        "❌ Upload gagal",
        "error"
    );

}

loading.classList.add("hidden");

});

const fileInput = document.getElementById("photoUpload");
const preview = document.getElementById("previewImage");

fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
});

preview.src = "";
preview.classList.add("hidden");