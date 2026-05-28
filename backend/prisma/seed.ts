import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  const permissions = [

    { action:"CREATE_PRODUCT" },
    { action:"VIEW_PRODUCTS" },
    { action:"UPDATE_COSTING" },
    { action:"APPROVE_PRODUCT" },
    { action:"CREATE_USER" }

  ]

  for(const permission of permissions){

    await prisma.permission.upsert({

      where:{
        action:permission.action
      },

      update:{},

      create:permission

    })

  }
}

main()