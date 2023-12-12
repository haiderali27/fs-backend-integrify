import { NextFunction, Request, Response } from "express";
import UsersService from "../services/userService";
import { ApiError } from "../errors/ApiError";
import { ResponseHandler } from "../responses/ResponeHandler";
import { ResponseData } from "../responses/ResponseData";
import { WithAuthRequest } from "../middlewares/checkAuth";
export async function getOffsetUser(req:Request, res: Response, next: NextFunction)  {
  
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  if(pageNumber<0){
    next(ApiError.internal("PageNumber Must be Non Negative"))
    return
  }
  const users = await UsersService.paginateUsers(pageNumber, pageSize);
  if(!users) {
    next(ApiError.internal("Internal Server error"));
  }
  //next(ResponseHandler.resourceFetched(JSON.stringify(users)))
  next(ResponseData.fetchResource(200, users))
  //res.json(users);
  
}

export async function findAllUser(_: Request, res: Response) {
  const users = await UsersService.findAll();
  res.json({ users });
}

export async function findOneUser(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.params.userId);
  // if(userId.length!==24){
  //   next(ApiError.internal("ID must be a 24 character hex string, 12 byte Uint8Array, or an integer"))
  //   return  
  // }
  try{
  const user = await UsersService.findOne(userId);

  if (!user) {
    next(ApiError.resourceNotFound("User not found."))
    return;
  }
  //next(ResponseHandler.resourceFetched(JSON.stringify(user)))
  next(ResponseData.fetchResource(200, user))
}catch(error){
  console.log('failed to get ')
  next(ApiError.badRequest("Bad Request"))
}

 // res.json({ user });
}




export async function findUserByEmail(req: Request, res: Response, next: NextFunction) {
  const {email} = req.body
 
  try{
  const user = await UsersService.findOneByEmail(email)

  if (!user) {
    next(ResponseData.fetchResource(200, {isAvailable: false}))
    return;
  }
  next(ResponseData.fetchResource(200, {isAvailable: true}))
}catch(error){
  console.log('failed to get ')
  next(ApiError.badRequest("Bad Request"))
}

 // res.json({ user });
}


export async function createOneUser(req: Request, res: Response, next:NextFunction) {
  const newUser = req.body;
  if(!newUser){
    next(ApiError.internal("Details are Required"))
  }
  const user = await UsersService.createOne(newUser);
  //next(ResponseHandler.resourceCreated(JSON.stringify(user), `User with ${user._id} has been added`))
  next(ResponseData.fetchResource(201, user))

 // res.status(201).json({ user });
}

export async function findOneAndUpdate(req: Request,res: Response,next: NextFunction) {
    const newUser = req.body;
    const userId = req.params.userId;
    const updatedUser = await UsersService.findOneAndUpdate(userId, newUser);
  
    if (!updatedUser) {
      next(ApiError.resourceNotFound("User not found."));
      return;
    }
   //next(ResponseHandler.resourceUpdated(JSON.stringify(updatedUser), `User with ${updatedUser._id} has been updated`))
     //res.status(200).json({ updatedUser });
     next(ResponseData.fetchResource(200, updatedUser))

}

export async function findOneAndDelete( req: Request, res: Response, next: NextFunction ) {
    const userId = req.params.userId;
    const deletedUser = await UsersService.findOneAndDelete(userId);

    if(!deletedUser) {
        next(ApiError.resourceNotFound("User not found."));
        return;
    }
    //next(ResponseHandler.resourceDeleted(JSON.stringify(deletedUser), `User with ${deletedUser._id} has been Deleted`))
    next(ResponseData.fetchResource(200, deletedUser))

   // res.status(200).json("User deleted ...");
}

//SignUp
export async function signup(req: Request, res: Response,  next: NextFunction) {
  const { name, email, password, role } = req.body
  const user = await UsersService.createNewOne({ name, email, password, role})
  if (!user) {
    res.status(400).json({
      message: "User exists",
      user: null,
    })
    return
  }
  //next(ResponseHandler.resourceCreated(JSON.stringify(user), `User has been added`))
  next(ResponseData.fetchResource(201, user))

 // res.status(201).json({message: "user created",user,})
}

//login
export async function login(req: Request, res: Response) {
  const { email, password} = req.body
  const login = await UsersService.login(email, password)
  if (login.status === false) {
    // TODO throw API error
    res.status(400).json({ access_token: null, message: "Bad credentials" })
    return
  }

  res.json({ message: login.message, access_token: login.accessToken })
}

export async function getProfile(req: WithAuthRequest, res: Response, next: NextFunction) {
  const decoded = req.decoded

  const userId = decoded?.userId
  if(userId)
  {
    const user = await UsersService.getOne(userId);
    if (!user) {
      next(ApiError.resourceNotFound("User not found."))
      return;
    }
    next(ResponseData.fetchResource(200, user))
    return
  }

  next(ApiError.resourceNotFound("User not found."))

  //next(ResponseHandler.resourceFetched(JSON.stringify(user)))

 // res.json({ user });
}


export default {
  getOffsetUser,
  findOneUser,
  findAllUser,
  createOneUser,
  findOneAndUpdate,
  findOneAndDelete,
  login,
  getProfile,
  signup,
  findUserByEmail
};