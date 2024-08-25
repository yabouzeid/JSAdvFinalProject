
// ------------ //
// mainlogic.js //
// ------------ //

const baseURL = "https://tarmeezacademy.com/api/v1"

// Setup UI
function setupUI(){
    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")
    const addPostBtn = document.getElementById("addPost-btn")
    if (token == null){
        // user not loggedin yet
        if (addPostBtn != null){
            addPostBtn.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important") 
    }
    else{
        // loggedin user
        if (addPostBtn != null){
            addPostBtn.style.setProperty("display", "block", "important")
        }
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        const user = getCurrentUser ()
        document.getElementById("nav-userimg").src = user.profile_image
        document.getElementById("nav-username").innerHTML = user.username
    }
}

// get Current User
function getCurrentUser(){
    let user = null
    const storedUser = localStorage.getItem("user")
    if (storedUser != null){
        user = JSON.parse(storedUser)
    }
    return user
}

// Register
function registerBtnClicked(){
    const name = document.getElementById("reg-name").value
    const username = document.getElementById("reg-username").value
    const password = document.getElementById("reg-pwrd").value
    const email = document.getElementById("reg-email").value
    const image = document.getElementById("user-img").files[0]
    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("email", email)
    formData.append("image", image)
    const url = `${baseURL}/register`
    toggleLoader(true)
    axios.post(url, formData)
    .then((response) => {
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", user)
        // close register menu (bootstrap instance)
        const modal = document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert ("Registered successfully", "success")
        setupUI()
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// Login
function loginBtnClicked(){
    const username = document.getElementById("user-name").value
    const password = document.getElementById("pwrd").value
    const params = {
        "username": username,
        "password": password
    }
    const url = `${baseURL}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) => {
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", user)
        // close login menu (bootstrap instance)
        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert ("Logged in successfully", "success")
        setupUI()
        getPosts()  
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// log Out
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert ("Logged out successfully")
    setupUI()
    getPosts()  
}

// Profle Clicked
function profileClicked(){
    const user = getCurrentUser()
    const userID = user.id
    window.location = `profile.html?userid=${userID}`
}

// Edit btn Clicked
function editBtnClicked(postObj){
    // receiving obj from html
    let post = JSON.parse(decodeURIComponent(postObj))
    document.getElementById("add-edit-btn").innerHTML = "Edit"
    document.getElementById("post-id").value = post.id
    document.getElementById("modalTitle").innerHTML = "Edit post"
    document.getElementById("addpost-title").value = post.title
    document.getElementById("addpost-body").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("addPost-modal"), {})
    postModal.toggle()
}

// Add / Edit Post
function addPostBtnClicked(){
    let postID = document.getElementById("post-id").value
    let isAdd = postID == null || postID == "" // add new post
    const postTitle = document.getElementById("addpost-title").value
    const postBody = document.getElementById("addpost-body").value
    const postImg = document.getElementById("addpost-img").files[0]
    let formData = new FormData()
    formData.append("title", postTitle)
    formData.append("image", postImg)
    formData.append("body", postBody)
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    let url = ``
    let message = ""
    if (isAdd){
        // add new post
        url = `${baseURL}/posts`
        message = "New post added successfully"
    }
    else{
        // edit post
        formData.append("_method", "put") // due to API behaviour !
        url = `${baseURL}/posts/${postID}`
        message = "Post edited successfully"
    }
    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers   
    })
    .then((response) => {
        // console.log(response)
        // close add post modal (bootstrap instance)
        const modal = document.getElementById("addPost-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert (message, "success")
        getPosts()
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// delete btn Clicked
function deleteBtnClicked(postObj){
    // receiving obj from html
    let post = JSON.parse(decodeURIComponent(postObj))
    document.getElementById("postTODelete-id").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("deletePost-modal"), {})
    postModal.toggle()
}

// Confirm post delete
function confirmPostDelete(){
    const postID = document.getElementById("postTODelete-id").value
    const url = `${baseURL}/posts/${postID}`
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    toggleLoader(true)
    axios.delete(url, {
        headers: headers   
    })
    .then((response) => {
        // console.log(response)
        // close add post modal (bootstrap instance)
        const modal = document.getElementById("deletePost-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert ("Post deleted successfully", "success")
        getPosts()
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert (message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}

// Alert
function showAlert(customMessage, type="success"){
    const alertPlaceholder = document.getElementById('alert')
    const alert = (message, type) => {
        var wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        alertPlaceholder.append(wrapper)
    }
    alert(customMessage, type)
    setTimeout(() => {
        // const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // hideAlert.close()
        // const alert = document.getElementById("success-alert")
        // const modalAlert = bootstrap.Alert.getInstance(alert)
        // modalAlert.hide()
    }, 3000);
}

// Togglee loadder
function toggleLoader(show = true){
    if (show){
        document.getElementById("loader").style.visibility = 'visible'
    }
    else{
        document.getElementById("loader").style.visibility = 'hidden' 
    }
}