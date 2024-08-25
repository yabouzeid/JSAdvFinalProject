
// ---------- //
// profile.js //
// ---------- //

setupUI()
getUser()
getPosts()

// Get current user id
function getCurrentUserID(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}

// Get User
function getUser(){
    const userID = getCurrentUserID()
    toggleLoader(true)
    axios.get(`${baseURL}/users/${userID}`)
    // axios automatically checkes status of response
    // and returns a promise.
    .then((response) => {
        const user = response.data.data
        // Main Info
        document.getElementById("header-image").src = user.profile_image
        document.getElementById("mainInfo-email").innerHTML = user.email
        document.getElementById("mainInfo-username").innerHTML = user.username
        document.getElementById("mainInfo-name").innerHTML = user.name
        document.getElementById("postsCount").innerHTML = user.posts_count
        document.getElementById("commentsCount").innerHTML = user.comments_count
        document.getElementById("postsTitle").innerHTML = `${user.username}'s Posts`
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// Get Posts
function getPosts(){
    const userID = getCurrentUserID()
    toggleLoader(true)
    axios.get(`${baseURL}/users/${userID}/posts`)
    // axios automatically checkes status of response
    // and returns a promise.
    .then((response) => {
        // 1st .data from axios, 2nd .data from api
        const posts = response.data.data
        document.getElementById("userPosts").innerHTML = ""
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
                        <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
                        <b>${author.username}</b>
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
            document.getElementById("userPosts").innerHTML += content

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