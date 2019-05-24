/**
 *author:Markstien
 * updateTime:2019-5-21 18:45
 * License：BSD
 */
// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
if (!window.indexedDB) {
    alert("你的浏览器不支持indexDB。");
}else {
    console.log("You browser supports indexDB.");
}
/***
 * function-return:type1(fail)||type2(success)
 * getAll:string||data
 * getOneByIndex:undefined||object
 * addOne:string||success
 * removeOne:string||success
 * changeOne:string||success
 * 数据结构
 * {
 * ketPath:"id",
 * index:[
 *     {name:"index1",unique:true},
 *     {name:"index1",unique:false},
 *     ....
 *     ....
 * ]
 * }
 * */
const ExquisiteDB=function (databaseName,version,dataConstruct) {
    if((typeof databaseName)!=="string"){
        console.log("ExquisiteDB:数据库名必须是string。");
        return 0;
    }
    this.databaseName=databaseName;
    this.version=version;
    this.request = window.indexedDB.open(this.databaseName,this.version);
    this.request.onupgradeneeded=function (event) {
        console.log("创建新结构。");
        let db = event.target.result;
        //keyPath主键
        let  objectStore = db.createObjectStore("ExquisiteDB", { keyPath: dataConstruct.keyPath });
        dataConstruct.index.forEach(function (index) {
            objectStore.createIndex(index.name, index.name, { unique: index.unique });
            console.log(index);
        });
        // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
        objectStore.transaction.oncomplete = function(event) {
           console.log(event.type);
        };
    }
};
ExquisiteDB.prototype={
    constructor:ExquisiteDB,
    getAll:function (callback) {
        let request=window.indexedDB.open(this.databaseName,this.version);
        request.onsuccess=function (event) {
            let db=event.target.result;
            let  objectStore = db.transaction("ExquisiteDB").objectStore("ExquisiteDB");
            objectStore.getAll().onsuccess = function(event) {
               callback(event.target.result);
            };
        };
        request.onerror=function (event) {
            callback("打开数据库失败。");
        }
    },
    getOneByIndex:function(key,value,callback){
        let request=window.indexedDB.open(this.databaseName,this.version);
        request.onsuccess=function (event) {
            let db=event.target.result;
            let  objectStore = db.transaction("ExquisiteDB").objectStore("ExquisiteDB");
            let  index = objectStore.index(key);
            index.get(value).onsuccess=function (event) {
                callback(event.target.result);
            }
        };
        request.onerror=function (event) {
            callback("打开数据库失败。");
        }
    },
    addOne:function (data,callback) {
        let request=window.indexedDB.open(this.databaseName,this.version);
        request.onsuccess=function (event) {
            let db=event.target.result;
            let  objectStore = db.transaction("ExquisiteDB", "readwrite").objectStore("ExquisiteDB");
            let request=objectStore.add(data);
            request.onsuccess=function (event) {
                callback(event.type);
                // callback(event.target.result === data.ssn);
            };
            request.onerror=function (event) {
                callback(`写入失败:${event.target.error.message}`);
            }
        };
        request.onerror=function (event) {
            callback("打开数据库失败。");
        }
    },
    removeOneByKeyPath:function (keyPath,callback) {
        let request=window.indexedDB.open(this.databaseName,this.version);
        request.onsuccess=function (event) {
            let db=event.target.result;
            let request = db.transaction(["ExquisiteDB"], "readwrite")
                .objectStore("ExquisiteDB")
                .delete(keyPath);
            request.onsuccess=function(event){
                callback(event.type);
            };
            request.onerror=function (event) {
                callback(`删除失败:${event.target.error.message}`);
            }
        };
        request.onerror=function (event) {
            callback("打开数据库失败。");
        }
    },
    changeOneByKeyPath:function (keyPath,dataChanged,callback) {
        let request=window.indexedDB.open(this.databaseName,this.version);
        request.onsuccess=function (event) {
            let db=event.target.result;
            let  objectStore = db.transaction(["ExquisiteDB"], "readwrite").objectStore("ExquisiteDB");
            let request = objectStore.get(keyPath);
            request.onerror = function(event) {
               callback(`读取失败:${event.target.error.message}`);
            };
            request.onsuccess = function(event) {
                // 获取我们想要更新的数据
                let data = event.target.result;
                // 更新你想修改的数据
                data = dataChanged;
                // 把更新过的对象放回数据库
                let  requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function(event) {
                    callback(`更改失败:${event.target.error.message}`);
                };
                requestUpdate.onsuccess = function(event) {
                    callback(event.type);
                };
            };
        };
        request.onerror=function (event) {
            callback("打开数据库失败。");
        }
    }
};
