# Sample_Analytics Database Örnekler

**Not:** Örnekler genel olarak kolaydan zora göre listelenmiştir.

**Not:** Veritabanına bu [linkten](https://github.com/neelabalan/mongodb-sample-dataset) ulaşabilirsiniz.

**Not:** Veritabanı ile ilgili detaylı bilgi için bu [linke](https://docs.atlas.mongodb.com/sample-data/sample-analytics/#std-label-sample-analytics) tıklayabilirsiniz.

## ÖRNEK 1

Bütün collectionları join ederek($lookup) spesific bir kullanıcının verisini bastırma.

**!** Customers'da hali hazırda accounts adında bir array vardı. 2. lookup'ta bu array'in üzerine join edilen accounts document'ı yazıldı. (Yani customers'daki string olarak account_id'leri içeren bölge silindi).

```js
db.customers.aggregate([
  { $limit: 1 },
  //spesific kullanıcı için match kullanınız.
  {
    $lookup: {
      from: "transactions",
      localField: "accounts",
      foreignField: "account_id",
      as: "transactions",
    },
  },
  {
    $lookup: {
      from: "accounts",
      localField: "accounts",
      foreignField: "account_id",
      as: "accounts",
    },
  },
]);
```

## ÖRNEK 2

**!** Array içerisinde match yapmak için;

https://stackoverflow.com/questions/15117030/how-to-filter-array-in-subdocument-with-mongodb

https://stackoverflow.com/questions/62205453/filtering-deeply-nested-array-of-objects-in-mongo-db

```js
db.customers.aggregate([
  { $limit: 1 },
  // transactions join işlemi
  {
    $lookup: {
      from: "transactions",
      localField: "accounts",
      foreignField: "account_id",
      as: "all_transactions",
    },
  },
  // accounts join işlemi
  {
    $lookup: {
      from: "accounts",
      localField: "accounts",
      foreignField: "account_id",
      as: "accounts",
    },
  },
  // output çok karmaşık olduğu için küçük bir düzenleme yapıyoruz. İlk olarak match'imizi yapalım. Böylelikle hiç buy olmayan arrayler diğer stage'lere geçemeyecek.
  { $match: { "all_transactions.transactions.transaction_code": "buy" } },
  // all_transactions arrayini unwind eden stage.
  { $unwind: "$all_transactions" },
  //Artık transactions ları buy filtreleyebiliriz. Bunun için de addFields'dan yardım alıp üzerine yazıyoruz.
  {
    $addFields: {
      "all_transactions.transactions": {
        $filter: {
          input: "$all_transactions.transactions",
          cond: { $eq: ["$$this.transaction_code", "buy"] },
        },
      },
    },
  },
  //boş array varsa silme.
  { $match: { "all_transactions.transaction": { $ne: [] } } },
  //group ile tek dökümanda toplama.
  { $group: { _id: "$_id", user: { $push: "$$ROOT" } } },
]);
```
