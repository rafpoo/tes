// Data sementara (bisa diganti dengan database)
let data = []; // Sesuaikan ini dengan data Anda
let currentPage = 1; // Halaman yang sedang aktif
const recordsPerPage = 10; // Jumlah data yang ditampilkan per halaman

// Function untuk mengurutkan data berdasarkan NIM
function sortData() {
    data.sort((a, b) => {
        return a.nim.localeCompare(b.nim);
    });
}

// Function untuk menampilkan data
function displayData() {
    sortData(); // Panggil fungsi sortData() sebelum menampilkan data

    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    currentData.forEach((item, index) => {
        const row = tableBody.insertRow();
        const nimCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const alamatCell = row.insertCell(2);
        const actionCell = row.insertCell(3);

        nimCell.textContent = item.nim;
        nameCell.textContent = item.nama;
        alamatCell.textContent = item.alamat;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => openEditModal(index + startIndex);
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.onclick = () => deleteData(index + startIndex);
        actionCell.appendChild(deleteButton);
    });

    updatePageNavigation();
}

// Function untuk menambah data
function addData() {
    const nim = document.getElementById('nim').value;
    const nama = document.getElementById('name').value; 
    const alamat = document.getElementById('alamat').value;

    // Periksa apakah semua bidang telah diisi
    if (nim && nama && alamat) {
        data.push({ nim, nama, alamat });
        displayData();
        openFeedbackModal('Data berhasil ditambahkan!', 'success');
        document.getElementById('addForm').reset();
    } else {
        openFeedbackModal('Data tidak lengkap!', 'error');
    }
}


// Function untuk menampilkan navigasi halaman
function updatePageNavigation() {
    const totalPages = Math.ceil(data.length / recordsPerPage);

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (currentPage === totalPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

// Function untuk navigasi ke halaman sebelumnya
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayData();
    }
}

// Function untuk navigasi ke halaman berikutnya
function nextPage() {
    const totalPages = Math.ceil(data.length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayData();
    }
}

// Tampilkan data saat halaman dimuat
displayData();


    // Function untuk menambah data
    document.getElementById('addForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const nim = document.getElementById('nim').value;
        const nama = document.getElementById('name').value; 
        const alamat = document.getElementById('alamat').value;
        if (nama && nim && alamat) {
            data.push({ nim, nama, alamat });
            displayData();
            openFeedbackModal('Data berhasil ditambahkan!', 'success');
            document.getElementById('addForm').reset();
        } else {
            openFeedbackModal('Semua kolom harus diisi!', 'warning');
        }
    });

// Function untuk mengubah data
// Function untuk membuka modal edit dengan SweetAlert2
function openEditModal(index) {
    const editNameInput = document.getElementById('editName');
    const editAlamatInput = document.getElementById('editAlamat');
    const editNIMInput = document.getElementById('editNIM'); // Tambahkan ini

    editNameInput.value = data[index].nama;
    editAlamatInput.value = data[index].alamat;

    Swal.fire({
        title: 'Edit Data',
        html:
            `<input id="swal-input1" class="swal2-input" value="${data[index].nim}" placeholder="NIM" disabled>` +
            `<input id="swal-input2" class="swal2-input" value="${data[index].nama}" placeholder="Nama">` +
            `<input id="swal-input3" class="swal2-input" value="${data[index].alamat}" placeholder="Alamat">`,   
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
            const newName = Swal.getPopup().querySelector('#swal-input2').value; // Ubah id ke 'swal-input2'
            const newAlamat = Swal.getPopup().querySelector('#swal-input3').value; // Ubah id ke 'swal-input3'
            if (!newName || !newAlamat) {
                Swal.showValidationMessage('Nama dan alamat harus diisi!');
            }
            return { newName: newName, newAlamat: newAlamat };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newName = result.value.newName;
            const newAlamat = result.value.newAlamat;
            data[index].nama = newName;
            data[index].alamat = newAlamat;
            displayData();
            Swal.fire(
                'Data Berhasil Diubah!',
                '',
                'success'
            );
            openFeedbackModal('Data berhasil diubah!', 'success');
        }
    });
}




// Function untuk menghapus data
function deleteData(index) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan data ini!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            data.splice(index, 1);
            displayData();
            Swal.fire(
                'Data Berhasil Dihapus!',
                '',
                'success'
            );
        }
    });
}
// Function untuk menampilkan pesan feedback
// Function untuk menampilkan pesan feedback
function openFeedbackModal(message, type) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = message;
    const modal = document.getElementById('feedbackModal');

    // Hapus kelas yang mungkin telah ditambahkan sebelumnya
    modal.classList.remove('feedback-success', 'feedback-error', 'feedback-warning', 'feedback-updated');

    // Tambahkan kelas sesuai dengan tipe feedback
    if (type === 'success') {
        modal.classList.add('feedback-success');
    } else if (type === 'error') {
        modal.classList.add('feedback-error');
    } else if (type === 'warning') {
        modal.classList.add('feedback-warning');
    } else if (type === 'updated') {
        modal.classList.add('feedback-updated');
    }

    modal.style.display = 'block';
    const span = document.querySelector('.close');
    span.onclick = function() {
        modal.style.display = 'none';
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    setTimeout(function() {
        modal.style.display = 'none'
    }, 2000); // Tutup modal setelah 2 detik
}


    // Tampilkan data saat halaman dimuat
    displayData();

    // JQUERY
    $(document).ready(function() {
        var username = localStorage.getItem('username');
        $('#usernamePlaceholder').text(username);
    });