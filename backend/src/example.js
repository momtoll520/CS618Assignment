import { initDataBase } from './db/init.js'
import {Post} from './db/models/post.js'

await initDataBase()
 
const post=new Post({
    title:'Hello Mongoose!',
    author: 'Wanjing Chen',
    contents:'This post is stored in a mongoDB database using Mongoose',
    tags:['mongoose','mongodb'],
})
const createPost= await post.save()

await Post.findByIdAndUpdate(createPost._id,{
    $set: {title: 'Hello again,Mongoose!'},
})


const posts=await Post.find()
console.log(posts)

