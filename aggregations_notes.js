/**
 * *AGGREGATION NOTLARI*
 */

/**
 * *AGGREGATION NİÇİN YAPILIR*
 */

/**
 * *AGGREGATION BEST PRACTICES*
 * ! Her stage arasını boşluk bırakarak yazın ve stagelerin başına comment "//"
 * ! kullanın çünkü stage'lerin karışması muhtemeldir.
 * ! Her stage ayrı bir aggregate kullanılarak yazılabilir dolayısıyla
 * ! debugging için o stage'i boş bir aggregation'da çalıştırabiliriz.
 */

/**
 * *AGGREGATE YAZARKEN YAPILACAK ADIMLAR*
 *

 */

/**
 * *AGGREGATION STAGELER*
 *
 * Başlangıç:
 * @match filtreleme yapar. sqldeki where sorgusuna denktir.
 * @project
 * @group SQL sorgusunda GROUP BY işlevinin yapıldığı stage'dir.
 * @lookup
 * @unwind
 * @sort
 * @limit result'taki max document sayısını belirler.
 * @counts
 *
 * @match filtreleme yapar. sqldeki where sorgusuna denktir.
 * {$match: {<query>}}
 * !query find sorgusu ile eşdeğerdir.
 *
 * ?<query> için:
 * ? field için:
 * $eq => örn: { $match: {"name" : "ahmet"}}
 * $lt $gt $lte $gte  => örn: { $match: {"qty" : { $gt: 5 } } }
 * bir başka örn: { $match: { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } }
 * in(string veya number içerisinde var mı diye kontrol eder) => örn: {$match: {"name" : {$in: ["ahmet","mehmet"]}}}
 * (array içerisinde yazılır ve belirtilen stringlerden herhangi biri var mı diye kontrol edilir.)
 * $in'e benzer bir başka kullanım da $all'dur. In'de içerisinde bunlardan herhangi biri var mı diye bakarız.
 * All da ise bunların tamamı var mı diye bakarız yoksa kabul etmeyiz.
 * Bir nevi; in => or dur, all => and dir.
 * ! ayrıca string filtrelemede örneğin in kullanırken içerisinde a
 * ! barındıran isimleri getir diye mesela regex kullanabiliriz.
 *
 * ? birden çok field için:
 * örn: { $match: {"qty" : { $gt: 5 }, "name": "ahmet" }} böyle bir kullanım mevcuttur.
 *
 * ? nested field(object içinde field) için:
 * iki kullanım mevcuttur:
 * örn-1: { $match: { "address.city" : "bitlis" }}
 * örn-2: { $match: { "address" : { "city": "bitlis" }}}
 * ? Array içinde field için
 * iki kullanım mevcuttur:
 * örn-1: { $match: {"credit_cards" : { "$number": "2333-2333-2333-2333" }}}
 * örn-2: { $match: {"credit_cards.$number": "2333-2333-2333-2333" }}
 * Array içinde böyle bir field var mı kontrolü => { $match: { contribs: "UNIX" }} Contribs arrayinde UNIX field'ı var mı?
 * Array içinde bu fieldlardan herhangi biri var mı kontrolü => {$match { contribs: { $in: [ "ALGOL", "Lisp" ]} }}
 * Array içinde bu fieldların tamamı var mı kontrolü => {$match { contribs: { $all: [ "ALGOL", "Lisp" ] } }}
 * Array in size'ının (kaç elemanlı olduğunun) kontrolü => {$match { contribs: { $size: 4 } }}
 * Array içindeki objelerin elemanlarını AND operatörü ile filtreleme($elemMatch) =>
 * {$match { awards: { $elemMatch: { award: "Turing Award", year: { $gt: 1980 } } } }}
 *
 * ? Match için dökümantasyonlar:
 * https://docs.mongodb.com/manual/reference/method/db.collection.find/
 *
 * @project
 *
 * @group SQL sorgusunda GROUP BY işlevinin yapıldığı stage'dir.
 *
 * @lookup
 *
 * @unwind
 *
 * @sort
 *
 * @limit result'taki max document sayısını belirler.
 * {$limit: 20}
 * !burada önemli olan husus aggregation da result bir arraydir
 * !ve o array içerisinde o arrayin 20 elemanlı olması gerektiğini söylediğimizdir. Yanlış bir anlaşılma olmasın.
 */

/**
 * ! Map ve reduce kullanılmamaktadır yerine yine artık aggregation kullanıyoruz.
 */
