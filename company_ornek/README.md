# Company Database Aggregations Örnekleri

**Not:** Örnekler genel olarak kolaydan zora göre listelenmiştir.

**Not:** Veritabanına bu [linkten](https://github.com/ozlerhakan/mongodb-json-files/blob/master/datasets/companies.json) ulaşabilirsiniz.

## Örnek 1

phone_number'ı 925-924-9500 olan dökümanların name field'ını getir.

```js
Company.aggregate([
  { $match: { phone_number: "925-924-9500" } },
  { $project: { name: 1 } },
]).exec();
```

## Örnek 2

Herhangi bir gruplama olmadan bütün documentları bulan,
kuruluş yılları ort. bulan, ilk kurulan şirketi bulan ve son kurulan şirketi bulan kayıt.

**!** sum: 1 normalde toplam işlemidir. her record(document) için 1 toplayarak record sayısını bulur.

```js
Company.aggregate([
  {
    $group: {
      _id: null,
      totaldocs: { $sum: 1 },
      average_year: { $avg: "$founded_year" },
      min_year: { $min: "$founded_year" },
      max_year: { $max: "$founded_year" },
    },
  },
]).exec();
```

## ÖRNEK 3

Kuruluş yılı 1000 ile 2000 yılları arasında olan şirketlerin adını ve kuruluş yıllarını göster

```js
Company.aggregate([
  {
    $match: {
      founded_year: { $gt: 1000, $lt: 2000 },
    },
  },
  {
    $project: {
      name: 1,
      founded_year: 1,
    },
  },
]).exec();
```

## ÖRNEK 4

Kuruluş yılları 1000 ile 2000 arasında olan şirketlerin sayısını getir.

```js
Company.aggregate([
  {
    $match: {
      founded_year: { $gt: 1000, $lt: 2000 },
    },
  },
  {
    $group: {
      _id: null,
      totaldocs: { $sum: 1 },
    },
  },
]).exec();
```

## ÖRNEK 5

numarası 925-924-9500 olan şirketlerin her bir çalışanını ayrı record olarak bütün şirket kaydıyla beraber getir.

```js
Company.aggregate([
  { $match: { phone_number: "925-924-9500" } },
  { $unwind: "$relationships" },
]).exec();
```

ÖRNEK 6
b ismini barındıran çalışanların isimlerine göre (a'dan z'ye) sorting yapıp ilk 20 documenti göster.
**!** Mutlaka limit'ten önce sorting işlemi yapmalısınız.

```js
Company.aggregate([
  { $unwind: "$relationships" },
  { $match: { "relationships.person.first_name": { $in: [/.b/] } } },
  { $project: { relationships: 1, _id: 0, name: 1 } },
  { $sort: { "relationships.person.first_name": 1 } },
  { $limit: 20 },

  // ? Debugging Stage
  //// { $count: "Total records" },
]).exec();
```
