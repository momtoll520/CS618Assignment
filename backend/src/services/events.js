import {v4 as uuidv4} from 'uuid'
import {Event} from '../db/models/events.js'
export async function trackEvent({
    postId,
    session=uuidv4(),
    action,
    date=Date.now(),
}){
    const event = new Event({post:postId,session,action,date,})
    return await event.save()
}

export async function getTotalViews(postId){
    return{
        views:await Event.countDocuments({ post:postId, action:'startView'}),
    }
}

export async function getDailyViews(postId){
    return await Event.aggregate([
        {
            $match:{
                post:postId,
                action:'startView',
            },
        },
        {
            $group:{
                _id:{
                    $dateTrunc:{date:'$date',unit:'day'},
                },
                views:{$count:{}},
            },
        },
        {
            $sort:{_id:1},
        },
    ])
}

export async function getDailyDurations(postId){
    return await Event.aggregate([
        {
            $match:{
                post:postId,
            },
        },
        {
            $project:{
                session:'$session',
                startDate:{
                    $cond:[{$eq:['$action','startView']}, '$date',undefined],
                },
                endDate:{
                    $cond:[{$eq:[ '$action','endView']}, '$date',undefined],
                },
            },
        },
        {
            $group:{
                _id:'$session',
                startDate:{$min: '$startDate'},
                endDate:{$max:'$endDate'},
            },
        },
        {
            $match:{
                startDate:{$ne:null},
                endDate:{ $ne:null},
            }
        },
        {
            $project:{
                day:{ $dateTrunc:{date:'$startDate',unit:'day'}},
                duration:{ $subtract:[ '$endDate','$startDate']},
            },
        },
        {
            $group:{
                _id:'$day',
                averageDuration:{$avg: '$duration'},
            },
        },
        {
            $sort:{_id:1},
        },
    ])
}


    
