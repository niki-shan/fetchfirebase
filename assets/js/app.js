let cl = console.log;


const baseUrl = `https://postmat-e75c9-default-rtdb.asia-southeast1.firebasedatabase.app`
const commentUrl = `${baseUrl}/post.json`


const commentform = document.getElementById("commentform");
const  commentcard = document.getElementById("commentcard");
const titlecontrol= document.getElementById("title");
const bodycontrol = document.getElementById("body");
const spinner = document.getElementById("spinner");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn")


const loader =()=>{
    spinner.classList.add("d-none")
}

const templating =(arr)=>{
    let result = [];
    arr.forEach(ele => {
      result+= `<div class="card my-3" id="${ele.userId}">
      <div class="card-header">${ele.title}</div>
      <div class="card-body">${ele.body}</div>
      <div class="card-footer">
      <div class ="d-flex justify-content-between">
      <button class="btn btn-info" onclick= "onEdit(this)">Edit</button>
      <button class="btn btn-danger" onclick= "onDelete(this)">Delete</button>
      </div>
      </div>
    </div>`  
    })
    commentcard.innerHTML = result
}

const objIntoArr = (obj,Id)=>{
    let commentArr=[]
    for (const key in obj) {
        let data = obj[key]
        data[Id]= key  
        commentArr.push(data)

        }
        return commentArr
    }


const makeApicall=(methodname,apiUrl,msgBody=null)=>{
    spinner.classList.remove("d-none")
   return  fetch(apiUrl,{
      method : methodname,
      body : msgBody,
      header :{
        "Content-type": "application/json",
        "Authurization": "JWT-Token"
      }
   })

   .then(res=>{
     return res.json()
   })
}


getAllpost=()=>{
    makeApicall("GET",commentUrl)
.then(res=>{
    cl(res)
    // let dataconvert = JSON.parse
    let data= objIntoArr(res,"userId")
    templating(data)
})
.catch(err=>cl(err))
.finally(()=>{
    loader()
})
}
getAllpost()

onFormsubmit=(ele)=>{
    ele.preventDefault()
  let obj ={
      title :titlecontrol.value,
      body :bodycontrol.value
  }
  makeApicall("POST", commentUrl, JSON.stringify(obj))
      .then(res=>{
        let data = res
        let card = document.createElement("div");
        card.className = "card my-3";
        card.id = data.name;
        card.innerHTML = `
        <div class="card-header">${obj.title}</div>
        <div class="card-body">${obj.body}</div>
        <div class="card-footer">
        <div class ="d-flex justify-content-between">
        <button class="btn btn-info" onclick= "onEdit(this)">Edit</button>
        <button class="btn btn-danger" onclick= "onDelete(this)">Delete</button>
        </div>
          </div>`  
         commentcard.append(card)
         loader()
    })
    .catch(err=>{
        cl(err)
       loader()}) 
    .finally(
            commentform.reset()
    )}

onEdit=(ele=>{
    cl(ele.closest(".card"))
    let  editId = ele.closest(".card").id
    cl(editId)
    localStorage.setItem("editId", editId)
    let editUrl = `${baseUrl}/post/${editId}.json`
     makeApicall("GET", editUrl)
    .then(res=>{
        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
        let data = res;
        
        titlecontrol.value = data.title
        bodycontrol.value = data.body 
    
       
    })
    .catch(err=>{`                  `
         cl(err)
    })
    .finally(()=>{
        loader()
    })
})


onUpdate=()=>{
    updateId = localStorage.getItem("editId")
    updateUrl= `${baseUrl}/post/${updateId}.json`
    updateObj = {
        title : titlecontrol.value,
        body : bodycontrol.value
    }
    makeApicall("PATCH", updateUrl, JSON.stringify(updateObj))
    .then(res=>{
     
        let resdata = res
        let card = { ...document.getElementById(updateId).children}
        card[0].innerHTML = `${updateObj.title}`
        card[1].innerHTML = `${updateObj.body}`

    })
    .catch(err=>{cl(err)})

}

onDelete=(ele)=>{
   let deleteId = ele.closest(".card").id
   let deleteUrl = `${baseUrl}/post/${deleteId}.json`

   makeApicall("DELETE",deleteUrl)
   .then(res=>{
    loader()
    document.getElementById(deleteId).remove(res)
   })
   .catch(err=>{
    cl(err)
   })
}

commentform.addEventListener("submit", onFormsubmit)
updateBtn.addEventListener("click", onUpdate)


