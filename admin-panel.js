let currentOyunPage = 1; // Mevcut oyun sayfasını tutar
let currentHaberPage = 1; // Mevcut haber sayfasını tutar
let currentKullaniciPage = 1; // Mevcut kullanıcı sayfasını tutar
const itemsPerPage = 10; // Her sayfada kaç öğe gösterileceğini belirler

document.addEventListener('DOMContentLoaded', function () {
    // Form submit eventlerini handle eden fonksiyonları ekler
    document.getElementById('newOyunForm').addEventListener('submit', handleNewOyunFormSubmit);
    document.getElementById('newHaberForm').addEventListener('submit', handleNewHaberFormSubmit);
    document.getElementById('newKullaniciForm').addEventListener('submit', handleNewKullaniciFormSubmit);
    document.getElementById('editKullaniciForm').addEventListener('submit', handleEditKullaniciFormSubmit);
    document.getElementById('editOyunForm').addEventListener('submit', handleEditOyunFormSubmit);
    document.getElementById('editHaberForm').addEventListener('submit', handleEditHaberFormSubmit);
    openTab(null, 'Oyunlar'); // Varsayılan olarak Oyunlar sekmesini açar
});

function openTab(event, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'; // Tüm tab içeriklerini gizler
    }
    const tablinks = document.getElementsByClassName('list-group-item');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', ''); // Aktif tab linklerini temizler
    }
    document.getElementById(tabName).style.display = 'block'; // Seçilen tab içeriğini gösterir
    if (event) {
        event.currentTarget.className += ' active'; // Seçilen tab linkini aktif yapar
    }
    if (tabName === 'Oyunlar') {
        loadOyunlar(); // Oyunlar tabı açıldığında oyunları yükler
    } else if (tabName === 'Haberler') {
        loadHaberler(); // Haberler tabı açıldığında haberleri yükler
    } else if (tabName === "Kullanicilar") {
        loadKullanicilar(); // Kullanicilar tabı açıldığında kullanıcıları yükler
    }
}

function loadOyunlar() {
    fetch('oyunlar.php')
        .then(response => response.json())
        .then(data => {
            paginateData(data, 'oyun'); // Oyun verilerini sayfalara böler
        })
        .catch(error => console.error('Error:', error)); // Hata varsa konsola yazdırır
}

function loadHaberler() {
    fetch('haberler.php')
        .then(response => response.json())
        .then(data => {
            paginateData(data, 'haber'); // Haber verilerini sayfalara böler
        })
        .catch(error => console.error('Error:', error)); // Hata varsa konsola yazdırır
}

function loadKullanicilar() {
    fetch('kullanicilar.php')
        .then(response => response.json())
        .then(data => {
            paginateData(data, 'kullanici'); // Kullanıcı verilerini sayfalara böler
        })
        .catch(error => console.error('Error:', error)); // Hata varsa konsola yazdırır
}

function paginateData(data, type) {
    const pageCount = Math.ceil(data.length / itemsPerPage); // Toplam sayfa sayısını hesaplar
    const pagination = document.getElementById(
        type === 'oyun' ? 'oyunPagination' : 
        type === 'haber' ? 'haberPagination' : 
        'kullaniciPagination'); // Doğru pagination elemanını seçer
    pagination.innerHTML = ''; // Pagination içeriğini temizler

    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.onclick = () => {
            if (type === 'oyun') {
                currentOyunPage = i;
                displayPageData(data, i, type); // Seçilen sayfadaki oyunları gösterir
            } else if (type === 'haber') {
                currentHaberPage = i;
                displayPageData(data, i, type); // Seçilen sayfadaki haberleri gösterir
            } else {
                currentKullaniciPage = i;
                displayPageData(data, i, type); // Seçilen sayfadaki kullanıcıları gösterir
            }
        };
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }

    displayPageData(data, 
        type === 'oyun' ? currentOyunPage : 
        type === 'haber' ? currentHaberPage : 
        currentKullaniciPage, type); // İlk sayfa verilerini gösterir
}

