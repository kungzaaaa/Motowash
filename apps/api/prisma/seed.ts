import { PrismaClient, UserRole, MotorcycleType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // 1. Create admin user
  const adminEmail = 'admin@motowash.com'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123456', 10)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        profile: {
          create: {
            fullName: 'System Admin',
            phone: '+66999999999',
          }
        }
      }
    })
    console.log('Admin user created')
  } else {
    console.log('Admin user already exists')
  }

  // 2. Create Services
  const standardWash = await prisma.service.create({
    data: {
      name: 'Standard Wash',
      description: 'Basic wash and dry',
      durationMinutes: 45,
      prices: {
        create: [
          { motorcycleType: MotorcycleType.SCOOTER, price: 300 },
          { motorcycleType: MotorcycleType.SPORT, price: 400 },
          { motorcycleType: MotorcycleType.TOURING, price: 500 },
        ]
      }
    }
  })

  const premiumWash = await prisma.service.create({
    data: {
      name: 'Premium Wash',
      description: 'Wash, dry, and wax',
      durationMinutes: 60,
      prices: {
        create: [
          { motorcycleType: MotorcycleType.SCOOTER, price: 500 },
          { motorcycleType: MotorcycleType.SPORT, price: 650 },
          { motorcycleType: MotorcycleType.TOURING, price: 800 },
        ]
      }
    }
  })

  const fullDetail = await prisma.service.create({
    data: {
      name: 'Full Detail',
      description: 'Complete detailing service',
      durationMinutes: 90,
      prices: {
        create: [
          { motorcycleType: MotorcycleType.SCOOTER, price: 800 },
          { motorcycleType: MotorcycleType.SPORT, price: 1000 },
          { motorcycleType: MotorcycleType.TOURING, price: 1200 },
        ]
      }
    }
  })
  console.log('Services created')

  // 3. Create Service Area
  const serviceArea = await prisma.serviceArea.create({
    data: {
      name: 'Bangkok Central',
      description: 'Central business district of Bangkok',
    }
  })
  console.log('Service area created')

  // 4. Create Time Slots
  const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 7; i++) {
    const slotDate = new Date(today)
    slotDate.setDate(slotDate.getDate() + i)
    
    for (let j = 0; j < timeSlots.length - 1; j++) {
      const startTime = timeSlots[j]
      const endTime = timeSlots[j + 1]
      
      await prisma.timeSlot.create({
        data: {
          serviceAreaId: serviceArea.id,
          slotDate,
          startTime,
          endTime,
          maxCapacity: 3
        }
      })
    }
  }
  console.log('Time slots created')
  
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
