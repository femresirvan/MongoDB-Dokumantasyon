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
  {
    $group: {
      //id içerisinde profil bilgileri var.
      _id: {
        _id: "$_id",
        username: "$username",
        name: "$name",
        address: "$address",
        birthdate: "$birthdate",
        email: "$email",
        accounts: "$accounts",
        tier_and_details: "$tier_and_details",
      },
      //transactions da farklı olduğu için push ediyoruz.
      //all transactions unwind yapıldığı için _id'si eş olmayan array elemanlarına dönüşmüştü. Bu yüzden birbirinin aynısı elemanı olmadığından direkt push atıyoruz.
      //Daha temiz yazım için _id içerisinde obje almak yerini herbirini parametre alıp $first ile kullanabilirisniz alt örnekte onu da yaptım.
      transaction_details: { $push: "$all_transactions" },
    },
  },
]);
```

## ÖRNEK 3

En düşük miktarda yapılan transaction spesific id için.

```js
db.transactions.aggregate([
  //addField ile de olabilir ben unwind ile yapıp sonradan groupladım.
  { $unwind: "$transactions" },

  { $match: { account_id: 557378 } },
  //son olarak o account'ın id'sine göre grouplama yapıyoruz ve burada belirleyici olan $min expression ı oluyor.
  {
    $group: {
      _id: "$_id",
      date: { $first: "$transactions.date" },
      transaction_code: { $first: "$transactions.transaction_code" },
      symbol: { $first: "$transactions.symbol" },
      price: { $first: "$transactions.price" },
      total: { $first: "$transactions.total" },
      min_transaction: { $min: "$transactions.amount" },
    },
  },
]);
```
