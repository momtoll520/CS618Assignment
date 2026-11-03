import { initDatabase } from './db/init.js'

import {Post} from './db/models/post.js'

import dotenv from'dotenv'
dotenv.config()

await initDatabase()
 
const post=new Post({
    title:'Hello Secod Post Mongoose!',
    author: 'May Chen',
    contents:'This is my new mongoDB database using Mongoose',
    tags:['frontend'],
})

await post.save()

const posts=await Post.find()
console.log(posts)

