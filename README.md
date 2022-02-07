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

### Aggregation Örnekleri

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
