import mongoose from 'mongoose'
import {describe, expect, test,beforeEach} from '@jest/globals'
import {createPost, listAllPosts,listPostsByTag,getPostById,updatePost,deletePost} from '../services/posts.js'
import {Post} from '../db/models/post.js'

const samplePosts=[
    {title: 'Learning Redux',author : 'Daniel Bugl', tags:['redux']},
    {title: 'Learn React Hooks', author:'Daniel Bugl', tags:['react']},
    {
        title:'Full-stack React Projects',
        author:'Daniel Bugl',
        tags:['react', 'nodejs'],
    },
    {title:'Guide to TypeScript'},
]

let createdSamplePosts=[]
beforeEach(async() =>{
    await Post.deleteMany({})
    createdSamplePosts=[]
    for (const post of samplePosts){
        const createdPost= new Post(post)
        createdSamplePosts.push(await createdPost.save())
    }
})

describe('deleting posts', ()=>{
    test('should remove the post from the database', async() => {
        const result= await deletePost(createdSamplePosts[0]._id)
        expect(result.deletedCount).toEqual(1)
        const deletedPost=await Post.findById(createdSamplePosts[0]._id)
        expect(deletedPost).toEqual(null)
    })
    test('should fail if the id does not exist', async()=>{
        const result=await deletePost('000000000000000000000000')
        expect (result.deletedCount).toEqual(0)
    })
})

describe ('updateing posts',()=>{
    test('Should update the specified property',async()=>{
        await updatePost(createdSamplePosts[0]._id,{
            author:'Test Author',
        })
    const updatedPost=await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
    })
    test('should not update other properties',async()=>{
        await updatePost(createdSamplePosts[0]._id,{
            author:'Test Author',
        })
        const updatedPost=await Post.findById(createdSamplePosts[0]._id)
        expect(updatedPost.title).toEqual('Learning Redux')
    })
    test('Should update the updatedAt timestamp',async()=>{
        await updatePost(createdSamplePosts[0]._id,{
            author:'Test Author',
        })
        const updatedPost=await Post.findById(createdSamplePosts[0]._id)
        expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
            createdSamplePosts[0].updatedAt.getTime(),
        )
    })
    test('should fail if the id does not exist',async()=>{
        const post =await updatePost('000000000000000000000000',{
            author: 'Test Author',
        })
        expect(post).toEqual(null)
    })
})

describe('getting a post', ()=> {
    test('should return the full post',async()=>{
        const post= await getPostById(createdSamplePosts[0]._id)
        expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
    })
    test('Should fail if the id does not exist',async()=>{
        const post=await getPostById('000000000000000000000000')
        expect(post).toEqual(null)
    })
})

describe('listing posts',()=>{
    test('should return all posts',async()=>{
        const posts=await listAllPosts()
        expect(posts.length).toEqual(createdSamplePosts.length)
    })
    test('Should be able to filter posts by tags',async()=>{
        const posts=await listPostsByTag('nodejs')
        expect(posts.length).toBe(1)
    })
})

describe('creating posts', ()=> {
    test('with all parameters should succeed', async() =>{
        const post={
            title: 'Hello Mongoose!',
            author:'Wanjing Chen',
            contents:'This post is stored in a MongoDB database using Mongoose.',
            tags:['mongoose','mongodb']
        }
        const createdPost=await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
        const foundPost= await Post.findById(createdPost._id)
        expect(foundPost).toEqual(expect.objectContaining(post))
        expect(foundPost.createdAt).toBeInstanceOf(Date)
        expect(foundPost.updatedAt).toBeInstanceOf(Date)
    })
    test('without title should fail',async() =>{
        const post={
            author:'Wanjing Chen',
            contets:'Post with no title',
            tags:['empty'],
        }
        try{
            await createPost(post)
        }catch(err){
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
            expect(err.message).toContain('`title` is required')
        }
    })
    test('with minimal parameters should succed', async ()=> {
        const post={
            title :'Only a title ',
        }
        const createdPost=await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    })
})