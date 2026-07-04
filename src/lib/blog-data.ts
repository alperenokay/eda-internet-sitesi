/** Statik blog içeriği (DB kapalı veya boşken yedek + varsayılan yayınlar). */

export interface BlogPostRecord {
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  category: string;
  keywords: string;
  publishedAt: string;
  updatedAt: string;
}

export const BLOG_DISCLAIMER =
  "Bu yazı genel bilgilendirme amaçlıdır; somut olayınıza ilişkin bağlayıcı hukuki görüş değildir.";

export const STATIC_BLOG_POSTS: BlogPostRecord[] = [
  {
    slug: "anlasmali-bosanma-sartlari",
    title: "Anlaşmalı Boşanma İçin Gerekli Şartlar",
    excerpt:
      "Anlaşmalı boşanmada protokol, mahkeme süreci ve tarafların üzerinde anlaşması gereken başlıklar.",
    category: "Medeni Hukuk",
    keywords: "anlaşmalı boşanma, boşanma protokolü, aile mahkemesi, İzmir avukat",
    publishedAt: "2026-03-12T10:00:00+03:00",
    updatedAt: "2026-03-12T10:00:00+03:00",
    bodyMd: `Anlaşmalı boşanma, eşlerin boşanma ve ferileri (nafaka, velayet, tazminat, mal paylaşımı) konusunda anlaşarak tek celsede karar aldıkları yoldur. 4721 sayılı Türk Medeni Kanunu (TMK) md. 166/3 bu imkânı düzenler.

## Hangi şartlar aranır?

- Evlilik en az bir yıl sürmüş olmalıdır.
- Eşler birlikte mahkemeye başvurmalı veya bir eşin davasını diğeri kabul etmelidir.
- Hakimin boşanmaya karar vermesi için tarafların **gerçek iradeleriyle** anlaştıkları kanaatine varması gerekir.
- Boşanma protokolü yazılı olmalı; velayet, kişisel ilişki, nafaka ve mal rejimine ilişkin düzenlemeler açıkça yazılmalıdır.

## Protokolde neler olmalı?

Pratikte protokolde şu başlıkların net olması uyuşmazlık riskini azaltır:

- Velayetin kime verileceği ve diğer eşin kişisel ilişki düzeni
- İştirak ve/veya yoksulluk nafakası (varsa tutar, ödeme şekli)
- Mal rejiminin tasfiyesi veya tarafların mal paylaşımına ilişkin anlaşma
- Maddi-manevi tazminat taleplerinin karşılıklı olarak kapsamı

Protokolde belirsiz bırakılan maddeler, boşanma sonrası icra veya yeni dava yolunu açabilir.

## Mahkeme süreci nasıl işler?

Dosya aile mahkemesinde görülür. Hakim, protokolü inceler; gerekirse tarafları ayrı ayrı dinleyerek irade serbestisinin etkilenmediğinden emin olur. Koşullar oluştuğunda boşanmaya karar verilir; gerekli hallerde nafaka ve velayet hükümleri karar metninde ayrıca yer alır.

## Anlaşmalı boşanma ne kadar sürer?

Dosyanın hazırlığı ve mahkeme takvimine bağlıdır; çekişmeli boşanmaya kıyasla genellikle daha kısa bir yargılama süreci söz konusudur. Eksik evrak veya protokoldeki boşluklar süreyi uzatabilir.

## Sık yapılan hatalar

- Mal paylaşımını "sonra hallederiz" diyerek protokole hiç girmemek
- Nafaka ve velayet maddelerini tek cümleyle geçiştirmek
- Protokolü mahkeme dosyasına uygun formatta sunmamak

Somut durumunuzda protokol taslağı ve dava dilekçesinin birlikte değerlendirilmesi, sonradan doğabilecek hak kayıplarını önlemeye yardımcı olur.`,
  },
  {
    slug: "cekismeli-bosanma-sureci",
    title: "Çekişmeli Boşanma Davasında Temel Aşamalar",
    excerpt:
      "Boşanma sebepleri, dilekçe aşaması, delil sunumu ve aile mahkemesinde izlenen yol.",
    category: "Medeni Hukuk",
    keywords: "çekişmeli boşanma, boşanma sebepleri, aile mahkemesi, TMK",
    publishedAt: "2026-02-20T10:00:00+03:00",
    updatedAt: "2026-02-20T10:00:00+03:00",
    bodyMd: `Çekişmeli boşanmada taraflardan biri, evlilik birliğinin temelden sarsıldığını veya kanunda sayılan özel sebepleri ileri sürerek dava açar. Süreç, anlaşmalı boşanmaya göre daha uzun ve delile dayalı ilerler.

## Boşanma sebepleri

TMK'da zina, hayata kast, pek kötü muamele, onur kırıcı davranış, suç işleme ve haysiyetsiz hayat sürme, terk ve akıl hastalığı gibi özel sebepler düzenlenmiştir. En sık başvurulan genel sebep ise evlilik birliğinin temelden sarsılmasıdır (TMK md. 166/1-2). Her sebebin ispat yükü ve delil türü farklıdır.

## Dava açılırken

Dava dilekçesinde boşanma sebebi somut olaylarla anlatılmalı; nafaka, velayet, tazminat ve mal rejimi talepleri açıkça yazılmalıdır. Dilekçede talep edilmeyen haklar, sonradan genişletme prosedürüne tabi olabilir.

## Yargılama aşamaları

6100 sayılı Hukuk Muhakemeleri Kanunu (HMK) hükümleri uyarınca kısaca:

1. **Dilekçeler aşaması:** Dava, cevap ve varsa cevaba cevap dilekçeleri
2. **Ön inceleme:** Uyuşmazlık konularının tespiti, sulh imkânı
3. **Tahkikat:** Tanık, bilirkişi, belge incelemesi
4. **Sözlü yargılama ve karar**

Aile mahkemesi, çocuğun üstün yararını gözeterek velayet ve kişisel ilişki düzenlemesinde re'sen de inceleme yapabilir.

## Tedbir nafakası ve geçici önlemler

Dava süresince ekonomik zorluk yaşayan taraf, tedbir nafakası talep edebilir. Konut, eşya veya çocukla ilgili geçici düzenlemeler de aynı çerçevede gündeme gelebilir.

## Delil konusunda dikkat

WhatsApp yazışmaları, ses kayıtları ve sosyal medya içerikleri, elde ediliş şekline göre hukuka aykırı delil sayılabilir. Delilin usulüne uygun sunulması, davanın seyrini doğrudan etkiler.

Çekişmeli boşanmada erken dönemde taleplerin netleştirilmesi ve delil planının yapılması, yargılama boyunca stratejik avantaj sağlar.`,
  },
  {
    slug: "ceza-yargilamasinda-savunma-haklari",
    title: "Ceza Yargılamasında Savunma Hakları",
    excerpt:
      "Şüpheli ve sanık sıfatıyla CMK kapsamındaki temel haklar, müdafi seçimi ve ifade alma.",
    category: "Ceza Hukuku",
    keywords: "ceza yargılaması, savunma hakkı, müdafi, CMK, ceza avukatı İzmir",
    publishedAt: "2026-01-15T10:00:00+03:00",
    updatedAt: "2026-01-15T10:00:00+03:00",
    bodyMd: `Ceza muhakemesinde devletin soruşturma gücü ile bireyin özgürlüğünü koruma arasında denge kurulur. 5271 sayılı Ceza Muhakemesi Kanunu (CMK), şüpheli ve sanığa tanınan hakları ayrıntılı biçimde düzenler.

## Şüpheli ve sanık kimdir?

Soruşturma evresinde şüpheli; kovuşturma başladığında sanık sıfatı kazanılır. Her iki aşamada da susma hakkı, müdafi yardımından yararlanma hakkı ve lehe delil toplama imkânı esastır.

## Müdafi (savunman) hakları

- Şüpheli veya sanık, soruşturma evresinden itibaren bir müdafi seçebilir.
- Bazı suç tiplerinde müdafi bulundurulması zorunludur.
- Müdafi; ifade alma, gözaltı, arama, elkoyma ve duruşmalarda hazır bulunabilir.
- Dosyaya erişim ve delil inceleme imkânları, savunmanın etkinliği için kritiktir.

## İfade alma ve gözaltı

Gözaltı süreleri kanuni sınırlara tabidir. Şüpheliye, hakları ve suçlamanın niteliği anlaşılır bir dille bildirilmelidir. İfadenin baskı altında alınması, sonraki aşamalarda delil değerlendirmesini zorlaştırabilir.

## Tutukluluk ve adli kontrol

Tutuklama, ölçülülük ilkesine uygun olmalı; somut delil ve kaçma-karakter bozma gerekçeleri somut olayla bağlantılı gösterilmelidir. Adli kontrol tedbirleri, tutuklamaya alternatif olarak değerlendirilebilir.

## Soruşturma sonrası

İddianame düzenlenmesiyle kovuşturma aşamasına geçilir. Sanık, duruşmalarda savunmasını sözlü veya yazılı yapabilir; tanık dinletme ve bilirkişi incelemesi talep edebilir.

Ceza dosyasında erken aşamada müdafi ile hareket etmek, ifade stratejisi ve delil toplama açısından önem taşır. Her dosyanın delil yapısı farklı olduğundan genel bilgi, somut dosya yerine geçmez.`,
  },
  {
    slug: "limited-sirket-kurulusu-adimlari",
    title: "Limited Şirket Kuruluşunda İzlenecek Adımlar",
    excerpt:
      "Anonim ve limited şirket kuruluşunda ana sözleşme, sermaye, ticaret sicili ve yasal yükümlülükler.",
    category: "Ticaret ve Şirketler Hukuku",
    keywords: "limited şirket kuruluşu, şirket kurma, ticaret sicili, TTK, İzmir avukat",
    publishedAt: "2025-12-08T10:00:00+03:00",
    updatedAt: "2025-12-08T10:00:00+03:00",
    bodyMd: `Limited şirket (LTD), ortak sayısı ve sermaye yapısı bakımından küçük ve orta ölçekli girişimlerde sık tercih edilen şirket türüdür. 6102 sayılı Türk Ticaret Kanunu (TTK) hükümleri çerçevesinde kurulur.

## Kuruluş öncesi planlama

- Ortakların kimler olacağı ve pay oranları
- Şirket unvanı (Ticaret Sicili Müdürlüğünde benzerlik kontrolü)
- Faaliyet konusu (NACE kodu)
- Sermaye miktarı (asgari sermaye TTK ve ilgili düzenlemelere tabidir)
- Yönetim ve temsil yetkisinin kimde olacağı

## Ana sözleşme ve sermaye

Ana sözleşme noter onaylı düzenlenir. Sermayenin en az dörtte biri tescilden önce, kalan kısmı tescili izleyen yirmi dört ay içinde ödenir. Nakdi sermaye banka blokajı ve ayni sermaye değerlemesi gibi teknik adımlar, sermaye türüne göre değişir.

## Ticaret siciline tescil

Noter onaylı belgeler ve kuruluş bildirimi ile birlikte ticaret siciline başvurulur. Tescil ile şirket tüzel kişilik kazanır. Tescil ilanı ve vergi dairesi işlemleri kuruluş sonrası takip gerektirir.

## Kuruluş sonrası yükümlülükler

- Defter tutma ve muhasebe düzeni
- Genel kurul ve yönetim kurulu kararlarının usulüne uygun alınması
- Sözleşmelerde şirketi temsil yetkisine dikkat edilmesi
- İşçi istihdamında iş hukuku ve SGK yükümlülükleri

## Ortaklık uyuşmazlıkları

Pay devri, ortak çıkarma, yönetimden azil ve kâr dağıtımı ana sözleşme ve TTK hükümlerine tabidir. Kuruluş aşamasında pay devri kısıtları ve oy haklarının net yazılması, ileride doğabilecek ortaklık uyuşmazlıklarını sınırlayabilir.

Şirket kuruluşu yalnızca sicil tescili değil; devam eden uyum yükümlülüklerini de beraberinde getirir. Faaliyet alanına göre ek izin veya bildirimler ayrıca kontrol edilmelidir.`,
  },
  {
    slug: "idari-isleme-karsi-dava-suresi",
    title: "İdari İşleme Karşı Dava Açma Süresi",
    excerpt:
      "İptal ve tam yargı davalarında süreler, tebliğ, uzlaşma ve İdare Mahkemesine başvuru.",
    category: "Vergi ve İdare Hukuku",
    keywords: "idari dava, iptal davası, dava açma süresi, İYUK, idare hukuku",
    publishedAt: "2025-11-22T10:00:00+03:00",
    updatedAt: "2025-11-22T10:00:00+03:00",
    bodyMd: `İdari işlemlere karşı yargı yolu, 2577 sayılı İdari Yargılama Usulü Kanunu (İYUK) ile düzenlenir. Sürelerin kaçırılması, hak düşürücü sonuç doğurabilir; bu nedenle tebliğ tarihi ve işlem türü birlikte değerlendirilmelidir.

## İptal davası süresi

Genel kural olarak, yazılı bildirimin yapıldığı tarihten itibaren **altmış gün** içinde İdare Mahkemesinde iptal davası açılır. Bildirim yapılmayan işlemlerde, öğrenme tarihinden itibaren bir yıl ve her hâlde işlemin yapıldığı tarihten itibaren beş yıl içinde dava açılabilir (İYUK md. 7).

## Tam yargı (tazminat) davaları

İdari eylem ve işlemlerden doğan zararların tazmini için tam yargı davası açılır. Zararın öğrenilmesinden itibaren bir yıl, her hâlde zarar doğuran olaydan itibaren beş yıl içinde dava açılmalıdır (İYUK md. 10).

## Uzlaşma ve zorunlu başvuru yolları

Vergi uyuşmazlıklarında uzlaşma, bazı idari yargı yollarında idari başvuru gibi **ön koşul** niteliğindeki merciler bulunabilir. Doğrudan dava açılması, usulden reddedilebilir. İşlemin hangi kanuna tabi olduğu dosya bazında tespit edilmelidir.

## Yürütmenin durdurulması

İptal davalarında, idari işlemin uygulanması telafisi güç zararlara yol açacaksa yürütmenin durdurulması talep edilebilir. Mahkeme, somut koşulları değerlendirerek karar verir.

## Sık yapılan hatalar

- Tebliğ tarihini yanlış hesaplamak
- Zorunlu idari başvuru aşamasını atlamak
- İşlemin türünü (düzenleyici / bireysel) yanlış nitelendirip yanlış süre uygulamak

İdari yargıda süre hesabı, işlemin niteliği ve tebliğ belgesi ile birlikte yapılmalıdır. Erken değerlendirme, hak düşürücü süre riskini azaltır.`,
  },
  {
    slug: "miras-paylasiminda-sakli-pay",
    title: "Miras Paylaşımında Saklı Pay Nedir?",
    excerpt:
      "Yasal mirasçıların saklı pay oranları, tenkis davası ve vasiyetname sınırları.",
    category: "Medeni Hukuk",
    keywords: "miras hukuku, saklı pay, tenkis davası, vasiyetname, TMK",
    publishedAt: "2025-10-05T10:00:00+03:00",
    updatedAt: "2025-10-05T10:00:00+03:00",
    bodyMd: `Miras bırakan, ölümünden sonra malvarlığının bir kısmını yasal mirasçılara, bir kısmını ise vasiyet veya bağış yoluyla devredebilir. Saklı pay, belirli yasal mirasçıların asgari haklarını koruyan TMK düzenlemesidir.

## Saklı paylı mirasçılar

TMK md. 506 ve devamı hükümlerine göre altsoy, ana-baba ve eşin saklı pay hakları vardır. Sağ kalan eşin oranı, mirasçılarla birlikte kimlerin kaldığına göre değişir.

## Saklı pay oranları (özet)

Oranlar, miras bırakanın terekesinin belirli bir kesirine karşılık gelir; hesaplama somut mirasçı yapısına göre yapılır. Altsoy için yasal miras payının yarısı, ana-baba için dörtte biri, sağ kalan eş için ise birlikte miras kaldığı mirasçılara göre değişen oranlar söz konusudur.

## Tenkis davası

Miras bırakan, saklı payı zedeleyecek ölüme bağlı tasarruflarda bulunmuşsa (aşırı vasiyet, bağış vb.), saklı paylı mirasçılar tenkis davası açarak haklarının iadesini isteyebilir (TMK md. 560 vd.).

## Mirasçılık belgesi ve paylaşım

Terekenin tespiti, mirasçılık belgesi (veraset ilamı) ve malvarlığının envanteri paylaşım sürecinin temel adımlarıdır. Taşınmaz ve hesaplar üzerinde şerh ve devir işlemleri, mirasın intikaline bağlıdır.

## Uyuşmazlık kaynakları

- Vasiyetnamenin geçerliliği
- bağışların tenkis kapsamında değerlendirilmesi
- muris muvazaası iddiası
- mirasçılar arasında pay anlaşmazlığı

Miras paylaşımında erken dönemde tereke envanteri çıkarılması ve saklı pay hesabının yapılması, tenkis veya iade taleplerinin sağlıklı değerlendirilmesine yardımcı olur.`,
  },
];
