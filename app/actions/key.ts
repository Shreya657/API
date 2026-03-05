"use server";

import { prisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { randomBytes, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { generateApiKey } from "../lib/generateKey";

//create new api key
export async function createApiKey(name: string = "Default Key") {
  const { userId } = await auth();
  if (!userId) 
    throw new Error("Unauthorized");

  const { rawKey, hashedKey } = generateApiKey(); //utilty fn


  await prisma.apiKey.create({
    data: {
      keyHash: hashedKey ,
      name: name || "Default Key",
      userId: userId,
      limit: 100, //  daily limit
    },
  });

  revalidatePath("/dashboard");
  
  // return the raw key so the user can copy it 
  return { rawKey };
}

//delete apikey
export async function deleteApiKey(id:string){
    const {userId}=await auth();
    if(!userId){
        return{
            success:false,
            errorMessage:"Unauthorized"
        }
    }
    await prisma.apiKey.delete({
        where:{
            id:id,
            userId:userId
        }
    });
    revalidatePath("/dashboard");
    return{
        success:true

    }
}