// write your code here
const apiHost = "http://localhost:3000"

fetch(`${apiHost}/images`, {
    method: 'Get',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
.then(result => result.json())
.then(data => {
    removeDefaultComments()
    const imageCard = createImageCard(data[0]) //We could have iterated through the items and picked more, but we are only picking one for now
    loadCommentsToCard(imageCard)
    handleLikeButton(imageCard)
    handleCommentForm(data[0])
})
.catch(error => console.log(error.message))


function removeDefaultComments(){
    document.getElementById('comments-list').innerHTML =  ``
}

// function addToDom(item){
//     // console.log("item: ", item)
//     // document.getElementById('card-title').textContent = item.title
//     // document.getElementById('card-image').src = item.image
//     // document.querySelector('.image-card').id = item.id
//     // document.getElementById('like-count').textContent = `${item.likes} likes`
//     loadDatabaseComments(item)
// }


function createImageCard(item){

    const imageCard = document.createElement('div')
    imageCard.classList.add('image-card')
    imageCard.id = item.id

    imageCard.innerHTML = `<h2 id="card-title" class="title">${item.title}</h2>
    <img id="card-image" class="image" src="${item.image}" alt="Title of image goes here too" />
    
        <div class="likes-section">
            <span id="like-count" class="likes">${item.likes} likes</span>
            <button id="like-button" class="like-button">♥</button>
        </div>
        
        <ul id="comments-list" class="comments"></ul>

        <form id="comment-form" class="comment-form">
        <input class="comment-input" type="text" name="comment" id="comment" placeholder="Add a comment..."/>
            <button class="comment-button" type="submit">Post</button>
        </form>`
        
    document.querySelector('.image-container').innerHTML = ``
    document.querySelector('.image-container').append(imageCard)

    console.log(imageCard)

    return imageCard;
}


function loadCommentsToCard(imageCard){
    const itemId = imageCard.id
    
    fetch(`${apiHost}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(result => result.json())
    .then(data => {
        const comments = data.filter(comment => {
            return comment.imageId == itemId
        })

        for(comment of comments){
            updateCommentsInDom(comment)
        }
    })
    .catch(error => console.log(error.message))
}


function handleLikeButton(imageCard){
    const likeButton = imageCard.querySelector('#like-button')
    
    likeButton.addEventListener('click', e =>{
        const existingLikeCount = parseInt(imageCard.querySelector('#like-count').textContent.split(" ")[0])
        const updatedLikeCount = existingLikeCount + 1

        fetch(`${apiHost}/images/${imageCard.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    likes: updatedLikeCount
                }
            )
        })
        .then(result => result.json())
        .then(data => {
            document.getElementById('like-count').textContent = `${data.likes} likes`
        })
        updateLikesCountInDom()
    })
}


function updateLikesCountInDom(){

}


function handleCommentForm(item){
    const commentForm = document.getElementById('comment-form')
    
    console.log(commentForm)
    commentForm.addEventListener('submit', e =>{
        e.preventDefault();
        const commentInput = commentForm.querySelector('.comment-input').value

        const commentObject = getCommentObject(commentInput, item.id)
        fetch(`${apiHost}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(commentObject)
        })
        .then(result => result.json())
        .then(data => {
            updateCommentsInDom(data)
            e.target.reset()
        })
    })
}


function getCommentObject(commentInput, imageId){
    return {
        imageId: imageId,
        content: commentInput
    }
}


function updateCommentsInDom(commentInfo){
    console.log("comments info: ", commentInfo)
    const newComment = document.createElement('li')
    
    newComment.textContent = commentInfo.content
    newComment.id = commentInfo.id
    
    newComment.style.cursor = "pointer"
    
    newComment.addEventListener('click', e=>{
        fetch(`${apiHost}/comments/${commentInfo.id}`, {
            method: 'DELETE',
        })
        .then(result => result.json())
        .then(data => {
            newComment.remove()
        })
    })
    
    document.getElementById('comments-list').append(newComment)
}

