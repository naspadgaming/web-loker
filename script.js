// =========================
// Constants LocalStorage
// =========================
const LS_JOBS = 'jobs_v3';
const LS_CV = 'cv_data_v3';
const LS_APPLY = 'apply_data_v3';

// =========================
// Helper Functions
// =========================
function genId() {
    return 'j_' + Math.random().toString(36).slice(2, 9);
}

function load(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// =========================
// Initial Data
// =========================
let jobs = load(LS_JOBS);
if (jobs.length === 0) {
    jobs = [
        { id: genId(), title: "Kasir Minimarket", company: "IndoMini", location: "Jakarta", salary: "Rp3.000.000", desc: "Melayani transaksi & stok barang." },
        { id: genId(), title: "Staff Admin", company: "PT Data Jaya", location: "Bandung", salary: "Rp4.000.000", desc: "Mengelola dokumen & laporan kantor." }
    ];
    save(LS_JOBS, jobs);
}

// =========================
// Render Functions
// =========================
function renderJobs() {
    const list = document.getElementById('jobList');
    list.innerHTML = '';
    jobs.forEach(j => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <strong>${j.title}</strong><br>
            <span class="muted">${j.company} • ${j.location}</span><br>
            <span class="small">${j.salary || '-'}</span>
            <p class="small">${j.desc}</p>
            <button onclick="applyJob('${j.id}')">Lamar Sekarang</button>
        `;
        list.appendChild(div);
    });
}

function renderApply() {
    const data = load(LS_APPLY);
    const el = document.getElementById('applyList');
    if (data.length === 0) { 
        el.textContent = 'Belum ada lamaran.'; 
        return; 
    }
    el.innerHTML = '';
    data.forEach(a => {
        const p = document.createElement('p');
        p.className = 'small';
        p.innerHTML = `✅ ${a.title} <br><span class="muted">${a.company} (${a.date})</span>`;
        el.appendChild(p);
    });
}

// =========================
// Modal Tambah Loker
// =========================
const modalAdd = document.getElementById('modalAdd');
document.getElementById('btnAdd').onclick = () => modalAdd.style.display = 'flex';
document.getElementById('cancelAdd').onclick = () => modalAdd.style.display = 'none';
document.getElementById('saveAdd').onclick = () => {
    const t = document.getElementById('title').value.trim();
    const c = document.getElementById('company').value.trim();
    const l = document.getElementById('location').value.trim();
    const s = document.getElementById('salary').value.trim();
    const d = document.getElementById('desc').value.trim();
    if (!t || !c) { alert('Isi judul & perusahaan!'); return; }
    jobs.unshift({ id: genId(), title: t, company: c, location: l, salary: s, desc: d });
    save(LS_JOBS, jobs);
    modalAdd.style.display = 'none';
    renderJobs();
};

// =========================
// Modal Unggah CV
// =========================
const modalCV = document.getElementById('modalCV');
const cvName = document.getElementById('cvName');
const cvEmail = document.getElementById('cvEmail');
const cvSkill = document.getElementById('cvSkill');
const cvFile = document.getElementById('cvFile');
const cvPreview = document.getElementById('cvPreview');

document.getElementById('btnCV').onclick = () => {
    const cv = JSON.parse(localStorage.getItem(LS_CV) || '{}');
    cvName.value = cv.name || '';
    cvEmail.value = cv.email || '';
    cvSkill.value = cv.skill || '';
    cvPreview.innerHTML = cv.fileName ? `📄 CV tersimpan: <b>${cv.fileName}</b>` : "Belum ada file diunggah.";
    modalCV.style.display = 'flex';
};

document.getElementById('cancelCV').onclick = () => modalCV.style.display = 'none';

document.getElementById('saveCV').onclick = () => {
    const file = cvFile.files[0];
    const data = {
        name: cvName.value.trim(),
        email: cvEmail.value.trim(),
        skill: cvSkill.value.trim()
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            data.fileData = e.target.result;
            data.fileName = file.name;
            localStorage.setItem(LS_CV, JSON.stringify(data));
            cvPreview.innerHTML = `📄 CV tersimpan: <b>${file.name}</b>`;
            alert('CV berhasil disimpan!');
        };
        reader.readAsDataURL(file);
    } else {
        localStorage.setItem(LS_CV, JSON.stringify(data));
        alert('CV disimpan tanpa file.');
    }
    modalCV.style.display = 'none';
};

// =========================
// Apply Job
// =========================
function applyJob(id) {
    const cv = JSON.parse(localStorage.getItem(LS_CV) || '{}');
    if (!cv.name || !cv.email) {
        alert('Harap isi CV terlebih dahulu di menu 📄 CV Saya');
        return;
    }
    const j = jobs.find(x => x.id === id);
    if (!j) return;
    const list = load(LS_APPLY);
    list.unshift({ title: j.title, company: j.company, date: new Date().toLocaleDateString() });
    save(LS_APPLY, list);
    alert(`Lamaran dikirim (simulasi) untuk ${j.title}.\nCV: ${cv.fileName || "Belum ada file."}`);
    renderApply();
}

// =========================
// Initial Render
// =========================
renderJobs();
renderApply();

document.getElementById('saveCV').onclick = () => {
    const file = cvFile.files[0]; // File baru (jika ada)
    let data = JSON.parse(localStorage.getItem(LS_CV) || '{}');

    // Update atau isi data
    data.name = cvName.value.trim();
    data.email = cvEmail.value.trim();
    data.skill = cvSkill.value.trim();

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            data.fileData = e.target.result; // Base64 file
            data.fileName = file.name;
            localStorage.setItem(LS_CV, JSON.stringify(data));
            cvPreview.innerHTML = `📄 CV tersimpan: <b>${file.name}</b>`;
            alert('CV berhasil diperbarui!');
        };
        reader.readAsDataURL(file);
    } else {
        localStorage.setItem(LS_CV, JSON.stringify(data));
        cvPreview.innerHTML = data.fileName ? `📄 CV tersimpan: <b>${data.fileName}</b>` : "Belum ada file diunggah.";
        alert('Data CV berhasil diperbarui tanpa file baru.');
    }

    modalCV.style.display = 'none';
};
