// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default user
  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'משתמש',
      email: 'user@example.com',
      role: 'USER'
    }
  })
  console.log('✅ Default user created')

  // Create categories
  const categoriesData = [
    { name: 'דיונים', color: '#3B82F6' },
    { name: 'ביקורות', color: '#10B981' },
    { name: 'המלצות', color: '#F59E0B' },
    { name: 'שאלות', color: '#8B5CF6' },
    { name: 'חדשות', color: '#EF4444' },
    { name: 'מימים', color: '#EC4899' }
  ]

  for (const categoryData of categoriesData) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    })
    console.log(`✅ Category "${categoryData.name}" created`)
  }

  // Get the discussion category for posts
  const discussionCategory = await prisma.category.findFirst({
    where: { name: 'דיונים' }
  })

  if (discussionCategory) {
    // Create default posts
    const postsData = [
      {
        title: 'ברוכים הבאים לפורום!',
        content: 'זהו הפוסט הראשון בפורום האנימה שלנו. אנו מקווים שתיהנו כאן!',
        authorId: defaultUser.id,
        categoryId: discussionCategory.id
      },
      {
        title: 'איך לכתוב ביקורת טובה',
        content: 'כמה טיפים לכתיבת ביקורות איכות על אנימה...',
        authorId: defaultUser.id,
        categoryId: discussionCategory.id
      }
    ]

    for (const postData of postsData) {
      const existingPost = await prisma.post.findFirst({
        where: { title: postData.title }
      })
      
      if (!existingPost) {
        await prisma.post.create({
          data: postData
        })
        console.log(`✅ Post "${postData.title}" created`)
      }
    }
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })