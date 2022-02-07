# MongoDB & Mongoose Dökümantasyon

![](https://www.cloudsavvyit.com/p/uploads/2021/07/f5932bc2.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1)

Mongodb üzerinde geliştirme yapmak isteyenler için türkçe dökümantasyon.

**Önemli Notlar**

- Bazı yerleri direkt copy-paste aldım zamanım oldukça çevireceğim.
- Buradaki notlar 0'dan hiçbir şey anlatmamaktadır. Ders notu gibi bir dökümantasyon çıkartmaya çalıştım. Mongodb ve aggregation kullanmayan herhangi bir kimse notları okuyarak pek bir şey kazanamayabilir.

## 🎀 İçindekiler

- [Aggregation]()

  - [Aggregation Niçin Yapılır?]()
  - [Aggregation Stageler]()
  - [Stage Nedir?]()
  - [$match]()
  - [$project]()
  - [$addFields]()
  - [$group]()
  - [$lookup]()
  - [$unwind]()
  - [$sort]()
  - [$limit]()
  - [$count]()
  - [$merge]()
  - [$out]()
  - [$skip]()
  - [$replaceRoot]()
  - [Aggregation Örnekleri]()
    - [Kurulum]()
    - [Company Database]()
  - [Aggregation Best Practices]()
  - [Aggregation Yazarken Yapılacak Adımlar]()
  - [Aggregation SQL ile Benzerlikleri]()
  - [Yardımcı Kaynaklar]()
  - [Teşekkür]()

### Aggregation Niçin Yapılır?

- Real-time analytics
- Report generation with roll-ups, sums & averages
- Real-time dashboards
- Redacting data to present via views
- Joining data together from different collections on the "server-side"
- Data science, including data discovery and data wrangling
- Mass data analysis at scale (a la "big data")
- Real-time queries where deeper "server-side" data post-processing is required than provided by the MongoDB Query Language (MQL)
- Copying and transforming subsets of data from one collection to another
- Navigating relationships between records, looking for patterns
- Data masking to obfuscate sensitive data
- Performing the Transform (T) part of an Extract-Load-Transform (ELT) workload
- Data quality reporting and cleansing
- Updating a materialised view with the results of the most recent source data changes
- Representing data ready to be exposed via SQL/ODBC/JDBC (using MongoDB's BI Connector)
- Supporting machine learning frameworks for efficient data analysis (e.g. via MongoDB's Spark Connector)
- ...and many more

### Aggregation Stageler

Bütün Stageler dökümantasyon: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/

**$match** filtreleme yapar. sqldeki where sorgusuna denktir. (Filter)

**$project** spesific olarak istediğimiz fieldları getirmeye yarar. (Projection)

**$addFields** dökümana yeni fieldlar eklemeye veya var olanı değiştirmeye yarar. update gibi (Update)

**$group** SQL sorgusunda GROUP BY işlevinin yapıldığı stage'dir.

**$lookup** (join)

**$unwind**

**$sort** belirlenen field veya fieldlarda sıralama işlemi yapar.

**$limit** result'taki max document sayısını belirler.

**$count** adı üstünde gösterilen dökümanları sayar.,

**$merge** Writes the results of the aggregation pipeline to a specified collection. The $merge operator must be the last stage in the pipeline. Mongo 4.2

**$out** merge işleminin daha basit halidir Mongo 2.6 sürümünden sonra kullanılabilir.

**$skip** belirtilen miktar kadar resulttaki document'ı atlar

**$replaceRoot** resultı specify edilen şekilde değiştirir. Burada önemli olan kısım veritabanı dökümanını değil aggregation ile dönen dökümanı değiştirdiğidir.

#### Match

$match filtreleme yapar. sqldeki where sorgusuna denktir.

```js
{$match: {<query>}}
```

**!** query find sorgusu ile eşdeğerdir.

`<query>`

basit bir field için `<query>`:

- $eq

  - field o değere eş mi buna bakar.
  - ```js
    { "$match": { "name": "ahmet" } }
    ```

- $lt $gt $lte $gte
  - büyüktür küçüktür karşılaştırması yapmak için.
  - örn-1:
    ```js
    { "$match": { "qty": { "$gt": 5 } } }
    ```
  - örn-2:
    ```js
    { $match: { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } }
    ```
- $in ve $all

  - string veya number içerisinde var mı diye kontrol eder
  - array içerisinde yazılır ve belirtilen stringlerden herhangi biri var mı diye kontrol edilir.
  - örn:
    ```js
    { "$match": { "name": { "$in": ["ahmet", "mehmet"] } } }
    ```
  - $in'e benzer bir başka kullanım da $all'dur. In'de içerisinde bunlardan herhangi biri var mı diye bakarız. All da ise bunların tamamı var mı diye bakarız yoksa kabul etmeyiz.
  - **!** Bir nevi; in => or dur, all => and dir.
  - Ayrıca string filtrelemede örneğin in kullanırken içerisinde a barındıran isimleri getir diye mesela regex kullanabiliriz.

birden çok field için `<query>`:

- örn:
  ```js
  { "$match": { "qty": { "$gt": 5 }, "name": "ahmet" } }
  ```
  böyle bir kullanım mevcuttur.

nested field(object içinde field , embedded document) için `<query>`:

- iki kullanım mevcuttur:
  ```js
  // Örnek 1
  { $match: { "address.city" : "bitlis" }}
  // Örnek 2
  { $match: { "address" : { "city": "bitlis" }}}
  ```

Array içinde field için `<query>`:

- iki kullanım mevcuttur:

  ```js
  // Örnek 1
  { $match: {"credit_cards" : { "$number": "2333-2333-2333-2333" }}}
  // Örnek 2
  { $match: {"credit_cards.$number": "2333-2333-2333-2333" }}
  ```

- Array içinde böyle bir field var mı kontrolü
  ```js
  { "$match": { "contribs": "UNIX" } } // Contribs arrayinde UNIX field'ı var mı?
  ```
- Array içinde bu fieldlardan herhangi biri var mı kontrolü

  ```js
  {$match { contribs: { $in: [ "ALGOL", "Lisp" ]} }}
  ```

- Array içinde bu fieldların tamamı var mı kontrolü

  ```js
  {$match { contribs: { $all: [ "ALGOL", "Lisp" ] } }}
  ```

- Array in size'ının (kaç elemanlı olduğunun) kontrolü
  ```js
  {$match { contribs: { $size: 4 } }}
  ```
- Array içindeki objelerin elemanlarını AND operatörü ile filtreleme($elemMatch)
  ```js
  {$match { awards: { $elemMatch: { award: "Turing Award", year: { $gt: 1980 } } } }}
  ```

Match için dökümantasyonlar:

- https://docs.mongodb.com/manual/reference/method/db.collection.find/ (Kapsamlı <query> için)
- https://www.tutorialspoint.com/mongodb/mongodb_query_document.htm (Bast <query> için)
- https://docs.mongodb.com/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match

#### Project

spesific olarak istediğimiz fieldları getirmeye yarar.

```js
{ $project: { "<field1>": 0, "<field2>": 0, ... } } // Return all but the specified fields
```

Örnek:

```js
{$project:{
    \_id: 0, 'name.last': 1, contribs: { $slice: 2 } } } // Contribs arrayinden ilk 2 fieldı ve name embedded dökümanından (obje içi obje nested document yani) last field'ını döner.
```

_!_ concating (Eklenecek.)

### Aggregation Örnekleri

- [Company Database]()

#### 👨‍💻 Kurulum

**!** Bu repostory'de; mongodb'ye node.js(Mongoose Framework) ile bağlantı sağlanmıştır. Bütün işlemler çok benzerdir isterseniz kodlara erişip kendiniz mongo işlemlerini düzenleyip mongodb bash aracılığıyla da kullanabilirsiniz.

**!** Bu kurulum için mongodb bağlantısı, npm ve node.js'e ihtiyacınız vardır.

Clone repository

```bash
$ git clone https://github.com/femresirvan/MongoDB-Dokumantasyon.git
$ cd MongoDB-Dokumantasyon
```

Npm paketleri kurulumu

```bash
$ npm i
```

```js
➥ ~./app.js

mongoose.connect("mongodb://localhost:27017/samples");
// Bu alanı kendi mongodb conn stringiniz ile değiştirin.

```

### Aggregation Best Practices

- Her stage arasını boşluk bırakarak yazın ve stagelerin başına comment "//" kullanın çünkü stage'lerin karışması muhtemeldir.
- Her stage ayrı bir aggregate kullanılarak yazılabilir dolayısıyla debugging için o stage'i boş bir aggregation'da çalıştırabiliriz.
  <!-- TODO -->
  <!-- - Large datasetler için mapReduce kullanılmaktadır. Artık Map ve reduce kullanılmamaktadır yerine yine aggregation kullanıyoruz.  -->

### Aggregation SQL ile Benzerlikleri

|          SQL          | AGGREGATION |
| :-------------------: | :---------: |
|         WHERE         |   $match    |
|       GROUP BY        |   $group    |
|        HAVING         |   $match    |
|        SELECT         |  $project   |
|         LIMIT         |   $limit    |
|         sum()         |    $sum     |
|        count()        |  $sum : 1   |
|         join          |   $lookup   |
| select into new table |    $out     |
|   merge into table    |   $merge    |
|       union all       | $unionWith  |

### Yardımcı Kaynaklar

[Mongodb Aggregation Docs](https://www.practical-mongodb-aggregations.com/who-this-is-for.html)

## Teşekkür
