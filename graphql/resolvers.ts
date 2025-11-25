import type { ContentBlock } from "@prisma/client";
import { prisma } from "./prismaClient";
import { JSONScalar } from "./utils/jsonScalar";
import { getDefaultPayload, type BlockKey } from "./utils/defaults";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const deepMerge = (
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> => {
  const result = deepClone(target);

  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

const ensureBlock = async (key: BlockKey): Promise<ContentBlock> => {
  return prisma.contentBlock.upsert({
    where: { key },
    create: { key, payload: getDefaultPayload(key) },
    update: {},
  });
};

const normalizePayload = (key: BlockKey, payload: unknown) => {
  const base = getDefaultPayload(key) as Record<string, unknown>;
  const source = isPlainObject(payload) ? payload : {};
  return deepMerge(base, source);
};

const toResponse = (key: BlockKey, block: ContentBlock) => {
  const payload = normalizePayload(key, block.payload);
  return { id: block.id, ...payload };
};

const createQueryResolver = (key: BlockKey) => async () => {
  const block = await ensureBlock(key);
  return [toResponse(key, block)];
};

const createMutationResolver = (key: BlockKey) => async (
  _: unknown,
  { input }: { input?: Record<string, unknown> | null }
) => {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input payload");
  }

  const block = await ensureBlock(key);
  const existingPayload = normalizePayload(key, block.payload);
  const nextPayload = deepMerge(existingPayload, input as Record<string, unknown>);

  const updated = await prisma.contentBlock.update({
    where: { id: block.id },
    data: { payload: nextPayload },
  });

  return toResponse(key, updated);
};

// ========== 论坛相关 Resolvers ==========

// 假数据（当数据库未配置时使用）
const mockCategories = [
  { id: 1, name: '技术讨论', slug: 'technology', description: '分享技术话题', icon: '💻', color: '#1d2088', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), postCount: 3 },
  { id: 2, name: '设计分享', slug: 'design', description: '设计灵感与作品', icon: '🎨', color: '#e91e63', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), postCount: 2 },
  { id: 3, name: '生活随笔', slug: 'life', description: '记录生活点滴', icon: '📝', color: '#4caf50', order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), postCount: 1 },
];

const mockPosts = [
  {
    id: 1,
    title: '欢迎来到论坛！',
    slug: 'welcome-to-forum',
    content: '<p>这是一个示例帖子。配置好数据库后，你可以创建真实的帖子。</p><p>功能包括：</p><ul><li>富文本编辑</li><li>评论和回复</li><li>分类管理</li><li>置顶和锁定</li></ul>',
    excerpt: '欢迎使用论坛系统！这是一个功能完整的论坛，支持富文本、评论、分类等功能。',
    author: 'Admin',
    authorEmail: 'admin@example.com',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    views: 42,
    isPinned: true,
    isLocked: false,
    categoryId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentCount: 3,
  },
  {
    id: 2,
    title: '如何配置数据库',
    slug: 'how-to-setup-database',
    content: '<p>要使用真实数据，请配置 PostgreSQL 数据库：</p><ol><li>更新 .env 文件中的 DATABASE_URL</li><li>运行 pnpm prisma migrate dev</li><li>刷新页面</li></ol>',
    excerpt: '了解如何配置 PostgreSQL 数据库以使用真实数据。',
    author: 'System',
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    views: 28,
    isPinned: false,
    isLocked: false,
    categoryId: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    commentCount: 1,
  },
];

// Category Resolvers
const CategoryResolvers = {
  Query: {
    categories: async () => {
      try {
        const categories = await prisma.category.findMany({
          orderBy: { order: 'asc' },
        });
        return categories.map((cat) => ({
          ...cat,
          postCount: 0,
        }));
      } catch (error) {
        console.warn('⚠️ 数据库未配置，使用假数据');
        return mockCategories;
      }
    },
    category: async (_: unknown, { id, slug }: { id?: number; slug?: string }) => {
      if (id) {
        return await prisma.category.findUnique({ where: { id } });
      }
      if (slug) {
        return await prisma.category.findUnique({ where: { slug } });
      }
      throw new Error('必须提供 id 或 slug');
    },
  },
  Mutation: {
    createCategory: async (_: unknown, { input }: { input: { name: string; slug: string; description?: string; icon?: string; color?: string; order?: number } }) => {
      return await prisma.category.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          icon: input.icon,
          color: input.color || '#1d2088',
          order: input.order || 0,
        },
      });
    },
    updateCategory: async (_: unknown, { id, input }: { id: number; input: { name?: string; slug?: string; description?: string; icon?: string; color?: string; order?: number } }) => {
      return await prisma.category.update({
        where: { id },
        data: input,
      });
    },
    deleteCategory: async (_: unknown, { id }: { id: number }) => {
      await prisma.category.delete({ where: { id } });
      return true;
    },
  },
  Category: {
    postCount: async (parent: { id: number; postCount?: number }) => {
      // 如果是假數據，已經包含 postCount 字段
      if (parent.postCount !== undefined) {
        return parent.postCount;
      }
      // 嘗試從數據庫獲取
      try {
        return await prisma.post.count({ where: { categoryId: parent.id } });
      } catch (error) {
        return 0;
      }
    },
  },
};

