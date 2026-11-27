{
const TZ=['Asia/Jakarta','Asia/Makassar','Asia/Jayapura','Asia/Seoul'];
const M=[
{id:'basic',name:'Dasar',desc:'Identity, jam, WAN, bridge LAN, DHCP server, DNS dan NAT.',on:true,f:[
 ['identity','Nama router (identity)','text','Router-RTRW'],
 ['tz','Zona waktu','sel','Asia/Jakarta',TZ],
 ['wan_type','Tipe WAN','sel','dhcp',[['dhcp','DHCP client (dari modem)'],['static','IP statis'],['pppoe','PPPoE client']]],
 ['wan_if','Interface WAN','text','ether1'],
 ['wan_ip','IP WAN / CIDR','text','192.168.1.2/24','',s=>s.wan_type=='static'],
 ['wan_gw','Gateway WAN','text','192.168.1.1','',s=>s.wan_type=='static'],
 ['pp_user','User PPPoE ISP','text','','',s=>s.wan_type=='pppoe'],
 ['pp_pass','Password PPPoE ISP','text','','',s=>s.wan_type=='pppoe'],
 ['lan_br','Nama bridge LAN','text','bridge-lan'],
 ['lan_ports','Port masuk bridge','text','ether2,ether3','Pisahkan dengan koma'],
 ['lan_ip','IP LAN / CIDR','text','192.168.88.1/24'],
 ['dns','DNS server','text','8.8.8.8,1.1.1.1'],
 ['dhcp','Buat DHCP server di LAN','chk',true],
 ['nat','NAT masquerade ke WAN','chk',true]]},
{id:'pppoe',name:'PPPoE Server',desc:'Pool, profil paket, server PPPoE, akun pelanggan massal, dan profil isolir.',on:true,f:[
 ['srv_if','Interface PPPoE server','text','ether4','Bisa juga bridge atau VLAN'],
 ['local','Local address (gateway)','text','10.10.10.1'],
 ['ranges','Range pool pelanggan','text','10.10.10.2-10.10.10.254'],
 ['dns','DNS untuk pelanggan','text','8.8.8.8,1.1.1.1'],
 ['mtu','MTU/MRU PPPoE','num',1480,'Umumnya 1480'],
 ['profiles','Profil paket (nama,upload/download)','area','PAKET-10M,10M/10M\nPAKET-20M,20M/20M\nPAKET-30M,30M/30M','Satu per baris'],
 ['gen','Buat akun pelanggan massal','chk',true],
 ['prefix','Awalan username','text','plg','',s=>s.gen],
 ['start','Nomor awal','num',1,'',s=>s.gen],
 ['count','Jumlah akun','num',10,'',s=>s.gen],
 ['digits','Jumlah digit nomor','num',3,'',s=>s.gen],
 ['prof','Profil untuk akun','text','PAKET-10M','',s=>s.gen],
 ['pwmode','Password','sel','random',[['random','Acak 8 karakter'],['same','Sama dengan username'],['fixed','Satu password untuk semua']],'',s=>s.gen],
 ['pwfixed','Password tetap','text','12345678','',s=>s.gen&&s.pwmode=='fixed'],
 ['isolir','Buat profil ISOLIR','chk',true],
 ['iso_ranges','Range pool isolir','text','10.99.99.2-10.99.99.254','',s=>s.isolir],
 ['iso_redir','Redirect HTTP isolir ke (IP:port)','text','','Kosongkan jika tanpa halaman isolir',s=>s.isolir]]},
{id:'hotspot',name:'Hotspot',desc:'Server hotspot, profil user, dan voucher acak.',on:false,f:[
 ['ifc','Interface hotspot','text','ether5','Jangan dimasukkan ke bridge lain'],
 ['ip','IP hotspot / CIDR','text','172.16.0.1/22'],
 ['dns_name','DNS name halaman login','text','login.wifi'],
 ['dns','DNS server','text','8.8.8.8,1.1.1.1'],
 ['profiles','Profil user (nama,rate,shared-users)','area','1JAM,2M/2M,1\nHARIAN,3M/3M,1\nMINGGUAN,5M/5M,2','Satu per baris'],
 ['vcount','Jumlah voucher','num',20],
 ['vlen','Panjang kode','num',6],
 ['charset','Karakter kode','sel','num',[['num','Angka'],['up','Huruf besar'],['mix','Huruf + angka']]],
 ['vprefix','Awalan kode','text',''],
 ['vprof','Profil voucher','text','1JAM'],
 ['uptime','Batas waktu (limit-uptime)','text','1h','Contoh: 1h, 1d, 7d'],
 ['vmode','Mode login','sel','same',[['same','Username = password'],['diff','Username dan password beda']]],
 ['price','Harga di kartu voucher','text','Rp3.000','Hanya untuk cetak voucher']]},
{id:'lb',name:'Load Balance PCC',desc:'Bagi koneksi ke beberapa ISP dengan PCC, plus failover.',on:false,f:[
 ['wans','WAN (interface,gateway,bobot)','area','ether1,192.168.1.1,1\nether2,192.168.2.1,1','Bobot 2 = dapat jatah koneksi 2x. Gateway harus IP.'],
 ['local','Subnet lokal (tidak di-balance)','text','10.0.0.0/8,172.16.0.0/12,192.168.0.0/16'],
 ['cls','Classifier PCC','sel','both-addresses-and-ports',['both-addresses-and-ports','both-addresses','src-address','src-address-and-port']],
 ['failover','Route failover di tabel main','chk',true]]},
{id:'fw',name:'Firewall',desc:'Proteksi router dari WAN, matikan layanan tak terpakai.',on:true,f:[
 ['wan','Interface WAN tambahan','text','','WAN dari modul Dasar dan Load Balance otomatis ikut. Isi jika ada WAN lain.'],
 ['lan','Interface LAN','text','bridge-lan','Untuk neighbor dan MAC-winbox'],
 ['mgmt','Port management dibuka dari WAN','text','','Contoh: 8291. Kosongkan = tertutup'],
 ['winbox','Port Winbox','num',8291],
 ['dropdns','Blok DNS dari WAN (anti open resolver)','chk',true],
 ['dropwan','Drop semua input lain dari WAN','chk',true],
 ['fwd','Drop koneksi baru dari WAN (kecuali dst-nat)','chk',true],
 ['svc','Matikan telnet, ftp, www, api','chk',true],
 ['mac','Neighbor & MAC-winbox hanya di LAN','chk',true],
 ['fast','FastTrack','chk',false,'Mematikan efek queue/rate-limit PPPoE. Biarkan mati jika pakai limit.']]},
{id:'vlan',name:'VLAN',desc:'Banyak VLAN sekaligus, lengkap dengan IP dan DHCP.',on:false,f:[
 ['parent','Interface induk','text','bridge-lan'],
 ['list','VLAN (id,nama,IP/CIDR)','area','10,vlan10-kantor,192.168.10.1/24\n20,vlan20-pelanggan,192.168.20.1/24','Satu per baris'],
 ['dhcp','Buat DHCP server tiap VLAN','chk',true],
 ['lease','Lease time','text','1d','',s=>s.dhcp]]},
{id:'queue',name:'Simple Queue',desc:'Limit bandwidth per IP, opsional dengan induk total.',on:false,f:[
 ['list','Queue (nama,target,upload/download)','area','PC-Kasir,192.168.88.10,5M/10M\nCCTV,192.168.88.20,2M/2M','Target IP atau subnet'],
 ['parent','Pakai queue induk TOTAL','chk',false],
 ['ptarget','Target induk','text','192.168.88.0/24','',s=>s.parent],
 ['plimit','Limit induk (upload/download)','text','50M/100M','',s=>s.parent]]}
];
let S;
const def=()=>{const s={ros:'7',cmt:true,safe:true,tab:'basic',seed:Date.now()%1e9};for(const m of M){const o={on:m.on};for(const f of m.f)o[f[0]]=f[3];s[m.id]=o}return s};
try{S=JSON.parse(localStorage.getItem('mtgen1'))}catch(e){}
if(!S||!S.basic)S=def();
if(S.safe===undefined)S.safe=true;
if(S.wrap===undefined)S.wrap=true;
for(const m of M){S[m.id]=S[m.id]||{on:m.on};for(const f of m.f)if(S[m.id][f[0]]===undefined)S[m.id][f[0]]=f[3]}
const save=()=>{try{localStorage.setItem('mtgen1',JSON.stringify(S))}catch(e){}};
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const q=t=>'"'+String(t).replace(/["\\$?]/g,'\\$&')+'"';
const nm=t=>/^[A-Za-z0-9._\-]+$/.test(t)?t:q(t);
const ip2n=s=>s.split('.').reduce((a,b)=>a*256+(+b),0);
const n2ip=n=>[24,16,8,0].map(k=>Math.floor(n/2**k)%256).join('.');
const isIP=s=>/^\d{1,3}(\.\d{1,3}){3}$/.test(s)&&s.split('.').every(x=>+x<256);
function cidr(s){const m=/^(\S+)\/(\d{1,2})$/.exec((s||'').trim());if(!m||!isIP(m[1])||+m[2]>30||+m[2]<8)return null;const p=+m[2],ipn=ip2n(m[1]),size=2**(32-p),net=Math.floor(ipn/size)*size;return{ip:m[1],p,ipn,net,size,netw:n2ip(net)+'/'+p}}
function pool(c){const a=c.net+1,b=c.net+c.size-2,g=c.ipn;if(g==a)return n2ip(a+1)+'-'+n2ip(b);if(g==b)return n2ip(a)+'-'+n2ip(b-1);return n2ip(a)+'-'+n2ip(g-1)+','+n2ip(g+1)+'-'+n2ip(b)}
const rows=t=>String(t||'').split('\n').map(l=>l.split(',').map(x=>x.trim())).filter(a=>a[0]);
const list=t=>String(t||'').split(',').map(x=>x.trim()).filter(Boolean);
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const code=(r,len,set)=>{let o='';for(let i=0;i<len;i++)o+=set[Math.floor(r()*set.length)];return o};
const CH={num:'0123456789',up:'ABCDEFGHJKLMNPQRSTUVWXYZ',mix:'abcdefghjkmnpqrstuvwxyz23456789'};
const lim=(n,a,b)=>Math.max(a,Math.min(b,Math.floor(+n||0)));
let X={pppoe:[],hs:[]};
const wanIf=()=>S.basic.wan_type=='pppoe'?'pppoe-out1':S.basic.wan_if;
const lbWans=()=>S.lb.on?rows(S.lb.wans).map(x=>x[0]):[];
const lbOwnsBasic=()=>S.basic.on&&S.lb.on&&S.basic.wan_type!='pppoe'&&lbWans().includes(S.basic.wan_if);
function safe(l){if(!S.safe||!l.startsWith('/')||!/ add /.test(l)||/^\/ip (firewall (filter|nat|mangle)|route) /.test(l))return l;
 const path=l.slice(0,l.indexOf(' add ')),m=/ (?:name|address|interface)=("[^"]*"|\S+)/.exec(l),lab=(path+' '+(m?m[1]:'')).replace(/["\\$]/g,'').trim();
 return `:do { ${l} } on-error={ :put "dilewati (sudah ada): ${lab}" }`}
function hl(l){if(l.startsWith('# ====='))return `<span class="h">${esc(l)}</span>`;if(l.startsWith('#'))return `<span class="c">${esc(l)}</span>`;
 let pre='',post='',b=l;const m=/^(:do \{ )(.*)( \} on-error=.*)$/.exec(l);if(m){pre=`<span class="c">${esc(m[1])}</span>`;b=m[2];post=`<span class="c">${esc(m[3])}</span>`}
 const k=/^(\/[a-z0-9\- ]+?)( (?:add|set|disable|enable|remove) )(.*)$/.exec(b);
 return pre+(k?`<span class="p">${esc(k[1])}</span><span class="v">${esc(k[2])}</span>${esc(k[3])}`:esc(b))+post}
const PRESET={pppoe:['basic','pppoe','fw'],hotspot:['basic','hotspot','fw'],lb:['basic','lb','fw'],vlan:['basic','vlan','pppoe','fw']};

const G={
basic(s,o,w){const v7=S.ros=='7',W=s.wan_type=='pppoe'?'pppoe-out1':s.wan_if;
 o.push('/system identity set name='+q(s.identity),'/system clock set time-zone-name='+s.tz);
 o.push(v7?'/system ntp client set enabled=yes servers=pool.ntp.org':'/system ntp client set enabled=yes primary-ntp=162.159.200.1 secondary-ntp=162.159.200.123');
 const lbo=lbOwnsBasic();if(lbo&&S.cmt)o.push('# default route dan NAT WAN diatur modul Load Balance');
 if(s.wan_type=='dhcp')o.push(`/ip dhcp-client add interface=${nm(s.wan_if)} add-default-route=${lbo?'no':'yes'} use-peer-dns=no disabled=no comment=WAN`);
 else if(s.wan_type=='static'){const c=cidr(s.wan_ip);if(!c)w.push('Dasar: IP WAN harus format IP/CIDR');if(!isIP(s.wan_gw))w.push('Dasar: gateway WAN bukan IP valid');
  o.push(`/ip address add address=${s.wan_ip} interface=${nm(s.wan_if)} comment=WAN`);if(!lbo)o.push(`/ip route add dst-address=0.0.0.0/0 gateway=${s.wan_gw} comment=WAN`)}
 else{if(!s.pp_user)w.push('Dasar: user PPPoE ISP masih kosong');o.push(`/interface pppoe-client add name=pppoe-out1 interface=${nm(s.wan_if)} user=${q(s.pp_user)} password=${q(s.pp_pass)} add-default-route=yes use-peer-dns=no disabled=no comment=WAN`)}
 const br=nm(s.lan_br),c=cidr(s.lan_ip);
 o.push(`/interface bridge add name=${br} comment=LAN`);
 for(const p of list(s.lan_ports))o.push(`/interface bridge port add bridge=${br} interface=${nm(p)}`);
 if(!c){w.push('Dasar: IP LAN harus format IP/CIDR, misal 192.168.88.1/24');}
 else{o.push(`/ip address add address=${s.lan_ip} interface=${br} comment=LAN`);
  if(s.dhcp)o.push(`/ip pool add name=pool-lan ranges=${pool(c)}`,`/ip dhcp-server add name=dhcp-lan interface=${br} address-pool=pool-lan lease-time=1d disabled=no`,`/ip dhcp-server network add address=${c.netw} gateway=${c.ip} dns-server=${c.ip}`)}
 o.push(`/ip dns set servers=${list(s.dns).join(',')} allow-remote-requests=yes`);
 if(s.nat&&!lbo)o.push(`/ip firewall nat add chain=srcnat out-interface=${nm(W)} action=masquerade comment="NAT WAN"`);
 if(list(s.lan_ports).length)w.push('Dasar: jika port LAN sudah ada di bridge default, hapus dulu dari bridge lama')},
pppoe(s,o,w){const v7=S.ros=='7',pr=rows(s.profiles);
 if(!isIP(s.local))w.push('PPPoE: local address bukan IP valid');
 o.push(`/ip pool add name=pool-pppoe ranges=${s.ranges}`);
 for(const p of pr)o.push(`/ppp profile add name=${nm(p[0])} local-address=${s.local} remote-address=pool-pppoe dns-server=${list(s.dns).join(',')}${p[1]?' rate-limit='+p[1]:''} only-one=yes`);
 if(s.isolir)o.push(`/ip pool add name=pool-isolir ranges=${s.iso_ranges}`,`/ppp profile add name=ISOLIR local-address=${s.local} remote-address=pool-isolir dns-server=${s.local} address-list=ISOLIR rate-limit=256k/256k only-one=yes`);
 const dp=pr[0]?nm(pr[0][0]):'default';
 o.push(`/interface pppoe-server server add service-name=pppoe-rtrw interface=${nm(s.srv_if)} default-profile=${dp} authentication=pap,chap,mschap1,mschap2 one-session-per-host=yes max-mtu=${lim(s.mtu,576,1500)} max-mru=${lim(s.mtu,576,1500)} keepalive-timeout=30 disabled=no`);
 if(s.gen){const r=rng(S.seed),n=lim(s.count,1,1000),st=lim(s.start,0,1e6),dg=lim(s.digits,1,6);
  if(!pr.some(p=>p[0]==s.prof))w.push('PPPoE: profil akun "'+s.prof+'" tidak ada di daftar profil');
  if(S.cmt)o.push('# akun pelanggan');
  for(let i=0;i<n;i++){const u=s.prefix+String(st+i).padStart(dg,'0'),pw=s.pwmode=='same'?u:s.pwmode=='fixed'?s.pwfixed:code(r,8,CH.mix);
   X.pppoe.push([u,pw,s.prof]);o.push(`/ppp secret add name=${q(u)} password=${q(pw)} service=pppoe profile=${nm(s.prof)}`)}}
 if(s.isolir){const rd=/^(\S+):(\d+)$/.exec(s.iso_redir.trim());
  if(S.cmt)o.push('# isolir: pindahkan rule filter ini ke atas rule forward lain');
  o.push(`/ip firewall filter add chain=forward src-address-list=ISOLIR protocol=udp dst-port=53 action=accept comment="ISOLIR dns"`);
  if(rd){o.push(`/ip firewall filter add chain=forward src-address-list=ISOLIR dst-address=${rd[1]} action=accept comment="ISOLIR halaman"`,`/ip firewall nat add chain=dstnat src-address-list=ISOLIR protocol=tcp dst-port=80 action=dst-nat to-addresses=${rd[1]} to-ports=${rd[2]} comment="ISOLIR redirect"`)}
  else if(s.iso_redir.trim())w.push('PPPoE: redirect isolir harus format IP:port');
  o.push(`/ip firewall filter add chain=forward src-address-list=ISOLIR action=drop comment="ISOLIR drop"`)}},
hotspot(s,o,w){const c=cidr(s.ip);if(!c){w.push('Hotspot: IP harus format IP/CIDR');return}
 const I=nm(s.ifc),pr=rows(s.profiles);
 o.push(`/ip address add address=${s.ip} interface=${I} comment=HOTSPOT`,`/ip pool add name=pool-hs ranges=${pool(c)}`,
 `/ip dhcp-server add name=dhcp-hs interface=${I} address-pool=pool-hs lease-time=1h disabled=no`,`/ip dhcp-server network add address=${c.netw} gateway=${c.ip} dns-server=${c.ip}`,
 `/ip hotspot profile add name=hsprof-rtrw hotspot-address=${c.ip} dns-name=${q(s.dns_name)} login-by=http-chap,cookie`,
 `/ip hotspot add name=hotspot1 interface=${I} address-pool=pool-hs profile=hsprof-rtrw disabled=no`);
 for(const p of pr)o.push(`/ip hotspot user profile add name=${nm(p[0])}${p[1]?' rate-limit='+p[1]:''} shared-users=${lim(p[2]||1,1,100)} address-pool=pool-hs`);
 if(!pr.some(p=>p[0]==s.vprof))w.push('Hotspot: profil voucher "'+s.vprof+'" tidak ada di daftar profil');
 const r=rng(S.seed+7),n=lim(s.vcount,0,2000),L=lim(s.vlen,3,16),set=CH[s.charset]||CH.num,seen=new Set();
 if(n&&S.cmt)o.push('# voucher');
 for(let i=0;i<n;i++){let u;do u=s.vprefix+code(r,L,set);while(seen.has(u));seen.add(u);const pw=s.vmode=='same'?u:code(r,L,CH.num);X.hs.push([u,pw,s.vprof,s.uptime]);
  o.push(`/ip hotspot user add server=hotspot1 name=${q(u)} password=${q(pw)} profile=${nm(s.vprof)}${s.uptime?' limit-uptime='+s.uptime:''} comment=vc-${new Date().toISOString().slice(0,10)}`)}},
lb(s,o,w){const v7=S.ros=='7',ws=rows(s.wans);if(ws.length<2){w.push('Load balance: minimal 2 WAN');return}
 for(const x of ws)if(!isIP(x[1]||''))w.push('Load balance: gateway '+x[0]+' harus IP');
 const slots=[];ws.forEach((x,i)=>{for(let k=0;k<lim(x[2]||1,1,10);k++)slots.push(i)});const N=slots.length,T=i=>'to-'+ws[i][0],C=i=>ws[i][0]+'-conn';
 o.push('/interface list add name=WAN-LB');for(const x of ws)o.push(`/interface list member add list=WAN-LB interface=${nm(x[0])}`);
 for(const a of list(s.local))o.push(`/ip firewall address-list add list=LOKAL address=${a}`);
 if(v7)ws.forEach((x,i)=>o.push(`/routing table add name=${T(i)} fib`));
 ws.forEach((x,i)=>o.push(`/ip firewall mangle add chain=prerouting in-interface=${nm(x[0])} connection-mark=no-mark action=mark-connection new-connection-mark=${C(i)} passthrough=yes`));
 o.push('/ip firewall mangle add chain=prerouting in-interface-list=!WAN-LB dst-address-list=LOKAL action=accept comment="lokal tidak di-balance"');
 slots.forEach((wi,k)=>o.push(`/ip firewall mangle add chain=prerouting in-interface-list=!WAN-LB dst-address-type=!local connection-mark=no-mark per-connection-classifier=${s.cls}:${N}/${k} action=mark-connection new-connection-mark=${C(wi)} passthrough=yes`));
 ws.forEach((x,i)=>o.push(`/ip firewall mangle add chain=prerouting in-interface-list=!WAN-LB connection-mark=${C(i)} action=mark-routing new-routing-mark=${T(i)} passthrough=no`,`/ip firewall mangle add chain=output connection-mark=${C(i)} action=mark-routing new-routing-mark=${T(i)} passthrough=no`));
 ws.forEach((x,i)=>{o.push(`/ip route add dst-address=0.0.0.0/0 gateway=${x[1]} ${v7?'routing-table':'routing-mark'}=${T(i)} check-gateway=ping`);ws.forEach((y,j)=>{if(j!=i)o.push(`/ip route add dst-address=0.0.0.0/0 gateway=${y[1]} ${v7?'routing-table':'routing-mark'}=${T(i)} distance=2 check-gateway=ping comment="cadangan ${T(i)}"`)})});
 if(s.failover)ws.forEach((x,i)=>o.push(`/ip route add dst-address=0.0.0.0/0 gateway=${x[1]} distance=${i+1} check-gateway=ping comment="failover main"`));
 ws.forEach(x=>o.push(`/ip firewall nat add chain=srcnat out-interface=${nm(x[0])} action=masquerade comment="NAT ${x[0]}"`));
 if(S.basic.on&&S.basic.wan_type=='dhcp'&&lbOwnsBasic())w.push('Load balance: WAN '+S.basic.wan_if+' pakai DHCP, pastikan gateway yang diisi sama dengan gateway dari modem');
 if(S.basic.on&&S.basic.nat&&!lbOwnsBasic())w.push('Load balance: WAN modul Dasar ('+wanIf()+') tidak ada di daftar WAN load balance')},
fw(s,o,w){const v7=S.ros=='7',F='/ip firewall filter ';
 const wans=[...new Set([...(S.basic.on?[wanIf()]:[]),...lbWans(),...list(s.wan)])];
 if(!wans.length)w.push('Firewall: belum ada interface WAN');
 o.push('/interface list add name=WAN','/interface list add name=LAN');
 for(const x of wans)o.push(`/interface list member add list=WAN interface=${nm(x)}`);
 for(const x of list(s.lan))o.push(`/interface list member add list=LAN interface=${nm(x)}`);
 o.push(F+'add chain=input action=accept connection-state=established,related,untracked comment="input: koneksi lama"',
 F+'add chain=input action=drop connection-state=invalid',F+'add chain=input action=accept protocol=icmp comment="ping"');
 const mp=list(s.mgmt).filter(p=>/^\d+$/.test(p));if(mp.length)o.push(F+`add chain=input action=accept in-interface-list=WAN protocol=tcp dst-port=${mp.join(',')} comment="management dari WAN"`);
 if(s.dropdns)o.push(F+'add chain=input action=drop in-interface-list=WAN protocol=udp dst-port=53 comment="blok DNS dari WAN"',F+'add chain=input action=drop in-interface-list=WAN protocol=tcp dst-port=53');
 if(s.dropwan)o.push(F+'add chain=input action=drop in-interface-list=WAN comment="drop sisa input WAN"');
 if(s.fast)o.push(F+`add chain=forward action=fasttrack-connection connection-state=established,related${v7?' hw-offload=yes':''} comment=fasttrack`);
 o.push(F+'add chain=forward action=accept connection-state=established,related,untracked',F+'add chain=forward action=drop connection-state=invalid');
 if(s.fwd)o.push(F+'add chain=forward action=drop connection-state=new connection-nat-state=!dstnat in-interface-list=WAN comment="drop baru dari WAN"');
 if(s.svc)o.push('/ip service disable telnet,ftp,www,api,api-ssl');
 o.push(`/ip service set winbox port=${lim(s.winbox,1,65535)}`);
 if(s.mac)o.push('/ip neighbor discovery-settings set discover-interface-list=LAN','/tool mac-server set allowed-interface-list=LAN','/tool mac-server mac-winbox set allowed-interface-list=LAN');
 if(s.fast&&S.pppoe.on)w.push('Firewall: FastTrack aktif bersama PPPoE, rate-limit paket bisa tidak jalan');
 if(s.dropwan&&!mp.length)w.push('Firewall: akses dari WAN ditutup. Aktifkan Safe Mode di Winbox (Ctrl+X) sebelum menjalankan, agar perubahan dibatalkan otomatis jika koneksi Anda terputus')},
vlan(s,o,w){for(const x of rows(s.list)){const id=lim(x[0],1,4094),n=nm(x[1]||'vlan'+id),c=cidr(x[2]);
 o.push(`/interface vlan add name=${n} vlan-id=${id} interface=${nm(s.parent)}`);
 if(!c){w.push('VLAN '+id+': IP harus format IP/CIDR');continue}
 o.push(`/ip address add address=${x[2]} interface=${n}`);
 if(s.dhcp)o.push(`/ip pool add name=pool-${n} ranges=${pool(c)}`,`/ip dhcp-server add name=dhcp-${n} interface=${n} address-pool=pool-${n} lease-time=${s.lease} disabled=no`,`/ip dhcp-server network add address=${c.netw} gateway=${c.ip} dns-server=${c.ip}`)}},
queue(s,o,w){if(s.parent)o.push(`/queue simple add name=TOTAL target=${s.ptarget} max-limit=${s.plimit}`);
 for(const x of rows(s.list)){if(!x[1]){w.push('Queue '+x[0]+': target kosong');continue}
  o.push(`/queue simple add name=${q(x[0])} target=${x[1].includes('/')?x[1]:x[1]+'/32'} max-limit=${x[2]||'1M/1M'}${s.parent?' parent=TOTAL':''}`)}}
};

function renderTabs(){const cm=M.find(m=>m.id==S.tab);$('#curMod').textContent=cm.name;$('#onCount').textContent=M.filter(m=>S[m.id].on).length+' aktif';$('#tabs').innerHTML=M.map(m=>`<button role="tab" data-t="${m.id}" aria-selected="${S.tab==m.id}"><span class="dot${S[m.id].on?' on':''}"></span>${esc(m.name)}</button>`).join('');
 document.querySelectorAll('[data-ros]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ros==S.ros));$('#cmt').checked=S.cmt;$('#safe').checked=S.safe}
function renderForm(){const m=M.find(x=>x.id==S.tab),s=S[m.id];
 const fl=m.f.filter(f=>!f[5]||f[5](s)).map(([id,lab,t,d,o,h])=>{const fid=`f-${m.id}-${id}`,hint=typeof o=='string'&&o?`<span class="hint">${esc(o)}</span>`:'',v=s[id];
  if(t=='chk')return `<div class="f w"><label class="chk"><input type="checkbox" id="${fid}" data-k="${id}"${v?' checked':''}> ${esc(lab)}</label>${hint}</div>`;
  if(t=='sel')return `<div class="f"><label for="${fid}">${esc(lab)}</label><select id="${fid}" data-k="${id}">${o.map(x=>{const[a,b]=Array.isArray(x)?x:[x,x];return `<option value="${esc(a)}"${a==v?' selected':''}>${esc(b)}</option>`}).join('')}</select></div>`;
  if(t=='area')return `<div class="f w"><label for="${fid}">${esc(lab)}</label><textarea id="${fid}" data-k="${id}" spellcheck="false">${esc(v)}</textarea>${hint}</div>`;
  return `<div class="f"><label for="${fid}">${esc(lab)}</label><input type="${t=='num'?'number':'text'}" id="${fid}" data-k="${id}" value="${esc(v)}" spellcheck="false" autocapitalize="off">${hint}</div>`}).join('');
 const bt=[];if((m.id=='pppoe'&&s.gen&&s.pwmode=='random')||m.id=='hotspot')bt.push('<button class="btn" id="reseed">Acak ulang kode</button>');
 if(m.id=='pppoe'&&s.gen)bt.push('<button class="btn" data-csv="pppoe">Unduh daftar akun (.csv)</button>');
 if(m.id=='hotspot'&&+s.vcount>0)bt.push('<button class="btn" data-csv="hs">Unduh voucher (.csv)</button>','<button class="btn" id="print">Cetak kartu voucher</button>');
 bt.push('<button class="btn" id="reset">Kembalikan default</button>');
 $('#form').innerHTML=`<div class="mhead"><div><h2>${esc(m.name)}</h2><p>${esc(m.desc)}</p></div><label class="chk sw"><input type="checkbox" id="on"${s.on?' checked':''}> Sertakan</label></div><div class="grid">${fl}</div><div class="tools">${bt.join('')}</div>`}
let SECS=[];
const fname=()=>(S.basic.identity||'mikrotik').replace(/[^A-Za-z0-9_-]+/g,'-')+'-v'+S.ros+'.rsc';
const CPI='<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const lines=L=>L.map(l=>`<span class="ln">${hl(l)||' '}</span>`).join('');
function renderOut(){let o=[];const w=[];const on=M.filter(m=>S[m.id].on);X={pppoe:[],hs:[]};
 const head=S.cmt?[`# Skrip MikroTik RouterOS v${S.ros} — dibuat ${new Date().toLocaleString('id-ID')}`,`# Modul: ${on.map(m=>m.name).join(', ')||'-'}`]:[];
 SECS=on.map(m=>{const L=[];if(S.cmt)L.push(`# ===== ${m.name.toUpperCase()} =====`);G[m.id](S[m.id],L,w);return{name:m.name,lines:L.map(safe)}});
 o=[...head];SECS.forEach((s,i)=>{if(o.length&&S.cmt)o.push('');o.push(...s.lines)});
 if(!on.length)o.push('# Belum ada modul yang disertakan');
 const cnt=L=>L.filter(l=>l&&!l.startsWith('#')).length;
 $('#pre').innerHTML=(head.length||!on.length?`<pre class="info">${lines(on.length?head:o)}</pre>`:'')+SECS.map((s,i)=>`<section class="blk"><div class="sh"><div><b>${esc(s.name)}</b><span>${cnt(s.lines)} baris</span></div><button class="cp" data-i="${i}" aria-label="Salin bagian ${esc(s.name)}">${CPI}<span>Salin</span></button></div><pre>${lines(s.lines)}</pre></section>`).join('');
 const tot=cnt(o);if(tot>200)w.unshift(`Skrip ${tot} baris: terlalu panjang untuk ditempel di terminal. Pakai Unduh .rsc lalu import (lihat perintah di atas).`);
 $('#impcmd').textContent=`/import file-name=${fname()} verbose=yes`;
 $('#pre').dataset.txt=o.join('\n');$('#warn').innerHTML=w.map(x=>`<li>${esc(x)}</li>`).join('');
 const n=o.filter(l=>l&&!l.startsWith('#')).length;$('#meta').textContent=`${n} baris · v${S.ros}`;$('#fabn').textContent=n+' baris';
 const act=M.filter(m=>S[m.id].on).map(m=>m.id).join();
 document.querySelectorAll('[data-p]').forEach(b=>b.setAttribute('aria-pressed',M.map(m=>m.id).filter(id=>PRESET[b.dataset.p].includes(id)).join()==act));save()}

const drw=$('#drawer'),scr=$('#scrim'),mb=$('#menuBtn');
function menu(open){drw.classList.toggle('open',open);scr.hidden=!open;mb.setAttribute('aria-expanded',open);if(open)drw.querySelector('[aria-selected=true]')?.focus();else if(matchMedia('(max-width:900px)').matches)mb.focus()}
mb.addEventListener('click',()=>menu(!drw.classList.contains('open')));
$('#closeBtn').addEventListener('click',()=>menu(false));scr.addEventListener('click',()=>menu(false));
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&drw.classList.contains('open'))menu(false)});
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;S.tab=b.dataset.t;renderTabs();renderForm();save();if(drw.classList.contains('open')){menu(false);$('#form').scrollIntoView({block:'start'})}});
document.querySelectorAll('[data-ros]').forEach(b=>b.addEventListener('click',()=>{S.ros=b.dataset.ros;renderTabs();renderOut()}));
$('#cmt').addEventListener('change',e=>{S.cmt=e.target.checked;renderOut()});
$('#safe').addEventListener('change',e=>{S.safe=e.target.checked;renderOut()});
$('#presets').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;const p=PRESET[b.dataset.p];for(const m of M)S[m.id].on=p.includes(m.id);S.tab=p[1]||p[0];renderTabs();renderForm();renderOut()});
function dl(name,text,type){const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
const csv=r=>r.map(x=>x.map(v=>/[",;\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v).join(',')).join('\r\n');
function printVc(){const s=S.hotspot,d=esc(s.dns_name),same=s.vmode=='same';
 const cards=X.hs.map(([u,p,pr,up])=>`<div class="v"><div class="t"><b>${d}</b><span>${esc(s.price)}</span></div><div class="k">${same?'Kode':'User'}</div><div class="c">${esc(u)}</div>${same?'':`<div class="k">Password</div><div class="c s">${esc(p)}</div>`}<div class="f">${esc(pr)}${up?' · '+esc(up):''}</div></div>`).join('');
 const html=`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Voucher ${d}</title><style>body{margin:12px;font:13px Arial,sans-serif;color:#111}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.v{border:1px dashed #555;padding:8px;break-inside:avoid}.t{display:flex;justify-content:space-between;border-bottom:2px solid #e8251a;padding-bottom:4px;margin-bottom:6px}.k{font-size:10px;color:#555}.c{font:bold 20px 'Courier New',monospace;letter-spacing:2px}.c.s{font-size:15px}.f{margin-top:4px;font-size:11px;color:#333}@media print{body{margin:0}}</style></head><body><div class="g">${cards}</div><script>onload=()=>print()<\/script></body></html>`;
 const u=URL.createObjectURL(new Blob([html],{type:'text/html'})),a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}
const fm=$('#form');
fm.addEventListener('input',e=>{const t=e.target,s=S[S.tab];if(t.id=='on')return;if(!t.dataset.k)return;s[t.dataset.k]=t.type=='checkbox'?t.checked:t.value;renderOut()});
fm.addEventListener('change',e=>{const t=e.target;if(t.id=='on'){S[S.tab].on=t.checked;renderTabs();renderOut();return}if(t.tagName=='SELECT'||t.type=='checkbox'){const id=t.id;renderForm();document.getElementById(id)?.focus()}});
fm.addEventListener('click',e=>{const t=e.target;if(t.id=='reseed'){S.seed=(S.seed*7919+13)%1e9;renderOut()}
 if(t.dataset.csv=='pppoe')dl('akun-pppoe.csv',csv([['username','password','profil'],...X.pppoe]),'text/csv');
 if(t.dataset.csv=='hs')dl('voucher-hotspot.csv',csv([['username','password','profil','limit-uptime'],...X.hs]),'text/csv');
 if(t.id=='print')printVc();
 if(t.id=='reset'){const m=M.find(x=>x.id==S.tab),on=S[m.id].on;S[m.id]={on};for(const f of m.f)S[m.id][f[0]]=f[3];renderForm();renderOut()}});
async function clip(t){try{await navigator.clipboard.writeText(t);return}catch(e){}
 const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(x){}ta.remove()}
$('#copy').addEventListener('click',async()=>{const b=$('#copy');await clip($('#pre').dataset.txt);b.textContent='Tersalin';setTimeout(()=>b.textContent='Salin semua',1500)});
$('#pre').addEventListener('click',async e=>{const b=e.target.closest('.cp');if(!b)return;const s=SECS[+b.dataset.i];if(!s)return;await clip(s.lines.join('\n'));
 b.classList.add('ok');b.lastChild.textContent='Tersalin';setTimeout(()=>{b.classList.remove('ok');b.lastChild.textContent='Salin'},1500)});
$('#impcp').addEventListener('click',async e=>{const b=e.currentTarget;await clip($('#impcmd').textContent);b.classList.add('ok');b.lastChild.textContent='Tersalin';setTimeout(()=>{b.classList.remove('ok');b.lastChild.textContent='Salin'},1500)});
const wb=$('#wrap'),setWrap=()=>{$('#pre').classList.toggle('wrap',S.wrap);wb.setAttribute('aria-pressed',S.wrap)};
wb.addEventListener('click',()=>{S.wrap=!S.wrap;setWrap();save()});
$('#dl').addEventListener('click',()=>dl(fname(),$('#pre').dataset.txt.replace(/\n/g,'\r\n'),'text/plain'));
const fab=$('#fab'),fio=new IntersectionObserver(es=>{fab.hidden=es[0].isIntersecting});fio.observe($('#hasil'));
setWrap();renderTabs();renderForm();renderOut();
function $(s){return document.querySelector(s)}
}
