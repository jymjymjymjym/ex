/**************
 * 业务模块
 * *************/
const data = require('./data.json');
const fs = require('fs');
const path = require('path')

let maxID = (w)=>{
    let arr = [];
    w.forEach(item => {
        arr.push(item.id);
    });
    return Math.max(...arr);    //相当于 Math.max.apply(null, arr)
}

function write(res){
    fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data),(err)=>{
        if(err){                                  //该方法会把所有的空格都去掉，保留格式方法为.stringify(data, null, 4)
            res.send('serr err')
        }else{
            // 上传文件成功，重定向到首页
            res.redirect('/')
        }
    });
}

exports.showindex = (req, res)=>{
    res.render(__dirname+'/views/index.art',{
        arr: data
    })
}

//跳转到添加图书的页面
exports.toAdd = (req, res)=>{
    let rs=fs.createReadStream('./views/addPage.html', (err,data)=>{
        if(err){
            console.log('读取错误')
        }
    })

    rs.on('end', (e)=>{
        console.log('读取成功')

    })
    rs.pipe(res)


}

//提交表单POST
exports.add = (req, res)=>{
    let info = req.body
    let book = {};
    for(let key in info){
        book[key] = info[key]
    }
    book.id = maxID(data) + 1;

    data.push(book);   //此时data对象在内存当中，并未存入文件

    write(res);
}

exports.toEdit = (req, res)=>{
    let {id} = req.query;
    let thisdata = data.find( item => item.id==id)
    res.render(__dirname+'/views/editpage.art', thisdata);
}

exports.edit = (req, res)=>{
    let id = req.query.id;
    let info = req.body;
    data.forEach(item=>{
        if(item.id == id){
            for(let key in info){
                item[key] = info[key];
            }
            return;            //注意forEach循环用return退出，因为没有break
        }
    });

    write(res);
}

exports.delet = (req, res) =>{
    let id = req.query.id;
    data.forEach((item, index)=>{
        if(item.id == id){
            data.splice(index, 1);
        }
    });

    write(res);
}