// Post Resolvers
const PostResolvers = {
  Query: {
    posts: async (_: unknown, { page = 1, pageSize = 20, categoryId, search }: { page?: number; pageSize?: number; categoryId?: number; search?: string }) => {
      try {
        const where: { categoryId?: number; OR?: { title: { contains: string }; content: { contains: string } }[] } = {};

        if (categoryId) {
          where.categoryId = categoryId;
        }

        if (search) {
          where.OR = [
            { title: { contains: search } },
            { content: { contains: search } },
          ];
        }

        const total = await prisma.post.count({ where });
        const posts = await prisma.post.findMany({
          where,
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' },
          ],
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: { category: true },
        });

        return {
          posts,
          total,
          page,
          pageSize,
          hasMore: total > page * pageSize,
        };
      } catch (error) {
        console.warn('⚠️ 数据库未配置，使用假数据');
        const filteredPosts = mockPosts
          .filter(p => !categoryId || p.categoryId === categoryId)
          .map(p => ({
            ...p,
            category: mockCategories.find(c => c.id === p.categoryId)!,
          }));

        return {
          posts: filteredPosts,
          total: filteredPosts.length,
          page: 1,
          pageSize: 20,
          hasMore: false,
        };
      }
    },
    post: async (_: unknown, { id, slug }: { id?: number; slug?: string }) => {
      if (id) {
        return await prisma.post.findUnique({
          where: { id },
          include: { category: true },
        });
      }
      if (slug) {
        return await prisma.post.findUnique({
          where: { slug },
          include: { category: true },
        });
      }
      throw new Error('必须提供 id 或 slug');
    },
    pinnedPosts: async () => {
      try {
        return await prisma.post.findMany({
          where: { isPinned: true },
          orderBy: { createdAt: 'desc' },
          include: { category: true },
        });
      } catch (error) {
        console.warn('⚠️ 数据库未配置，使用假数据');
        return mockPosts
          .filter(p => p.isPinned)
          .map(p => ({
            ...p,
            category: mockCategories.find(c => c.id === p.categoryId)!,
          }));
      }
    },
  },
  Mutation: {
    createPost: async (_: unknown, { input }: { input: { title: string; slug: string; content: string; excerpt?: string; author: string; authorEmail?: string; coverImage?: string; categoryId: number; isPinned?: boolean; isLocked?: boolean } }) => {
      return await prisma.post.create({
        data: input,
        include: { category: true },
      });
    },
    updatePost: async (_: unknown, { id, input }: { id: number; input: { title?: string; slug?: string; content?: string; excerpt?: string; author?: string; authorEmail?: string; coverImage?: string; categoryId?: number; isPinned?: boolean; isLocked?: boolean } }) => {
      return await prisma.post.update({
        where: { id },
        data: input,
        include: { category: true },
      });
    },
    deletePost: async (_: unknown, { id }: { id: number }) => {
      await prisma.post.delete({ where: { id } });
      return true;
    },
    incrementPostViews: async (_: unknown, { id }: { id: number }) => {
      return await prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
        include: { category: true },
      });
    },
  },
  Post: {
    commentCount: async (parent: { id: number; commentCount?: number }) => {
      // 如果是假數據，已經包含 commentCount 字段
      if (parent.commentCount !== undefined) {
        return parent.commentCount;
      }
      // 嘗試從數據庫獲取
      try {
        return await prisma.comment.count({ where: { postId: parent.id } });
      } catch (error) {
        return 0;
      }
    },
  },
};

// Comment Resolvers
const CommentResolvers = {
  Query: {
    comments: async (_: unknown, { postId }: { postId: number }) => {
      return await prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    },
    comment: async (_: unknown, { id }: { id: number }) => {
      return await prisma.comment.findUnique({
        where: { id },
        include: { replies: true },
      });
    },
  },
  Mutation: {
    createComment: async (_: unknown, { input }: { input: { content: string; author: string; authorEmail?: string; postId: number; parentId?: number } }) => {
      return await prisma.comment.create({
        data: input,
        include: { replies: true },
      });
    },
    updateComment: async (_: unknown, { id, input }: { id: number; input: { content?: string } }) => {
      return await prisma.comment.update({
        where: { id },
        data: input,
        include: { replies: true },
      });
    },
    deleteComment: async (_: unknown, { id }: { id: number }) => {
      await prisma.comment.delete({ where: { id } });
      return true;
    },
  },
};

const Query = {
  homePage: createQueryResolver("homePage"),
  logo: createQueryResolver("logo"),
  color: createQueryResolver("color"),
  // 论坛相关
  ...CategoryResolvers.Query,
  ...PostResolvers.Query,
  ...CommentResolvers.Query,
};

const Mutation = {
  updateHomePage: createMutationResolver("homePage"),
  updateLogo: createMutationResolver("logo"),
  updateColor: createMutationResolver("color"),
  // 论坛相关
  ...CategoryResolvers.Mutation,
  ...PostResolvers.Mutation,
  ...CommentResolvers.Mutation,
};

const resolvers = {
  JSON: JSONScalar,
  Query,
  Mutation,
  Category: CategoryResolvers.Category,
  Post: PostResolvers.Post,
};

export default resolvers;
