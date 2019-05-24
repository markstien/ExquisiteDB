![avatar](https://github.com/Marksteinsong/ExquisiteDB/blob/master/images/Alogo.png)
# ExquisiteDB
========
### 对indexDB的简易封装
#### Why?
####The original indexDB API  is too hard to use.
####原生indexDB API太难用了。
eg:
https://marksteinsong.github.io/ExquisiteDB/
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ExquisiteDB--example</title>
    <script src="dist/ExquisiteDB.js"></script>
</head>
<body>
<table>
    <thead>
    <th>id</th>
    <th>姓名-name</th>
    <th>年龄-age</th>
    </thead>
    <tbody id="tbody">

    </tbody>
</table>
<script>
    let dataConstruct={
        keyPath:"id",
        index:[
            {name:"name",unique:false},
            {name:"age",unique:false}
        ]
    };
    let example=new ExquisiteDB("dataExquisite",1,dataConstruct);
    example.addOne({id:"123",name:"Mark",age:"21"},function (result) {
        console.log(result);
    });
    example.getAll(function (datas) {
        let tbody=document.getElementById("tbody");
        datas.forEach(function (data) {
            tbody.innerHTML+=`<tr>
                                    <td>${data.id}</td>
                                    <td>${data.name}</td>
                                    <td>${data.age}</td>
                               </tr>`;
        });
    });
</script>
</body>
</html>
```
### properties:
#### Object.addOne(data,callback)

- `data`: ```<object>```
- `callback`:```<function>```
#### Object.getAll(callback)
- `callback`:```<function>```
#### Object.getOneByIndex(key,value,callback)

- `key`: ```<string>```
- `value`:```<string>```
- `callback`:```<function>```

For example:
```exampleObject.getOneByIndex("id","123",function(result){console.log(result)})```


未完待续...
