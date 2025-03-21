Setup instructions:

All node modules are downloaded in this folder, so you can run with `npm start`
  * Make sure that port 3000 is open, or change the port

The app structure is as follows:
  * `/` - The landing page, just says 'home' (GET)
  * `/api/auth/register` - The registration link (POST)
        Required JSON fields: name, email, password
  * `/api/auth/login` - The login link (POST)
        Required JSON fields: email, password
  * `/api/users/` - Displays all users (GET) -- this is only for testing purposes, insecure as it shows passwords
  * `/api/posts/` - Displays all posts (GET)
  * `/api/posts/` - Create a post (POST)
        Required JSON fields: title, description
  * `/api/posts/` - Displays all posts (GET)
  * `/api/posts/:id` - View a specific post (GET)
  * `/api/posts/:id` - Update a post (PUT)
        Optional JSON fields: title, description
  * `/api/posts/:id` - Delete a post (DELETE)
  * `/api/posts/:id/like` - Like a post (POST)
        No JSON fields required

I used a REST Client extension for VS Code instead of Postman in the browser.
  * The http requests are all contained in `requests.http`
  * This way, you can see all the requests I created.
  * The screenshots of my output are in the `screenshots` folder

Questions:

1) Prof. Stelios, on line 68 of posts.js I wanted to use a const for storing the current post.
  However, const is block level so it would not be accessible outside the try-catch.
  I settled with using let, but I am curious. How would you have handled this problem?
  Would you have structured the code differently?

2) For liking posts, a user should only be able to like a post once.
  How would you do this? 
  Would it make sense to store a set for each post of the userId's of users that have liked that post?
  Then you could check if the person trying to like a post is in that set of id's or not.
  Is there an easier way?
  Doing the set method, could you link the number of likes to be the length of the set, or would you have to have the api both increment the likes counter and add an id to the set?