function displayPageData(data, page, type) {
    const list = document.getElementById(
        type === 'oyun' ? 'oyunlarListesi' :
        type === 'haber' ? 'haberlerListesi' : 
        'kullanicilarListesi'
    );
    list.innerHTML = ''; // Liste içeriğini temizler
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = data.slice(start, end); // Sayfalara böler

    paginatedItems.forEach(item => {
        const listItem = createListItem(item, type); // Liste öğesini oluşturur
        list.appendChild(listItem); // Listeye ekler
    });
}

function createListItem(data, type) {
    const item = document.createElement('div');
    item.className = 'table-item';

    if (type === 'oyun' || type === 'haber') {
        const img = document.createElement('img');
        img.src = type === 'oyun' ? data.resim_url : data.gorsel_url; // Görsel URL'ini ekler
        item.appendChild(img);

        const details = document.createElement('div');
        details.className = 'table-item-details';

        const title = document.createElement('div');
        title.className = 'table-item-title';
        title.textContent = data.baslik; // Başlığı ekler
        details.appendChild(title);

        const description = document.createElement('div');
        description.className = 'table-item-description';
        description.textContent = `${data.aciklama.split(' ').slice(0, 30).join(' ')}...`; // Açıklamayı kısaltıp ekler
        details.appendChild(description);

        item.appendChild(details);
    } else if (type === 'kullanici') {
        const details = document.createElement('div');
        details.className = 'table-item-details';

        const username = document.createElement('div');
        username.className = 'table-item-title';
        username.textContent = data.kullanici_adi; // Kullanıcı adını ekler
        details.appendChild(username);

        const password = document.createElement('div');
        password.className = 'table-item-description';
        password.textContent = data.sifre; // Şifreyi ekler
        details.appendChild(password);

        item.appendChild(details);
    }

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Düzenle';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => type === 'oyun' ? openEditOyunForm(data) : 
                       type === 'haber' ? openEditHaberForm(data) : openEditKullaniciForm(data); // Düzenle butonuna tıklandığında formu açar
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Sil';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => type === 'oyun' ? deleteOyun(data.id) : 
                         type === 'haber' ? deleteHaber(data.id) : deleteKullanici(data.id); // Sil butonuna tıklandığında veriyi siler
    actions.appendChild(deleteBtn);

    item.appendChild(actions);

    return item;
}

function handleNewKullaniciFormSubmit(event) {
    event.preventDefault(); // Formun varsayılan submit işlemini engeller
    const formData = new FormData(event.target);
    fetch('ekle_kullanici.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#newKullaniciModal').modal('hide'); // Modalı kapatır
                loadKullanicilar(); // Kullanicilari tekrar yükler
                alert('Başarılı bir şekilde eklendi.');
                event.target.reset(); // Formu resetler
            } else {
                alert(data.message || 'Bir hata oluştu.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function handleEditKullaniciFormSubmit(event) {
    event.preventDefault(); // Formun varsayılan submit işlemini engeller
    const formData = new FormData(event.target);
    fetch('guncelle_kullanici.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#editKullaniciModal').modal('hide'); // Modalı kapatır
                loadKullanicilar(); // Kullanicilari tekrar yükler
                alert('Başarılı bir şekilde güncellendi.');
            } else {
                alert(data.message || 'Bir hata oluştu.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function openEditKullaniciForm(kullanici) {
    $('#editKullaniciModal').modal('show'); // Düzenleme modalını açar
    document.getElementById('editKullaniciId').value = kullanici.id; // Kullanıcının ID'sini formda saklar
    document.getElementById('editKullaniciadi').value = kullanici.kullanici_adi; // Kullanıcı adını formda gösterir
    document.getElementById('editKullanicisifre').value = kullanici.sifre; // Şifreyi formda gösterir
}

function deleteKullanici(id) {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        fetch('sil_kullanici.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${id}` // Silinecek kullanıcının ID'sini gönderir
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadKullanicilar(); // Kullanicilari tekrar yükler
                } else {
                    alert(data.message || 'Bir hata oluştu.');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function openNewKullaniciForm() {
    $('#newKullaniciModal').modal('show'); // Yeni kullanıcı ekleme modalını açar
}
