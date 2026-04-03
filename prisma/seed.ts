import { PrismaClient, UserRole, PostStatus } from "@prisma/client";
import { hashPassword } from "../src/auth/password";

const prisma = new PrismaClient();

type PrismaWithOptionalPostView = PrismaClient & {
  postView?: {
    deleteMany: () => Promise<unknown>;
  };
};

async function main() {
  const prismaWithPostView = prisma as PrismaWithOptionalPostView;

  if (prismaWithPostView.postView) {
    await prismaWithPostView.postView.deleteMany();
  }

  await prisma.postFaq.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [engineering, seo, growth] = await Promise.all([
    prisma.category.create({ data: { slug: "engineering", name: "Engineering", description: "Platform and systems articles" } }),
    prisma.category.create({ data: { slug: "seo", name: "SEO", description: "Search optimisation guides" } }),
    prisma.category.create({ data: { slug: "growth", name: "Growth", description: "User acquisition and retention" } })
  ]);

  const editor = await prisma.user.create({
    data: {
      email: "editor@example.com",
      name: "Maya Chen",
      slug: "maya-chen",
      bio: "Senior editor and platform engineer.",
      role: UserRole.EDITOR,
      passwordHash: hashPassword("password123456")
    }
  });

  const writer = await prisma.user.create({
    data: {
      email: "writer@example.com",
      name: "Jordan Lee",
      slug: "jordan-lee",
      bio: "Staff writer covering SEO and content strategy.",
      role: UserRole.WRITER,
      passwordHash: hashPassword("password123456")
    }
  });

  await prisma.post.create({
    data: {
      slug: "launching-seo-first-content-platform",
      title: "Launching an SEO-First Content Platform",
      excerpt: "How to build a publishing workflow that balances editorial velocity with technical precision.",
      content: [
        "Building a content platform that ranks well requires treating SEO as a first-class concern from the start.",
        "The most effective approach combines structured data, canonical URLs, and fast page loads with editorial workflow.",
        "This architecture scales output while maintaining strict publish controls and indexability."
      ],
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-03-17T09:00:00Z"),
      authorId: editor.id,
      readingTimeMinutes: 3,
      seoTitle: "SEO-First Content Platform Launch Guide",
      seoDescription: "A practical blueprint for building a secure, high-ranking corporate blog with draft isolation.",
      postCategories: { create: [{ categoryId: engineering.id }, { categoryId: seo.id }] },
      faqs: {
        create: [
          {
            question: "How often should we publish?",
            answer: "Consistency matters more than frequency. Two strong articles per week can outperform daily thin content.",
            sortOrder: 0
          },
          {
            question: "Should we use ISR or SSG?",
            answer: "ISR offers static performance while allowing targeted freshness after publish events.",
            sortOrder: 1
          }
        ]
      }
    }
  });

  await prisma.post.create({
    data: {
      slug: "editorial-workflows-that-scale",
      title: "Editorial Workflows That Scale",
      excerpt: "Draft isolation patterns that let large teams publish without stepping on each other.",
      content: ["Draft content for a post that has not been published yet."],
      status: PostStatus.DRAFT,
      authorId: writer.id,
      postCategories: { create: [{ categoryId: growth.id }] }
    }
  });

  console.log("Seed complete. Login with editor@example.com / password123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
