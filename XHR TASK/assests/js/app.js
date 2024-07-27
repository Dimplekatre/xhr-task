const cl= console.log;

const postcontainer= document.getElementById("postcontainer");
const loader=document.getElementById("loader");
const postform= document.getElementById("postform")
const titlecontrol=document.getElementById("titleid");
const contentcontrol=document.getElementById("contentid");
const useridcontrol=document.getElementById("userid");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");


const BASE_URL= "https://jsonplaceholder.typicode.com"

const POST_URL=`${BASE_URL}/posts`;

let postArr=[];
const templating=(arr)=>{
       let result='';
       arr.forEach(post => {
            result+=`
                    <div class="col-md-4 mb-4">
                 <div class="card postcard h-100" id=${post.id}>
                    <div class="card-header">
                      <h3 class="m-0">${post.title}</h3>
                    </div>
                    <div class="card-body">
                     <p class="m-0">${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                       <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary ">EDIT</button>
                       <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger ">DELETE</button>
                    </div>

                 </div>
            </div>
        `
        postcontainer.innerHTML=result;
       }); 
}


const fetchpost=()=>{
       
        loader.classList.remove("d-none");
        let xhr= new XMLHttpRequest();

        xhr.open("GET",POST_URL);

        xhr.send();

        xhr.onload=function(){
             if(xhr.status>=200 && xhr.status<300){
                   postArr=JSON.parse(xhr.response)
                   cl(postArr);
                   templating(postArr);
             }
             loader.classList.add("d-none")
        }
}

fetchpost()

const onEdit=(ele)=>{
        let editId= ele.closest('.card').id;
        localStorage.setItem('editId', editId);

        let EDIT_URL= `${BASE_URL}/posts/${editId}`;
        loader.classList.remove('d-none');

        let xhr= new XMLHttpRequest();

        xhr.open("GET", EDIT_URL)

        xhr.send();

        xhr.onload=function(){
              if(xhr.status>=200 && xhr.status<300){
                  cl(xhr.response);
                  let post=JSON.parse(xhr.response);
                  titlecontrol.value= post.title;
                  contentcontrol.value=post.body;
                  useridcontrol.value=post.userId;
                  submitbtn.classList.add('d-none');
                  updatebtn.classList.remove('d-none');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              loader.classList.add("d-none")
        }
}

const onDelete=(ele)=>{
     let removeId= ele.closest('.card').id;
     let REMOVE_URL= `${BASE_URL}/posts/${removeId}`;
  
      Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
       }).then((result) => {
         if (result.isConfirmed) {
            loader.classList.remove('d-none');
     
            let xhr =new XMLHttpRequest();
      
            xhr.open("DELETE", REMOVE_URL);

            xhr.send();

             xhr.onload=function(){
                    if(xhr.status>=200 && xhr.status<300){
                       ele.closest('.col-md-4').remove();
                    }
                    loader.classList.add('d-none');
               }
         }
       });
     
}

const onpostupdate=()=>{
       let updatedobj={
           title:titlecontrol.value,
           body:contentcontrol.value,
           userId:useridcontrol.value,       
       }
       cl(updatedobj);
       let updateId=localStorage.getItem('editId');

       let UPDATE_URL=`${BASE_URL}/posts/${updateId}`;
       loader.classList.remove('d-none');

       let xhr= new XMLHttpRequest();

       xhr.open("PATCH",UPDATE_URL);

       xhr.send(JSON.stringify(updatedobj));

       xhr.onload=function(){
            if(xhr.status>=200 && xhr.status<300){
                  cl(xhr.response);
                  let card= [...document.getElementById(updateId).children];
                  cl(card);
                  card[0].innerHTML=` <h3 class="m-0">${updatedobj.title}</h3>`
                  card[1].innerHTML=` <p class="m-0">${updatedobj.body}</p>`
                  postform.reset();
                  updatebtn.classList.add('d-none');
                  submitbtn.classList.remove('d-none');
            }
            loader.classList.add('d-none');
       }
       
       
    }    
       const onpostsubmit=(eve)=>{
       eve.preventDefault();
       let newPost={
          title:titlecontrol.value,
          body:contentcontrol.value,
          userId:useridcontrol.value
       }
       cl(newPost);
       loader.classList.remove("d-none");

       let xhr= new XMLHttpRequest();

       xhr.open("POST", POST_URL)

       xhr.send(JSON.stringify(newPost))

       xhr.onload=function(){
             if(xhr.status>=200 && xhr.status<300){
                  cl(xhr.response);
                  newPost.id= JSON.parse(xhr.response).id;

                  let div= document.createElement('div');
                  div.className='col-md-4 mb-4 ';
                  div.innerHTML=`
                             <div class="card postcard h-100" id=${newPost.id}>
                    <div class="card-header">
                      <h3 class="m-0">${newPost.title}</h3>
                    </div>
                    <div class="card-body">
                     <p class="m-0">${newPost.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                       <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary ">EDIT</button>
                       <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger ">DELETE</button>
                    </div>

                 </div>
                  
                  `
                  postcontainer.prepend(div);
             }
             loader.classList.add('d-none')
       }
}

postform.addEventListener("submit", onpostsubmit);
updatebtn.addEventListener("click",onpostupdate);


