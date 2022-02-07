# MongoDB-Notlar

## İçindekiler

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
