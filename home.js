
// ------- //
// home.js //
// ------- //

setupUI() // check if user logged in       
getPosts()

// Infinte scroll (pagination)
let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1
        getPosts(false, currentPage)
    }
});

// Get Posts
function getPosts(reload = true, page = 1){
    const limit = 15 //No of posts per page
    toggleLoader(true)
    axios.get(`${baseURL}/posts?limit=${limit}&page=${page}`)
    // axios automatically checkes status of response
    // and returns a promise.
    .then((response) => {
        // 1st .data from axios, 2nd .data from api
        const posts = response.data.data
        // console.log(posts)
        lastPage = response.data.meta.last_page
        if (reload){
            document.getElementById("posts").innerHTML = ""
        }
        for (post of posts){
            const author = post.author
            // show or hide Edit btn
            let user = getCurrentUser()
            let isMyPost = user != null && author.id == user.id
            let editBtnContent = ``
            if (isMyPost){
                // sending an obj as argument from html to  js fun
                editBtnContent = `
                <button class="btn btn-danger" style="margin-left:5px; float: right;" onclick="deleteBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                <button class="btn btn-secondary" style="float: right;" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                `
            }
            let postTitle = ""
            if (post.title != null){
                postTitle = post.title
            }
            let content = `
                <div class="card shadow">
                    <div class="card-header">
                        <span onclick="userClicked(${author.id})" style="cursor: pointer;">
                            <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
                            <b>${author.username}</b>
                        </span>
                        ${editBtnContent}
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                        <img class="w-100" src="${post.image}" alt="">
                        <h6 class="mt-1" style="color: rgb(193, 193, 193);">${post.created_at}</h6>
                        <h5>${postTitle}</h5>
                        <p>${post.body}</p>
                        <hr>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <span>(${post.comments_count}) Comments
                                <span id="post-tags-${post.id}">
                                    
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `
            document.getElementById("posts").innerHTML += content
            let currentPostTagsId = `post-tags-${post.id}`
            document.getElementById(currentPostTagsId).innerHTML = ""
            for(tag of post.tags){
                let tagsContent =`
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">${tag.name}</button>
                `
                document.getElementById(currentPostTagsId).innerHTML += tagsContent
            }
        }
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// user Clicked
function userClicked(userID){
    window.location = `profile.html?userid=${userID}`
}

// Post Clicked
function postClicked(postID){
    // send post id as query parameter to next page
    window.location = `postDetails.html?postid=${postID}`
}

// Add btn Clicked
function addBtnClicked(){
    document.getElementById("add-edit-btn").innerHTML = "Add"
    document.getElementById("post-id").value = ""
    document.getElementById("modalTitle").innerHTML = "Add new post"
    document.getElementById("addpost-title").value = ""
    document.getElementById("addpost-body").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("addPost-modal"), {})
    postModal.toggle()
}