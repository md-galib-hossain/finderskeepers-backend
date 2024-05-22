import express from 'express'
import { userRoutes } from '../modules/User/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { itemCategoryRoutes } from '../modules/ItemCategory/itemcategory.route'
import { itemRoutes } from '../modules/Item/item.route'
import { claimRoutes } from '../modules/Claim/claim.route'

const router = express.Router()

const moduleRoutes = [
{
    path : '/',
    route : userRoutes
},
{
    path : '/',
    route : AuthRoutes
},
{
    path : '/',
    route : itemCategoryRoutes
},
{
    path : '/',
    route : claimRoutes
},
{
    path : '/',
    route : itemRoutes
},
]

moduleRoutes.forEach(module=> router.use(module?.path,module?.route))

export default router