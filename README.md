# Skrip Generat

Website generator skrip MikroTik RouterOS (v6 dan v7) untuk RT/RW net.
Situs statis: tanpa PHP, Node.js, atau database. Semua skrip dibuat di browser.

## Halaman
- `index.html` — beranda
- `generator.html` — generator skrip (Dasar, PPPoE Server, Hotspot, Load Balance PCC, Firewall, VLAN, Simple Queue)
- `panduan.html` — cara backup, paste di terminal, import .rsc

## Struktur
- `assets/app.js` — logika generator
- `assets/base.css` — gaya generator
- `assets/site.css` — navigasi, beranda, panduan

## Deploy di aaPanel
```
cd /www/wwwroot/skrip.kylnet.my.id
git pull
```
